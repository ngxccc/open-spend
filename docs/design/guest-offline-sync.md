---
title: "Guest Mode and Offline-First Synchronization Architecture"
docType: "feature-workflow"
status: "approved"
date: 2026-10-11
author: "ngxc"
version: "1.0.0"
---

# Guest Mode and Offline-First Synchronization Architecture

---

## Overview & Context

OpenSpend supports both unauthenticated guest users and authenticated cloud-synced accounts. Guest users store all financial transactions locally on-device without requiring an internet connection or registration. When a guest user decides to create an account or log in, their local financial data is promoted and synchronized to the cloud backend.

### Problem Statement & Key Requirements

1. **Guest Isolation & Zero-Friction Cold Start**: Users must be able to immediately manage wallets and record expenses/incomes offline with zero network dependency.
2. **Lossless Account Promotion & Conflict Resolution**: Converting a guest session into an authenticated account must safely resolve potential conflicts if the account already contains remote cloud records (offering merge or replace strategies).
3. **Hybrid Background & Manual Synchronization**: Synchronization must run automatically in the background (debounced after mutations or when the app becomes active) and also support on-demand manual triggers (pull-to-refresh / sync button).
4. **Sub-Cent Financial Precision**: Bank wallets and investments often require fractional currency decimals (e.g., fractional interests, foreign exchange). The system must eliminate IEEE-754 floating-point rounding errors.
5. **Flexible Scheduled Transactions**: Recurring expenses (such as daily parking or commute fares) must support scheduled rules with configurable execution policies (`AUTO_POST` for automatic ledger entries or `CONFIRM_PROMPT` for manual confirmation before debiting).

### Learnings from Moonee Backup Analysis

Analysis of the legacy Moonee data archive (`moonee-backup-latest.zip`) identified architectural patterns to adopt and avoid:

- **Adopted**: Time-ordered partitioning for data backups, integer/fixed-point minor unit representation for currencies, and soft-delete audit records for change tracking.
- **Pruned (Anti-Patterns)**: Multi-layer accounting structures (`items` $\rightarrow$ `ledgerEvents` $\rightarrow$ `accountPostings`), unused speculative tables (wealth profiles, cart sessions, lending goals), and terminology drift. All domain terms are standardized strictly against `CONTEXT.md` (`Wallet`, `Expense`, `Income`, `Category`).

---

## Architecture

### System Context

```mermaid
flowchart TD
    subgraph Monorepo["Monorepo Workspace (Bun Workspaces)"]
        Shared["packages/shared<br/>(Zod Schemas & DTO Contracts)"]

        subgraph Client["apps/mobile (Expo / React Native)"]
            UI["UI Layer (FlashList / Reanimated)"]
            State["State Cache (Zustand / MMKV)"]
            DrizzleClient["Drizzle ORM (expo-sqlite)"]
            SQLite[("Local SQLite")]
            Outbox[("sync_queue Table")]
            Scheduler["Schedule Evaluation Worker"]
            SyncWorker["Sync Client Worker"]
        end

        subgraph Backend["apps/server (Cloud Backend)"]
            Gateway["API Gateway / Auth Guard"]
            SyncCtrl["Sync Controller"]
            DrizzleServer["Drizzle ORM (PostgreSQL)"]
            CloudDB[("Cloud PostgreSQL")]
        end
    end

    Shared -->|"Validate & Type"| Client
    Shared -->|"Validate & Type"| Backend
    UI --> State
    State --> DrizzleClient
    DrizzleClient --> SQLite
    Scheduler -->|"Evaluate Rules"| DrizzleClient
    DrizzleClient -->|"Atomic Write"| Outbox
    SyncWorker -->|"Read Pending Mutations"| Outbox
    SyncWorker <-->|"Push Mutations & Pull Deltas"| Gateway
    Gateway --> SyncCtrl
    SyncCtrl --> DrizzleServer
    DrizzleServer <--> CloudDB
```

### Storage & Identification Architecture

1. **Primary Key Strategy (UUID v7)**: Every entity (`Wallet`, `Expense`, `Income`, `Category`, `Transfer`, `Schedule`) generates a client-side UUID v7 identifier upon creation. UUID v7 embeds millisecond Unix timestamps in the high 48 bits, providing strict chronological ordering for SQLite B-tree clustering and distributed synchronization without ID collisions.
2. **Monetary Decimal Representation**: Currency values are persisted as exact fixed-point strings (`TEXT` in SQLite / `DECIMAL(18, 4)` in PostgreSQL). Arithmetic operations must use arbitrary-precision decimal libraries (`decimal.js` or `big.js`) to guarantee exact balance tracking without floating-point inaccuracies.
3. **Symbol References**:
   - `WalletEntity` in `src/modules/wallets/wallet.entity.ts`
   - `ExpenseEntity` in `src/modules/expenses/expense.entity.ts`
   - `IncomeEntity` in `src/modules/incomes/income.entity.ts`
   - `CategoryEntity` in `src/modules/categories/category.entity.ts`
   - `TransferEntity` in `src/modules/transfers/transfer.entity.ts`
   - `ScheduleEntity` in `src/modules/schedules/schedule.entity.ts`
   - `SyncQueueEntity` in `src/modules/sync/sync-queue.entity.ts`

4. **ORM and Persistence Technology (Drizzle ORM)**:
   - **Mobile**: Uses `drizzle-orm/expo-sqlite` wrapping `openDatabaseSync`. Schema definitions utilize `sqliteTable` with full compile-time typing, zero reflection overhead, and migration versioning via Drizzle Kit.
   - **Backend**: Uses `drizzle-orm/node-postgres` with `pgTable` definitions enforcing server-side relational constraints and indexing.
   - **Contracts**: Shared input validation and synchronization payloads are defined in `packages/shared` via Zod and inferred TypeScript types.
5. **Module Directory Layout (`apps/mobile/src/modules/*`)**:
   - `wallets/`: `wallet.schema.ts`, `wallet.service.ts`
   - `expenses/`: `expense.schema.ts`, `expense.service.ts`
   - `incomes/`: `income.schema.ts`, `income.service.ts`
   - `categories/`: `category.schema.ts`, `category.service.ts`
   - `transfers/`: `transfer.schema.ts`, `transfer.service.ts`
   - `schedules/`: `schedule.schema.ts`, `schedule.runner.ts`
   - `sync/`: `sync-queue.schema.ts`, `sync.worker.ts`, `sync.client.ts`

---

## Operational Flow

### 1. Guest-to-Account Promotion & Conflict Resolution

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant App as Mobile App
    participant Outbox as SQLite sync_queue
    participant API as Backend Sync API
    participant CloudDB as Cloud Database

    User->>App: Tap "Log In / Register"
    App->>API: POST /api/v1/auth/login
    API-->>App: Return JWT Token & Account Metadata (has_cloud_data flag)

    alt Account has NO existing cloud data (New Account)
        App->>App: Update local records: set user_id = authenticated_user_id
        App->>API: POST /api/v1/sync/promote (Bulk import local records)
        API->>CloudDB: Insert all records in single transaction
        CloudDB-->>API: Commit OK
        API-->>App: Promotion Success
    else Account HAS existing cloud data
        App->>User: Display Conflict Prompt (Merge vs Replace)
        alt User selects MERGE
            App->>App: Update local records: set user_id = authenticated_user_id
            App->>API: POST /api/v1/sync/push (Push guest outbox queue)
            API->>CloudDB: Upsert records
            API-->>App: Push Acknowledged
            App->>API: GET /api/v1/sync/pull?since=0
            API-->>App: Return complete cloud dataset
            App->>App: Merge cloud records into local SQLite
        else User selects REPLACE
            App->>App: Purge all local guest records and pending sync_queue
            App->>API: GET /api/v1/sync/pull?since=0
            API-->>App: Return complete cloud dataset
            App->>App: Hydrate local SQLite from cloud dataset
        end
    end
    App-->>User: Navigate to Dashboard (Sync Active)
```

### 2. Hybrid Synchronization (Background & Manual)

```mermaid
sequenceDiagram
    autonumber
    participant UI as User Interaction / AppState
    participant Worker as Sync Worker
    participant Outbox as SQLite sync_queue
    participant API as Backend Sync API
    participant CloudDB as Cloud Database

    UI->>Worker: Trigger Sync (Mutation Debounce / App Active / Manual Button)
    Worker->>Worker: Check network availability & authenticated status
    alt Offline or Unauthenticated Guest
        Worker-->>UI: Abort sync silently (or show Offline toast if manual)
    else Online & Authenticated
        Worker->>Outbox: Read pending items (status = PENDING ORDER BY id ASC)
        alt Outbox has pending mutations
            Worker->>API: POST /api/v1/sync/push (Payload: mutations batch)
            API->>CloudDB: Execute batch transactional upserts & soft-deletes
            CloudDB-->>API: Batch success
            API-->>Worker: Push Ack (Processed IDs)
            Worker->>Outbox: DELETE FROM sync_queue WHERE id IN (Processed IDs)
        end
        Worker->>API: GET /api/v1/sync/pull?since={last_synced_at}
        API->>CloudDB: SELECT * WHERE updated_at > since AND user_id = current_user
        CloudDB-->>API: Delta records
        API-->>Worker: Return deltas (Created/Updated/Deleted)
        Worker->>Worker: Apply deltas to SQLite tables (UPSERT & Soft Delete)
        Worker->>Worker: Update local last_synced_at timestamp
        Worker-->>UI: Emit sync complete event (Update UI / Hide spinner)
    end
```

### 3. Scheduled Transactions Execution

```mermaid
sequenceDiagram
    autonumber
    participant App as App Lifecycle / Startup
    participant Engine as Schedule Engine
    participant SQLite as SQLite DB
    participant UI as Toast / Notification UI

    App->>Engine: Evaluate Schedules (On app open or midnight tick)
    Engine->>SQLite: Query active schedules WHERE is_active = 1
    loop Each Active Schedule
        Engine->>Engine: Verify schedule recurrence (cron_rule / days_of_week)
        alt Recurrence matches today AND last_executed_at < today
            alt execution_mode == AUTO_POST
                Engine->>SQLite: INSERT INTO expenses (amount, title, wallet_id, category_id)
                Engine->>SQLite: UPDATE schedules SET last_executed_at = today
                Engine->>UI: Show Toast ("Auto-recorded scheduled expense: 4,000 VND")
            else execution_mode == CONFIRM_PROMPT
                Engine->>UI: Show In-App Confirmation ("Record 4,000 VND for Parking?")
                opt User Confirms
                    UI->>SQLite: INSERT INTO expenses (...)
                    UI->>SQLite: UPDATE schedules SET last_executed_at = today
                end
            end
        end
    end
```

---

## Security & Reliability

1. **Authentication & Token Storage**:
   - Authenticated API requests require an `Authorization: Bearer <JWT>` header.
   - Refresh tokens and access tokens are secured using `expo-secure-store`.
   - Guest mode operates entirely locally with zero token footprint.
2. **Atomic Outbox Mutation Queue**:
   - Any local write operation modifying `wallets`, `expenses`, `incomes`, `categories`, `transfers`, or `schedules` must insert a corresponding mutation entry into `sync_queue` within the same SQLite transaction.
   - If SQLite crashes mid-operation, both the entity change and the outbox entry roll back together, preventing synchronization inconsistencies.
3. **Idempotent Upsert Semantics**:
   - Cloud push endpoints process mutations idempotently using UUID v7 primary keys. Re-transmitting an already processed mutation has no adverse side effects.
4. **Offline Resilience & Degradation**:
   - The application functions with 100% feature capability while offline. Network failures during background sync increment retry counters with exponential backoff (`Math.min(2 ** attempts * 1000, 30000)` ms) without interrupting the user interface.
5. **Conflict Resolution Policy**:
   - Synchronization applies Last-Write-Wins (LWW) resolution based on UTC ISO-8601 `updated_at` timestamps. Soft-deleted records (`deleted_at IS NOT NULL`) tombstone entities across clients.

---

## Domain Invariant Taxonomy (INV-N)

| Invariant ID   | Domain Invariant Name          | Formal Condition                                                                                                                     | Verification Test Strategy                                                                |
| :------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **INV-SYNC-1** | Client ID Immutability         | `entity.id` remains invariant throughout guest and cloud-synced lifecycles.                                                          | Unit test verifying UUID v7 persistence before and after cloud promotion.                 |
| **INV-SYNC-2** | Atomic Outbox Commitment       | $\forall m \in \text{Mutations}, \Delta(\text{Entity}) \iff \Delta(\text{sync\_queue})$ within the same SQLite transaction.          | Rollback test confirming failure in entity write yields no dangling outbox row.           |
| **INV-SYNC-3** | Monotonic Queue Ordering       | Outbox processing order strictly satisfies $i < j \implies \text{created\_at}(i) \le \text{created\_at}(j)$.                         | Integration test processing outbox mutations against mock backend.                        |
| **INV-SYNC-4** | Transfer Balance Conservation  | $\Delta(\text{from\_wallet}) = -(\text{amount} + \text{fee}) \land \Delta(\text{to\_wallet}) = +\text{amount}$.                      | Test verifying bilateral balance adjustment on `transfers`.                               |
| **INV-SYNC-5** | Fixed-Point Monetary Precision | $\forall \text{amount}, \text{scale}(\text{amount}) \le 4 \land \text{amount} \in \mathbb{D}$ (no IEEE-754 binary float conversion). | Unit test verifying exact arithmetic on decimal fractions (e.g., `0.10 + 0.20 === 0.30`). |
| **INV-SYNC-6** | Schedule Execution Exclusivity | For any given schedule $s$, $\text{count}(\text{executions}(s, d)) \le 1$ for date $d$.                                              | Test verifying idempotency when schedule evaluation executes multiple times on same date. |
