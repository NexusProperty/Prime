# Active Context

**Last Updated:** 2026-02-22
**Status:** QUOTES-001 — AI Quote Generation System (Creative phase complete — Ready to build)

---

## Current Focus

**QUOTES-001 — AI Quote Generation System.** Shared AI quoting for Prime Electrical, AKF Construction, CleanJet on Supabase `tfdxlhkaziskkwwohtwd`. 17 Edge Functions, 3 new tables, Resend email, OpenRouter LLM. Level 3 complexity. Creative phase complete — Ready to build.

### New Task Initialized
- **Task:** QUOTES-001
- **Title:** AI Quote Generation System — Prime Group (3 Brands)
- **Level:** 3
- **Phase:** Creative complete
- **Next Action:** Run `/build` to implement Phase 1 (schema) → Phase 3 (P0 Edge Functions)

### Reference plans
- `f:/Prime/AIquotes/README.md` — overview and implementation sequence
- `f:/Prime/AIquotes/prime-electrical-plan.md` — 5 functions
- `f:/Prime/AIquotes/akf-construction-plan.md` — 6 functions
- `f:/Prime/AIquotes/cleanjet-plan.md` — 6 functions

### Previous focus (MC-001)
Mission Control fully built; Vercel deployment pending user action. See Next sprint candidates below.

---

## Live Sites (pre-existing)

| Site | URL | Status |
|------|-----|--------|
| Prime Electrical | https://prime-electrical-nu.vercel.app | ✅ HTTP 200 |
| AKF Construction | https://akf-construction.vercel.app | ✅ HTTP 200 |
| CleanJet | https://cleanjet-phi.vercel.app | ✅ HTTP 200 |

---

## Infrastructure State

### Supabase project: `tfdxlhkaziskkwwohtwd.supabase.co`

**Tables:** sites, contacts, events, emails, agents, agent_actions, agent_memory, workers, connections, records, outbound_queue

**SQL functions:** analytics_summary(), claim_outbound_queue_items(), auth_user_site_ids()

**Edge Functions (all ACTIVE):** ingest-prime, ingest-akf, ingest-cleanjet, lead-qualifier, data-monitor, vapi-webhook, mc-analytics, mc-connections, mc-send

### Code

- `mission-control/` — Next.js 16 Mission Control web app
- `prime-electrical/` — Lead capture + booking wizard
- `packages/ui-ai/` → `@prime/ui-ai` (workspace package)

### Pending User Actions (pre-existing)

- Activate n8n workflow: see `memory-bank/build/PHASE6-001/IMPORT-INSTRUCTIONS.md`
- Assign NZ phone numbers to AKF (Alex) + CleanJet (Jess) Vapi assistants
- Mission Control Vercel deploy: add env vars, run `vercel --prod` from `mission-control/`
