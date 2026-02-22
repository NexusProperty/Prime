# TASK ARCHIVE: MC-001 — Mission Control

## METADATA

| Field | Value |
|-------|-------|
| Task ID | MC-001 |
| Date | 2026-02-22 |
| Sessions | 2 (build + hotfix) |
| Complexity | Level 4 — Full-stack product build |
| Status | ✅ COMPLETE |
| Supabase project | `tfdxlhkaziskkwwohtwd.supabase.co` |
| App path | `f:\Prime\mission-control\` |

---

## SUMMARY

Mission Control is a standalone internal web application providing centralised visibility and control over all three client sites (Prime Electrical, AKF Construction, CleanJet) and the AI agent layer running on top of them. Built in a single session from architecture audit through to deployed Edge Functions, the app is now running locally and ready for Vercel deployment.

---

## PLANNING

Artifacts in `f:\Prime\MissionControl\` (kept as operational docs — not deleted):

| File | Purpose |
|------|---------|
| `architecture.md` | Audited existing Supabase project, confirmed live Edge Functions and site registry |
| `feature-plan.md` | Blueprint for 5 capability areas: Connection Manager, Records, Analytics, Send/Sync, Website Shell |
| `schema.sql` | Extended schema — 4 new tables, 3 SQL functions, full RLS |
| `website-plan.md` | 38-step phased frontend build plan across 6 phases |
| `agent-registry.md` | Agent configuration reference (Email Responder, Lead Qualifier, Data Monitor, Voice Intake) |
| `reflection.md` | Two-session reflection document |

---

## DATABASE SCHEMA

Two migrations applied to Supabase project `tfdxlhkaziskkwwohtwd`:

| Migration | Tables / Functions |
|-----------|-------------------|
| `mission_control_phase2` | `workers`, `connections`, `records`, `outbound_queue` + `analytics_summary()`, `claim_outbound_queue_items()`, `auth_user_site_ids()` |
| `mission_control_rls_policies` | SELECT policies on `sites`, `agents`, `agent_actions`, `contacts`, `events`; UPDATE policy on `agents` for admin/manager workers |

pg_cron schedule: `mc-send-every-minute` (`* * * * *`) — calls `mc-send` Edge Function via `pg_net`.

---

## EDGE FUNCTIONS DEPLOYED

All deployed to Supabase, status ACTIVE:

| Function | Auth | Purpose |
|----------|------|---------|
| `mc-analytics` | JWT required | Dashboard aggregation via `analytics_summary()` RPC |
| `mc-connections` | JWT required | Full CRUD for `connections` table + Supabase Vault for API keys |
| `mc-send` | No JWT (cron) | Outbound queue processor with `FOR UPDATE SKIP LOCKED`, exponential backoff |

---

## FRONTEND (Next.js 16.1.6 · App Router · TypeScript strict · Tailwind v4)

13 routes delivered, zero build errors:

| Route | Purpose |
|-------|---------|
| `/login` | Supabase Auth email+password |
| `/dashboard` | Cross-site KPI cards, events chart, site health table, agent summary |
| `/sites/[id]` | Per-site stats, recent contacts, health |
| `/records` | Unified record browser — filter, sort, paginate |
| `/records/new` | Create record with dynamic payload form |
| `/records/[id]` | Record detail with agent action timeline |
| `/connections` | API Connection Manager grid |
| `/connections/new` | AppPicker + ConnectionForm (Vault-safe) |
| `/connections/[id]` | Config editor, credential rotation, delete |
| `/agents` | AgentCard list with optimistic enable/disable toggle, ActionLogTable |
| `/settings` | Profile, site membership, Change Password dialog |
| `/settings/outbound` | Outbound queue monitor with retry/cancel |
| `proxy.ts` | Auth guard middleware |

Key components: Catalyst UI Kit (`Table`, `Badge`, `Switch`, `Dialog`, `Button`), Recharts `EventsChart`, HeadlessUI `Dialog` for mobile sidebar.

Test user: `admin@missioncontrol.com` / `Admin1234!` — admin role on all 3 sites.

---

## LESSONS LEARNED

### Session 1 — Build

1. **Generate Supabase types early.** Use `generate_typescript_types` MCP at the start of any new schema session. Eliminates `as unknown as` casts at join boundaries.
2. **Audit UI kit peer dependencies before bulk copy.** `Catalyst navbar.tsx` required `motion/react` (Framer Motion v12). Run `npm info <package> peerDependencies` first.
3. **Next.js 15+ async params.** Write `params: Promise<{ id: string }>` and `await params` upfront — saves a refactor mid-build.
4. **Supabase Vault requires service role.** Any Edge Function reading/writing Vault secrets must use the service role client, not anon.
5. **Three-document planning chain works.** `feature-plan → schema → website-plan` — each built on verified facts, zero invented types or paths.

### Session 2 — Hotfix

1. **Enable RLS + add policies in the same migration.** RLS enabled without a matching policy silently returns 0 rows. No error. Always pair `ENABLE ROW LEVEL SECURITY` with `CREATE POLICY` in the same block.
2. **Deploy Edge Functions immediately after scaffolding.** Scaffold → deploy is one step, not two sessions. Use `deploy_edge_function` MCP immediately.
3. **Optimistic UI for Switch controls is non-negotiable.** Server round-trip + `router.refresh()` causes visible snap-back. Any `<Switch>` bound to a server-fetched boolean needs local `useState` map.

---

## PENDING (user actions only — no code changes needed)

| Action | Notes |
|--------|-------|
| Add env vars to Vercel | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Deploy to Vercel | `vercel --prod` from `mission-control/` directory |
| Set Auth redirect URL | Supabase Dashboard → Auth → URL Configuration → Site URL = Vercel URL |

---

## ARCHIVED FILES

| Source | Action |
|--------|--------|
| `MissionControl/feature-plan.md` | Kept in place — operational planning reference |
| `MissionControl/schema.sql` | Kept in place — canonical schema source |
| `MissionControl/website-plan.md` | Kept in place — route and component specification |
| `MissionControl/architecture.md` | Kept in place — system architecture reference |
| `MissionControl/agent-registry.md` | Kept in place — agent configuration reference |
| `MissionControl/reflection.md` | Kept in place — two-session reflection log |
| `mission-control/` (Next.js app) | Live code — not archived |
| Supabase migrations | Applied to live project |
| Edge Functions | Deployed and ACTIVE |
| pg_cron job `mc-send-every-minute` | Scheduled and running |
