# AGENTS.md

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, accessibility, and cross-platform compatibility.

---

## Expo SDK 57 Directives

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json` (currently **SDK 57**).
2. Fetch matching versioned docs: `https://docs.expo.dev/versions/v57.0.0/`.
3. For anything else, fetch `https://docs.expo.dev/llms.txt` — index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page needed; never answer from memory.

---

## Tech Stack & Commands

Use `bun` and `bunx` for all package operations (`bun.lock` is the single source of truth):

```bash
bun run start               # start the Expo development server
bun run check               # run format check, type-aware lint, and typecheck in one pass
bun run format              # format code using oxfmt
bun run lint                # type-aware lint using oxlint
bun run typecheck           # TypeScript compiler check (tsc --noEmit)
bun run test:e2e            # run Maestro E2E test flows (.maestro/)
bun run build               # trigger EAS Android preview APK build
npx expo install <package>  # ALWAYS use to install dependencies (resolves SDK-compatible versions)
```

Run `bun run check` before declaring any task done.

---

## Navigation & Architecture

- **Expo Router**: All routes live in `src/app/` — each file is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- **Imports**: Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- **UI & Primitives**: Use components from `src/components/ui/` (wrapped with typography/safe-area safeguards) and icons from `src/components/icons/` or `lucide-react-native`.

---

## Native Rules & Continuous Native Generation (CNG)

- If `ios/` and `android/` directories do not exist, they are generated. Never create or edit them by hand — configure native behavior in `app.json`, `app.config.ts`, and config plugins.
- Expo Go only includes bundled native modules. When adding libraries with custom native code, use development builds: `bun run android` or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries.

---

## Engineering Standards

MUST read the corresponding standard file under `docs/standards/` before modifying related code or tests:

- **Issue tracking & tickets** → `docs/standards/issue-tracker.md`
- **Domain glossary & ADRs** → `docs/standards/domain-docs.md`
- **Comments & docstrings** → `docs/standards/code-comment-taxonomy.md`
- **Routes, DTOs, and error responses** → `docs/standards/api-design-and-error-handling.md`
- **Schemas, queries, and migrations** → `docs/standards/database-and-migrations.md`
- **Locks, race conditions, and transactions** → `docs/standards/concurrency-and-locking.md`
- **Tests, factories, and fixtures** → `docs/standards/testing-and-fixtures.md`
- **Auth, hashing, and sanitization** → `docs/standards/security-and-cryptography.md`
- **Branches, commits, and PRs** → `docs/standards/git-flow-and-pr-matrix.md`

---

## Working Guidelines & Skill Workflows

1. **Domain Terms**: Use terms strictly as defined in `CONTEXT.md` (Expense, Income, Category, Wallet). Avoid non-standard synonyms.
2. **Engineered Skill Workflows**:
   - **Requirement Alignment**: Use `/grill-with-docs` (or `/grill-me`) to clarify feature scope and update ADRs/glossary.
   - **Specification & Tickets**: Use `/to-spec` to lock specs and `/to-tickets` to split into tracer-bullet tickets.
   - **Feature Implementation**: Use `/implement` + `/tdd` to write features test-first.
   - **Bug Diagnosis**: Use `/diagnosing-bugs` for disciplined root-cause analysis before editing.
   - **Code Review**: Use `/code-review` before committing to verify spec compliance and code standards.
   - **Architecture Maintenance**: Use `/improve-codebase-architecture` periodically to deepen module design.
