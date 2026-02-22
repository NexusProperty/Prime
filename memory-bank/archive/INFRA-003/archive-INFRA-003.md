# TASK ARCHIVE: INFRA-003 — E2E Tests @prime/ui-ai Type Imports

## METADATA

- **Task ID:** INFRA-003
- **Date Completed:** 2026-02-22
- **Complexity:** Level 1 — Targeted Enhancement
- **Files Changed:** 3 (1 created, 2 modified)
- **Source Consolidated:** `memory-bank/reflection/INFRA-003/reflection-INFRA-003.md`

---

## SUMMARY

Updated the Playwright E2E test suite to import shared types from `@prime/ui-ai` instead of defining inline duplicates. Created a root-level `tsconfig.json` to enable path resolution for the package across the monorepo root. Two spec files were updated to use `CrossSellData` from the package. All changes were type-only (erased at runtime) — 0 lint errors, no impact on test logic.

---

## IMPLEMENTATION

### Files Changed

| File | Action | Description |
|------|--------|-------------|
| `f:\Prime\tsconfig.json` | Created | Root tsconfig with `@prime/ui-ai` path alias; includes `e2e/**/*.ts` and `playwright.config.ts` |
| `f:\Prime\e2e\cross-sell-edge-cases.spec.ts` | Modified | Added `import type { CrossSellData } from '@prime/ui-ai'`; replaced inline `LeadSubmitResponse.crossSell` type with `CrossSellData` |
| `f:\Prime\e2e\api-leads.spec.ts` | Modified | Added `import type { CrossSellData } from '@prime/ui-ai'`; updated inline type assertion in "cross-sell detected" test |

### Scope Decision

4 of 6 E2E spec files were intentionally not changed (`booking-wizard.spec.ts`, `lead-capture-form.spec.ts`, `voice-flow.spec.ts`, `jobs-sync.spec.ts`) — they had no inline types that map to exports from `@prime/ui-ai`.

---

## TESTING

- `ReadLints` on all 3 modified files → 0 errors
- `@prime/ui-ai` was already symlinked at `node_modules/@prime/ui-ai` via npm workspaces — no install required

---

## LESSONS LEARNED

- When shared packages are added to a monorepo, a root-level `tsconfig.json` should be created at the same time to cover root-level test tooling (Playwright, Jest, Vitest) that lives outside any site's tsconfig scope
- `import type` is the correct pattern for E2E test files importing from UI packages — types are fully erased at runtime, posing zero bundling risk
- Scope assessment before building is critical for one-liner tasks — discovery revealed only 2 of 6 files needed changes

## PROCESS IMPROVEMENTS

- Future shared package additions should include a checklist item: "Create/update root tsconfig.json for test tooling"
- One-liner sprint candidates should get a brief scope note before `/build`

---

## ARCHIVED FILES

| File | Action |
|------|--------|
| `memory-bank/reflection/INFRA-003/reflection-INFRA-003.md` | Consolidated into this archive, then deleted |
