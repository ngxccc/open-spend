# 3. Monorepo Topology and Drizzle ORM Architecture

Status: Accepted
Date: 2026-10-11
Deciders: Core Architecture Team

## Context

OpenSpend began as a standalone mobile repository built with Expo. Following architectural decisions establishing an offline-first mobile client with cloud synchronization (ADR-0001, ADR-0002), the project requires a backend API, synchronization endpoints, and a shared domain contract layer.

Maintaining mobile and backend as separate repositories creates operational friction:

- Synchronization contracts, Zod validation schemas, and TypeScript Data Transfer Objects (DTOs) must be duplicated or published to private package registries.
- Contract migrations across client and server require coordinated multi-repository pull requests, increasing the risk of protocol mismatch.
- Mobile persistence requires a type-safe, lightweight Object-Relational Mapping (ORM) layer that operates on `expo-sqlite` without runtime bloat.

To ensure consistency across the stack and maintain high developer velocity, decisions regarding repository topology, database tooling, and client-server code sharing must be formalized.

## Decision

We establish a monorepo workspace topology powered by Bun Workspaces and standardize on Drizzle ORM:

1. **Monorepo Topology (Bun Workspaces)**:
   - Structure the repository into two applications and shared packages:
     - `apps/mobile`: The Expo / React Native mobile application.
     - `apps/server`: The cloud backend API handling authentication and synchronization.
     - `packages/shared`: Shared domain contracts, Zod validation schemas, and DTO types.
   - Utilize native Bun workspaces (`bun.lock`) for dependency hoisting and atomic cross-package linking.
2. **Mobile Database Layer (Drizzle ORM for Expo SQLite)**:
   - Adopt `drizzle-orm/expo-sqlite` as the type-safe query builder for local persistence. Drizzle operates as a zero-overhead abstraction directly over `openDatabaseSync`, providing full compile-time type safety without heavyweight runtime reflection.
   - Centralize all Drizzle schemas under `apps/mobile/src/database/schemas/*` using `snakeCase.table` and `defineRelations` to prevent circular dependencies and streamline Drizzle Kit migration generation.
3. **Backend Database Layer (PostgreSQL with Drizzle ORM)**:
   - Deploy PostgreSQL for server-side persistence via `@neondatabase/serverless` and `drizzle-orm/neon-http` (or `drizzle-orm/node-postgres`), centralized under `apps/server/src/database/schemas/*` using `snakeCase.table` and `defineRelations`.
   - Define dialect-specific schemas while validating common domain contracts using shared Zod schemas from `packages/shared`.
4. **Schema Modeling Conventions (Theme-Aware & Timezone-Safe)**:
   - **Theme-Aware Visual Tokens (`icon`, `color`)**: Keep `icon` and `color` columns nullable without hardcoded database defaults so UI layers can dynamically resolve fallback icons and theme-adaptive colors across Light/Dark modes.
   - **Timezone-Safe Transaction Dates (`occurredAt` + `minuteOfDay`)**: Separate financial calendar dates (`occurredAt` as `YYYY-MM-DD`) from optional local intraday ordering (`minuteOfDay` as `0..1439`) and technical instants (`createdAt` / `updatedAt`). UI forms default `occurredAt` and `minuteOfDay` to current local time while permitting null `minuteOfDay` when backdating date-only entries.
5. **Feature-Driven Domain Module Structure**:
   - Organize application domain logic under `src/modules/*` (`wallets`, `expenses`, `incomes`, `categories`, `transfers`, `schedules`, and `sync`) consuming the centralized database layer.

## Positive Consequences

- Atomic cross-stack pull requests: sync API modifications and mobile client changes can be developed, tested, and reviewed together.
- Eliminates code duplication by sharing Zod validation rules and TypeScript DTOs between client and server.
- Provides end-to-end type safety on mobile SQLite with zero runtime overhead from Drizzle ORM.
- Modular code structure aligns directly with domain invariants defined in system design specifications.

## Negative Consequences / Risks

- Monorepo tooling requires careful dependency management to prevent mobile React Native dependencies from leaking into the backend runtime.
- Dual Drizzle dialects (`sqliteTable` vs `pgTable`) require maintaining separate table definitions across mobile and server codebases.
- CI/CD pipelines must configure path filters or task orchestration (e.g., Turborepo) to avoid building the mobile app on backend-only changes.

## Explicit Tradeoffs

- **Monorepo vs Multi-Repo Isolation**: Accept monorepo build configuration overhead in exchange for atomic full-stack commits and zero-friction contract sharing.
- **Dialect-Specific Drizzle Schemas vs Unified ORM**: Accept separate schema definitions in exchange for utilizing native PostgreSQL constraints on the server and native SQLite storage on the mobile client.
- **Drizzle ORM vs Raw SQL Strings**: Accept an additional compilation dependency in exchange for compile-time query safety, automatic migrations, and IDE auto-completion.
