# Active Context

**Last Updated:** 2026-02-22
**Status:** Mission Control — post-build hardening complete

---

## Current Focus

**MC-001 ARCHIVED.** Mission Control is fully built, all Edge Functions deployed, RLS locked down, pg_cron queue processor running. The app runs locally (`npm run dev` in `mission-control/`). Only Vercel deployment remains — user action required.

### Remaining user action
- Add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables
- Run `vercel --prod` from `mission-control/`
- Set Auth redirect URL in Supabase Dashboard → Auth → URL Configuration

### Next sprint candidates
- AKF + CleanJet KB seeding (embed FAQ content for Alex/Jess voice agents)
- Assign NZ phone numbers to AKF (Alex) + CleanJet (Jess) Vapi assistants
- N8N-ACTIVATE (user action — see `memory-bank/build/PHASE6-001/IMPORT-INSTRUCTIONS.md`)

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
