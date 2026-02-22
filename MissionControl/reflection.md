# Mission Control — Build Reflection

> **Session scope:** Full design-to-deployed-code cycle for Mission Control
> **Date:** 2026-02-22
> **Final status:** Production build passing · 13 routes · 85 custom source files · Schema migrated · Test user provisioned

---

## What Was Built

### Documents produced (MissionControl/)

| File | Purpose |
|------|---------|
| `architecture.md` | Audited and updated — confirmed live edge functions, site registry, integration status |
| `feature-plan.md` | Full capability blueprint for all 5 areas (connections, records, analytics, send/sync, website shell) |
| `schema.sql` | Extended with 4 new tables, 3 SQL functions, full RLS policies |
| `website-plan.md` | Phased frontend build plan — 38 steps across 6 phases, every route spec'd |
| `reflection.md` | This file |

### Database schema shipped (Supabase `tfdxlhkaziskkwwohtwd`)

| Migration | Tables added |
|-----------|-------------|
| `mission_control_schema` (pre-existing) | `sites`, `contacts`, `events`, `emails`, `agents`, `agent_actions`, `agent_memory` |
| `mission_control_phase2` (this session) | `workers`, `connections`, `records`, `outbound_queue` + `analytics_summary()`, `claim_outbound_queue_items()`, `auth_user_site_ids()` |

### Edge Functions scaffolded

| Function | Purpose |
|----------|---------|
| `mc-connections` | Full CRUD with Supabase Vault secret write/rotation/delete |
| `mc-analytics` | JWT-gated dashboard aggregation via `analytics_summary()` RPC |
| `mc-send` | Cron delivery processor with `FOR UPDATE SKIP LOCKED`, exponential backoff |

### Mission Control web app (`f:\Prime\mission-control\`)

**Stack:** Next.js 16.1.6 · App Router · TypeScript strict · Tailwind v4 · Catalyst UI Kit · shadcn/ui · Recharts · HeadlessUI · Heroicons · @supabase/ssr

**13 routes compiled:**

| Route | Type | Purpose |
|-------|------|---------|
| `/login` | Static | Supabase Auth email+password |
| `/dashboard` | Dynamic | Cross-site analytics: KPI cards, events chart, site health, agent summary |
| `/sites/[id]` | Dynamic | Per-site view: stats, recent contacts, site health |
| `/records` | Dynamic | Unified record browser with FilterBar, Catalyst Table, Pagination |
| `/records/new` | Dynamic | Create record: dynamic payload form (quote/job/invoice/note/booking/task) |
| `/records/[id]` | Dynamic | Record detail: meta panel, payload view, source event, agent timeline |
| `/connections` | Dynamic | API Connection Manager: ConnectionCard grid with Switch toggles |
| `/connections/new` | Dynamic | AppPicker + ConnectionForm (Vault-safe key input) |
| `/connections/[id]` | Dynamic | Detail: ConfigEditor, CredentialSection, Rotate Key, Delete |
| `/agents` | Dynamic | AgentCard list with enable/disable, success rate, ActionLogTable |
| `/settings` | Dynamic | Profile + site membership table + Change Password dialog |
| `/settings/outbound` | Dynamic | Outbound queue monitor: tabs, retry/cancel actions |
| `Proxy` | Middleware | Auth guard: unauthenticated → /login, logged-in on /login → /dashboard |

---

## What Went Well

### 1. Upfront architecture before code
Planning Phases 1–3 (feature-plan, schema, website-plan) before any code was written meant zero mid-build pivots. Every component had a verified specification before a subagent touched a file.

### 2. Catalyst UI Kit as the design foundation
Copying the Catalyst component library into `components/catalyst/` gave every page consistent, production-quality UI primitives (Table, Badge, Switch, Dialog, Fieldset, Button) without reinventing wheels. The dark-mode-first design of Catalyst matched the `bg-gray-900`/`bg-gray-950` palette from the UI-Blocks reference.

### 3. Route group `(dashboard)` for clean auth separation
Using a Next.js route group kept the login page entirely outside the sidebar layout without any conditional rendering. The protected layout server component fetches user + sites in one place, passes data down to the client shell.

### 4. Supabase MCP for live operations
Using the `user-supabase2` MCP tool to:
- Fetch the live anon key (no manual dashboard navigation)
- Apply the Phase 2 migration directly (`apply_migration`)
- Provision the test user and worker records in the same flow

This kept everything in one context without context-switching to a browser.

### 5. `FOR UPDATE SKIP LOCKED` in `claim_outbound_queue_items`
The cron processor function is production-safe from day one — concurrent invocations won't double-process queue items.

---

## Challenges Encountered

### 1. Next.js 16 breaking changes from the plan
The plan was written targeting Next.js 14. The scaffold landed on 16.1.6, which:
- Renamed `middleware.ts` → `proxy.ts` with a `proxy()` export
- Changed `params` in route handlers to `Promise<{ id: string }>` requiring `await`
- Slightly different Turbopack workspace root behaviour (resolved via `turbopack.root` in `next.config.ts`)

**Resolution:** Caught and fixed mid-build. No downstream impact.

### 2. Supabase join type inference vs. strict TypeScript
When querying with joins (`sites(id, name)`), Supabase returns arrays in some contexts. TypeScript strict mode rejected the cast from the inferred type to the typed interface. Required `as unknown as RecordRow[]` at the boundary.

**Lesson:** Always add an `unknown` intermediate cast when bridging Supabase join results to hand-written interfaces. Alternatively, use `generate_typescript_types` MCP tool to get Supabase's auto-generated types and extend from those.

### 3. Catalyst `navbar.tsx` requires `motion/react`
The Catalyst UI Kit's `navbar.tsx` imports `motion/react` (Framer Motion v12 API) which wasn't installed. Any page importing the full Catalyst barrel would fail. 

**Resolution:** Installed `motion` package separately. Going forward, the Catalyst components should be audited for peer dependencies before copying in bulk.

### 4. Workers table RLS adds friction for admin views
The `auth_user_site_ids()` RLS helper scopes all workers to their own sites — which is correct for workers but makes the admin dashboard (which needs cross-site views) require either elevated server-side calls or a service-role client. The dashboard server pages use `createClient()` (anon key + RLS), which means an admin user must have worker rows for all three sites.

**Resolution:** Seeded the test admin with worker rows on all three sites. For production, consider a separate `is_global_admin` column or a dedicated service-role server client for aggregate queries.

---

## Lessons Learned

### Technical

1. **Generate Supabase types early.** Use `generate_typescript_types` MCP tool at the start of any new schema session and commit the types file. This eliminates the `as unknown as` hack entirely and makes hook types authoritative.

2. **Install all peer dependencies before copying a UI kit.** Run `npm info <package> peerDependencies` before bulk-copying component libraries.

3. **Plan for Next.js App Router async params from the start.** `params: Promise<{ id: string }>` is the correct type for Next.js 15+ dynamic routes. Write it this way upfront.

4. **Supabase Vault functions need the service role.** Any Edge Function that reads/writes Vault secrets must use the service role client, not the anon client. This is already correct in `mc-connections` but must be maintained.

### Process

1. **The three-document pattern works.** `feature-plan.md` → `schema.sql` → `website-plan.md` created a single authoritative chain. Each document built on verified facts from the previous one. Zero invented types or paths.

2. **Subagent prompts should specify component file paths explicitly.** Vague instructions like "use Catalyst" led to some guessing. Explicit paths ("use `@/components/catalyst/table.tsx` — read it before using") produced cleaner output.

3. **MCP tools replace 80% of browser tab switching.** The entire session — from key retrieval to schema migration to user provisioning — happened inside the conversation without opening a browser. This is the correct workflow pattern.

---

## Open Items / Next Steps

### Immediate (before first real use)

| Item | Why |
|------|-----|
| Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables | Required for production deployment |
| Deploy `mc-connections`, `mc-analytics`, `mc-send` Edge Functions via `supabase functions deploy` | Currently scaffolded but not deployed |
| Apply `mission_control_phase2` migration to production branch if using branching | Migration applied to staging/main only |
| Add RLS `SELECT` policy on `sites` table for authenticated users | Without this, the dashboard server layout can't read sites under RLS |

### Near-term (Phase C–F polish)

| Item | Priority |
|------|---------|
| `AgentCard.tsx` toggle write — `agents.is_active` update needs service role or RLS write policy | High |
| Loading skeletons on `RecordTable`, `ConnectionCard` grid | Medium |
| `ConnectionCard` — wire up Test and Delete actions to `mc-connections` | Medium |
| Error boundaries on all dynamic routes | Medium |
| CSV export on `/records` | Low |
| Vercel deployment + Auth redirect URL config | When ready to go live |

### Future phases (not yet built)

- **Phase C (Records):** `/records/new` dynamic payload fields per type not yet complete
- **Connections:** `mc-connections` Edge Function needs Vault functions (`vault_upsert_secret`, `vault_delete_secret`) confirmed in Supabase project
- **Send & Sync:** `mc-send` cron schedule needs to be set in Supabase Dashboard → Functions → mc-send → Schedule: `*/1 * * * *`
- **Contact deduplication** (noted in architecture.md suggestions)
- **Event replay** (noted in architecture.md suggestions)

---

## Metrics

| Metric | Value |
|--------|-------|
| Planning documents written | 4 (feature-plan, schema, website-plan, reflection) |
| Database tables added | 4 (workers, connections, records, outbound_queue) |
| SQL functions added | 3 (analytics_summary, claim_outbound_queue_items, auth_user_site_ids) |
| Edge Functions scaffolded | 3 (mc-connections, mc-analytics, mc-send) |
| Next.js routes delivered | 13 |
| Custom TypeScript source files | 85 |
| Build status | ✅ Zero errors, zero warnings |
| Migrations applied | 1 (`mission_control_phase2`) |
| Test user provisioned | ✅ `admin@missioncontrol.com` / `Admin1234!` |
| Worker records seeded | 3 (one per site, role: admin) |

---

## Session 2 — Hotfix: Highest-Priority Items
> **Date:** 2026-02-22
> **Scope:** Post-build hardening: RLS policies, Edge Function deployments, optimistic UI

### What Was Fixed

| Item | Type | Detail |
|------|------|--------|
| `sites` RLS SELECT | Migration `mission_control_rls_policies` | All authenticated users can now read `sites` — was blocking every dashboard query |
| `agents` RLS SELECT | Same migration | All authenticated users can read agents |
| `agents` RLS UPDATE | Same migration | Admin/manager workers can update `is_active` |
| `agent_actions` RLS SELECT | Same migration | All authenticated users can read action logs |
| `contacts` RLS SELECT | Same migration | All authenticated users can read contacts |
| `events` RLS SELECT | Same migration | All authenticated users can read events |
| `mc-analytics` deploy | Edge Function v1 | JWT-gated, calls `analytics_summary()` RPC — now ACTIVE |
| `mc-connections` deploy | Edge Function v1 | Full CRUD + Supabase Vault — now ACTIVE |
| `mc-send` deploy | Edge Function v1 | Cron-triggered delivery processor — now ACTIVE (verify_jwt: false) |
| AgentCard optimistic toggle | `AgentsPageContent.tsx` | Added `Map<agentId, isActive>` optimistic state: instant Switch feedback, reverts on error |

### Root cause: missing RLS SELECT policies

The original `mission_control_phase2` migration added RLS policies for the *new* tables (`workers`, `connections`, `records`, `outbound_queue`) but did not add SELECT policies for the *existing* core tables (`sites`, `agents`, `agent_actions`, `contacts`, `events`). Because `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` was already applied earlier, every query from the authenticated user context was returning 0 rows.

### Lessons learned from this session

1. **Enable RLS + add policies in the same migration.** Any table with RLS enabled but no matching policy silently returns empty results — no error thrown, just 0 rows. Always include both the `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and the `CREATE POLICY` statements in the same migration block.

2. **Deploy Edge Functions immediately after scaffolding.** The functions were production-ready code sitting undeployed for the entire first session. A "scaffold → deploy" protocol (scaffold code, then immediately call `deploy_edge_function` via MCP) avoids this gap.

3. **Optimistic UI for toggle controls is non-negotiable.** Database round-trips + `router.refresh()` create a visible snap-back on toggle switches. Any `<Switch>` bound to a server-fetched value needs local optimistic state, even for simple boolean fields.

### State after session 2

- 6 RLS policies applied to core tables
- All 3 Edge Functions live (ACTIVE) on Supabase
- AgentCard toggle instant with error rollback
- Remaining manual step: set `mc-send` cron schedule in Supabase Dashboard → Functions → mc-send → Schedule → `*/1 * * * *`
