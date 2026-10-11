# 2. Guest Mode and Hybrid Synchronization Architecture

Status: Accepted
Date: 2026-10-11
Deciders: Core Architecture Team

## Context

OpenSpend requires an onboarding experience that permits instant user interaction without registration barriers. Users must be able to launch the application as a guest, create multiple wallets, and track expenses and incomes entirely offline. When a user subsequently creates an account or logs in, their locally accumulated financial ledger must be synchronized to cloud infrastructure without data loss.

An analysis of historical transaction data archives from related personal finance tooling (`moonee-backup-latest.zip`) identified that:
- Multi-tier bookkeeping models (`items` $\rightarrow$ `ledgerEvents` $\rightarrow$ `accountPostings`) introduce unnecessary complexity for single-user personal finance applications.
- Floating-point representations (`REAL` / binary IEEE-754 floats) introduce rounding discrepancies in account balances with fractional currency components (e.g., fractional bank interest and foreign exchange rates).
- Offline-first distributed systems require client-generated primary keys to prevent primary key collisions during multi-device or guest-to-cloud promotion.
- Scheduled recurring expenses (e.g., commute fares or school parking) require a balance between automated recording and manual confirmation to accommodate schedule exceptions without compromising ledger accuracy.

Architectural decisions are required to establish the data schema, identification strategy, monetary precision standard, and synchronization lifecycle.

## Decision

We establish a single-layer offline-first architecture with hybrid synchronization:

1. **Client-Generated UUID v7 Identifiers**: Mandate UUID v7 for primary keys across all domain entities (`Wallet`, `Expense`, `Income`, `Category`, `Transfer`, and `Schedule`). UUID v7 embeds millisecond-level timestamps for B-tree index locality in SQLite and eliminates identifier conflicts when synchronizing guest data with cloud storage.
2. **Fixed-Point Monetary Precision**: Store all monetary values as exact fixed-point strings (`TEXT` in SQLite / `DECIMAL(18, 4)` in cloud storage) with scale of 4 decimal places. Arithmetic operations must execute via arbitrary-precision libraries (`decimal.js`) to guarantee exact balance calculations.
3. **Outbox Pattern and Hybrid Synchronization**: Local entity mutations atomically write to an outbox table (`sync_queue`) within the same SQLite transaction. A background sync worker debounces queue flushes when network connectivity is present, supplemented by explicit manual pull-to-refresh synchronization. Remote changes are retrieved incrementally via timestamp delta queries (`since={last_synced_at}`).
4. **Interactive Guest Promotion Policy**: When an unauthenticated guest logs into an account that already contains remote cloud records, the application displays a confirmation prompt offering two explicit strategies:
   - **Merge**: Associate local guest records with the authenticated user ID and bidirectionally reconcile local and cloud ledgers.
   - **Replace**: Discard local guest records and hydrate the local SQLite database from the cloud backup.
5. **Configurable Schedule Execution**: Support recurring financial events through a dedicated schedule entity with an `execution_mode` flag. Users may configure individual schedules to either automatically record ledger entries (`AUTO_POST`) or prompt for user confirmation before debiting (`CONFIRM_PROMPT`).

## Positive Consequences

- Delivers frictionless guest onboarding with full offline functionality from first launch.
- Eliminates cloud ID collision risks and secondary ID remapping workflows during data synchronization.
- Preserves exact currency balances across fractional bank transactions without floating-point rounding errors.
- Provides resilient, fault-tolerant offline mutations backed by transactional SQLite outbox guarantees.
- Allows flexible management of recurring expenses with support for irregular schedule exceptions.

## Negative Consequences / Risks

- Client-side outbox queue requires storage management and periodic pruning of acknowledged mutations.
- Bidirectional merging of local and cloud ledgers during guest promotion may result in duplicate user-created categories if named similarly.
- String-based fixed-point arithmetic incurs minor CPU overhead compared to native binary floating-point operations.

## Explicit Tradeoffs

- **Client-Generated UUID v7 vs Server Sequential IDs**: Accept larger 128-bit storage footprint in exchange for collision-free offline entity generation and natural chronological index ordering.
- **Fixed-Point String Arithmetic vs Native Float Operations**: Accept parsing overhead in exchange for mathematical precision and elimination of currency reconciliation discrepancies.
- **Outbox Queue vs Simple Timestamp Deltas**: Accept queue table maintenance complexity in exchange for atomic mutation tracking and reliable offline retry guarantees.
