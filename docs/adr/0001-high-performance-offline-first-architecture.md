# 1. High-Performance Offline-First Architecture

Status: Accepted
Date: 2026-10-11
Deciders: Core Architecture Team

## Context

OpenSpend is a personal finance mobile application designed for tracking personal expenses and incomes across multiple wallets. To provide an optimal user experience, financial tracking applications demand instant startup times, reliable offline operability, and smooth scrolling (60–120 FPS) across transaction histories containing thousands of items.

During architectural exploration, adopting or porting source code from the Telegram client ecosystem (such as TDLib in C++, custom direct Android Canvas drawing via `ChatMessageCell`, and iOS Texture/AsyncDisplayKit nodes) was evaluated to emulate Telegram's fluid interface. However, direct porting of Telegram's low-level native codebase introduces severe architectural friction:
- Language and toolchain divergence against the Expo SDK 57 managed workflow (React Native 0.86, TypeScript).
- Maintenance liabilities associated with custom C++ JSI TurboModules and native build configurations, breaking Expo Continuous Native Generation (CNG) guarantees.
- Disproportionate complexity for a personal finance domain where standard React Native optimization paradigms can achieve 120 FPS without leaving the managed ecosystem.

A concrete architecture is required to guarantee peak performance, offline reliability, and developer maintainability.

## Decision

We reject porting native Telegram client source code and instead establish an offline-first, high-performance architecture built on standard React Native and Expo primitives:

1. **Virtualized List Rendering**: Standardize on `@shopify/flash-list` for all high-density financial feeds (displaying `Expense` and `Income` records). FlashList leverages view recycling to sustain 60–120 FPS scrolling while minimizing memory consumption.
2. **Off-Thread Gesture and Animation**: Mandate `react-native-reanimated` worklets and `react-native-gesture-handler` for interactive item actions (such as swipe-to-categorize or swipe-to-delete). All gesture handlers and transitions must execute entirely on the UI thread to keep the JavaScript event loop unblocked.
3. **Offline-First Persistence**: Use `expo-sqlite` as the primary relational persistence engine for domain entities (`Wallet`, `Expense`, `Income`, and `Category`), paired with memory-mapped key-value storage for immediate UI cache hydration. Transactions must write locally first, ensuring instant UI updates without waiting for network I/O.

## Positive Consequences

- Delivers consistent 60–120 FPS user interface responsiveness on both iOS and Android.
- Provides immediate cold-start app rendering and complete offline functionality with zero network latency dependency.
- Preserves full compatibility with Expo managed workflow, EAS Cloud builds, and Over-The-Air (OTA) update pipelines.
- Eliminates native C++/Java/Swift bridging maintenance overhead, allowing the team to focus on domain logic in TypeScript.

## Negative Consequences / Risks

- Client-side SQLite database migrations require versioning and migration testing within the mobile app.
- Dual storage strategy requires synchronization discipline between cached UI states and relational SQLite records.
- Variable cell heights in FlashList require accurate height estimation to prevent visual layout shifts during rapid scrolling.

## Explicit Tradeoffs

- **Managed Framework vs Custom Native Rendering**: Accept standard React Native rendering boundaries over custom native C++/Canvas engines in exchange for rapid feature development and unified cross-platform maintenance.
- **Offline-First Local Storage vs Cloud-First Simplicity**: Accept client-side schema migration and state synchronization complexity in exchange for instantaneous data access and offline availability.
