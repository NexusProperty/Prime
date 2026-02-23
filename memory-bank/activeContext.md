# Active Context

**Last Updated:** 2026-02-23
**Status:** QUOTE-ACCEPT — ✅ ARCHIVED | Ready for next sprint

---

## Current Focus

Both **NAV-001** and **QUOTE-ACCEPT** are now archived. Next sprint candidates: **N8N-ACTIVATE** (user action) and **VERCEL-MC** (Deploy Mission Control to Vercel).

### Recently archived
- **QUOTE-ACCEPT** — quote-accept Edge Function + RLS SELECT policies. 4/4 smoke tests passed. Now live.
- **NAV-001** — Navigation dropdowns + 3 new AKF service pages.
- **QUOTES-001** — 17 Supabase Edge Functions (Deno), 3-brand quote preview frontend, OpenRouter LLM, Resend email, cross-sell bridge. All smoke tests passed.
- **MC-001** — Mission Control web app (13 routes). Pending: Vercel deployment + env vars.
- **VAPI-001** — Voice agents for all 3 brands. Pending: voice smoke test, AKF/CleanJet KB embedding.

---

## Live Sites

| Site | URL | Status |
|------|-----|--------|
| Prime Electrical | https://prime-electrical-nu.vercel.app | ✅ HTTP 200 |
| AKF Construction | https://akf-construction.vercel.app | ✅ HTTP 200 |
| CleanJet | https://cleanjet-phi.vercel.app | ✅ HTTP 200 |

---

## Infrastructure State

### Supabase project: `tfdxlhkaziskkwwohtwd.supabase.co`

**Tables:** sites, contacts, events, emails, agents, agent_actions, agent_memory, workers, connections, records, outbound_queue, quotes, quote_line_items

**Views:** quotes_summary

**SQL functions:** analytics_summary(), claim_outbound_queue_items(), auth_user_site_ids()

**Edge Functions (all ACTIVE — 26 total):**
- Ingest: `ingest-prime`, `ingest-akf`, `ingest-cleanjet`
- AI agents: `lead-qualifier`, `data-monitor`, `vapi-webhook`
- Mission Control: `mc-analytics`, `mc-connections`, `mc-send`
- AI Quotes P0: `quote-generate-electrical`, `quote-generate-akf`, `calculate-post-build-price`, `generate-cleaning-quote`
- AI Quotes P1: `quote-send-electrical`, `quote-send-akf`, `quote-enrichment`, `estimate-deck-cost`, `consent-estimator`, `bundle-analyzer-akf`, `suggest-service-type`, `recommend-extras`, `cross-sell-to-cleanjet`
- AI Quotes P2: `quote-review`, `quote-followup`, `project-timeline-estimator`, `estimate-cleaning-time`

### Code

- `mission-control/` — Next.js 16 Mission Control web app
- `prime-electrical/` — Lead capture + AI quote preview + voice
- `akf-construction/` — Lead capture + AI quote preview + voice
- `cleanjet/` — BookingWizard with Custom Quote tab + voice
- `packages/ui-ai/` → `@prime/ui-ai` (workspace package)

---

## Pending User Actions

| Action | Notes |
|--------|-------|
| Activate n8n workflow | See `memory-bank/build/PHASE6-001/IMPORT-INSTRUCTIONS.md` |
| Assign NZ numbers to AKF + CleanJet Vapi | Alex + Jess assistants need NZ Telnyx numbers |
| Mission Control Vercel deploy | Add env vars, run `vercel --prod` from `mission-control/` |

---

## Next Sprint Candidates

| Priority | Task | Description |
|----------|------|-------------|
| 1 | N8N-ACTIVATE | Activate n8n workflow (user action) |
| 2 | VERCEL-MC | Deploy Mission Control to Vercel |
