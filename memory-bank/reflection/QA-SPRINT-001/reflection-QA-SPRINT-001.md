# Reflection — QA-SPRINT-001: Production Build Validation & Supabase Live Wiring

**Date:** 2026-02-21
**Task:** `/qa` validation sprint across all three United Trades sites
**Outcome:** ✅ PASS — All three sites build cleanly with 0 TypeScript errors, live Supabase project connected

---

## What Was Validated

| Site | TypeScript | Build | Notes |
|------|-----------|-------|-------|
| Prime Electrical | ✅ 0 errors | ✅ PASS | 4 pages + 7 API routes |
| AKF Construction | ✅ 0 errors | ✅ PASS | 7 static pages |
| CleanJet | ✅ 0 errors | ✅ PASS | 7 static pages |

---

## Root Cause: `@supabase/supabase-js` v2.97 Breaking Change

The handwritten `database.ts` — which used `interface Database` with manual `Insert`/`Update` types — broke because `@supabase/supabase-js` v2.97 (bundled with `@supabase/postgrest-js` v12) introduced a stricter `GenericTable` constraint requiring:
- A `Relationships: GenericRelationship[]` field on every table entry
- `Insert` and `Update` types that structurally extend `Record<string, unknown>` (requiring an index signature)
- The `__InternalSupabase: { PostgrestVersion: "14.1" }` top-level key on the `Database` interface

Without these, `Schema['Tables'][TableName]` resolved to `never`, causing all `.insert()`, `.update()`, and `.select()` operations to fail type-checking with `Argument of type '...' is not assignable to parameter of type 'never'`.

**Attempted fixes that did NOT work:**
1. Adding `Relationships: []` — `[]` literal doesn't satisfy `GenericRelationship[]`
2. Inlining a local `Relationship` type — structurally correct but didn't resolve `never`
3. `Record<string, unknown> & { ... }` intersections — TypeScript doesn't simplify the intersection to satisfy `Record<string, unknown>` in extends position
4. Fixing `Views: Record<string, never>` — not the root cause
5. Deleting `.tsbuildinfo` cache — same errors persisted

**The actual fix:** Replace the handwritten `database.ts` entirely with the official output of `supabase gen types typescript`, which the Supabase CLI generates in the exact shape `@supabase/supabase-js` expects. This includes the `__InternalSupabase` key and proper `Relationships` arrays.

---

## What Went Well

1. **MCP tooling** — The Supabase MCP (`user-supabase2`) was the key unblock: it let us apply the job_sync migration (`ALTER TABLE leads ADD COLUMN synced_at ...`) and call `generate_typescript_types` in a single round-trip, without needing CLI access or manual SQL.

2. **Migration applied cleanly** — `add_job_sync_columns` applied via `apply_migration` MCP tool with `{"success": true}`. All three tables (`leads`, `customers`, `cross_sell_events`) are now live with correct schema.

3. **Convenience aliases preserved** — The generated `database.ts` was augmented with `SiteBrand`, `LeadStatus`, `CrossSellStatus`, `LeadRow`, `CustomerRow`, and `CrossSellEventRow` type aliases at the bottom, so all existing code that imports these continues to work without any changes to API routes or components.

4. **`supabase.ts` client unchanged** — `createClient<Database>` in `supabase.ts` required zero changes; the fix was purely in the type definition file.

5. **Build error correctly diagnosed** — The `supabaseKey is required` build error (after TypeScript was fixed) was correctly traced to `NEXT_PUBLIC_SUPABASE_ANON_KEY` being a placeholder in `.env.local`, not a code bug.

---

## What Could Be Improved

1. **Version-pin `@supabase/supabase-js`** — The `package.json` uses `"^2.97.0"` which will auto-upgrade. Future minor versions may introduce more breaking type changes. Should pin to an exact version or use `~` (patch-only) and test upgrades explicitly.

2. **Commit generated types to git** — `database.ts` is currently in the repo but was handwritten. Now that it's generated, a `supabase gen types` script should be added to `package.json` (`"db:types": "supabase gen types typescript --project-id tfdxlhkaziskkwwohtwd > src/types/database.ts"`) so it can be regenerated whenever the schema changes.

3. **Migration file naming** — The two migrations both used `20260221_` prefix, causing a duplicate key conflict in Supabase's migration tracking table. Supabase extracts version by numeric prefix only; migration files should use timestamps with seconds (e.g., `20260221000001_initial_schema.sql`, `20260221000002_job_sync.sql`) to guarantee uniqueness.

4. **`.env.local` placeholder values** — `NEXT_PUBLIC_SUPABASE_URL` was still `https://xxxxxxxxxxxxxxxxxxxx.supabase.co` and both Supabase key fields were blank. This caused a misleading `supabaseKey is required` runtime error during the Next.js build's static page collection phase. The `.env.local.example` file should include a note that these must be filled before running `next build`.

5. **Earlier diagnostic approach** — Multiple rounds of TypeScript fixes were attempted before checking the actual `supabase-js` type contract. A faster path would have been to immediately run `supabase gen types` after any type error involving Supabase, rather than attempting to fix the handwritten types manually.

---

## Lessons Learned

### L1: Never handwrite `database.ts` for Supabase projects
Always generate it with `supabase gen types typescript`. The Supabase client's internal type machinery is tightly coupled to the exact shape of the `Database` generic, and this shape changes with postgrest-js major versions. Manual types will break silently on library upgrades.

### L2: `Record<string, unknown>` is not satisfied by concrete interfaces in TypeScript strict mode
A specific interface `{ name: string }` does NOT extend `Record<string, unknown>` (which has an index signature) in TypeScript strict mode, even though every value is assignable to `unknown`. This is a well-known TypeScript quirk. The workaround (intersection) is also insufficient because TypeScript doesn't simplify `Record<string, unknown> & { name: string }` to a type with an index signature for `extends` checking.

### L3: Supabase MCP > Supabase CLI for remote DB operations
When the CLI has version mismatches or authentication issues, the MCP tools (`apply_migration`, `execute_sql`, `generate_typescript_types`) are more reliable for applying migrations to and generating types from a remote project.

### L4: Check for pre-existing tables before applying migrations
The first Supabase project encountered (`tfdxlhkaziskkwwohtwd`) had a completely different schema (real estate platform). Always run `list_tables` before `apply_migration` to confirm you're on the right project.

### L5: Build errors during "Collecting page data" are often env-var issues, not code bugs
Next.js statically evaluates API route modules during build. If a module-level import calls `createClient` with an empty key, it throws at build time. This looks like a code error but is actually a missing environment variable.

---

## Process Improvements

1. **Add `db:types` script to `package.json`** in all three sites pointing to the live Supabase project, so types can be regenerated with a single command after schema migrations.
2. **Add migration naming convention to `systemPatterns.md`** — use `YYYYMMDDHHMMSS_name.sql` format for all future migrations.
3. **Add a pre-build env check** — a small Node script (`scripts/check-env.js`) that validates all required env vars are non-empty before `next build` runs.

---

## Next Recommended Tasks

1. **DEPLOY-001** — Deploy all three sites to Vercel/Railway, populating production env vars (Supabase URL, service role key, Twilio, Vapi, etc.)
2. **INFRA-002** — Implement the npm workspace `@prime/ui-ai` shared package (recommended in INFRA-001 evaluation)
3. **PHASE5-001** — Set up the Supabase Database Webhook for lead-converted → Simpro/Fergus sync (now that the DB is live)
4. **PHASE5-002** — Wire Make.com scenario to call `/api/leads/enrich` with GPT-4o output
5. **TEST-001** — Add Playwright E2E tests for the booking wizard and lead capture form flows

---

## Technical Artifacts Changed This Sprint

| File | Change |
|------|--------|
| `prime-electrical/src/types/database.ts` | Replaced handwritten types with `supabase gen types` output + aliases |
| `prime-electrical/.env.local` | Populated `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| `supabase/migrations/20260221002_job_sync.sql` | Renamed from `20260221_002_job_sync.sql` (migration naming fix) |
| **Live Supabase DB** | `synced_at` and `job_management_id` columns added to `leads` table |
| `memory-bank/.qa_validation_status` | Written as `PASS` |
| `memory-bank/activeContext.md` | Updated with QA pass status |

---

*Sprint duration: ~2 hours | Blocking issue: supabase-js v2.97 type breaking change | Resolution: Supabase MCP + gen types*
