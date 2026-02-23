# Active Context

**Last Updated:** 2026-02-23
**Status:** 🟢 ACTIVE — N8N-ACTIVATE complete

---

## Current Focus
**Task:** N8N-ACTIVATE — n8n Lead Enrichment Pipeline Activation  
**Phase:** Complete  
**Status:** ✅ End-to-end verified — `{"ok":true}` with `ai_notes` in DB

### What's Live
- n8n workflow `wAyQCY6uKnKAnL2J` on primenz.app.n8n.cloud — 6 nodes, OpenRouter GPT-4o mini, active
- Lead form/voice → ingest Edge Functions → n8n webhook → GPT-4o analysis → POST /api/leads/enrich → UPDATE leads.ai_notes
- `N8N_WEBHOOK_URL` + `ENRICH_SECRET` in Supabase Vault and Vercel; all 3 ingest functions redeployed

---

## Live Sites

| Site | URL | Status |
|------|-----|--------|
| Prime Electrical | https://prime-electrical-nu.vercel.app | ✅ HTTP 200 |
| AKF Construction | https://akf-construction.vercel.app | ✅ HTTP 200 |
| CleanJet | https://cleanjet-phi.vercel.app | ✅ HTTP 200 |
| Mission Control | https://mission-control-six-fawn.vercel.app | ✅ HTTP 200 |

---

## Infrastructure State

### Supabase project: `tfdxlhkaziskkwwohtwd.supabase.co`

**Tables:** sites, contacts, events, emails, agents, agent_actions, agent_memory, workers, connections, records, outbound_queue, quotes, quote_line_items, telegram_sessions, telegram_messages

**Views:** quotes_summary

**SQL functions:** analytics_summary(), claim_outbound_queue_items(), auth_user_site_ids()

**Edge Functions (all ACTIVE — 27 total):**
- Ingest: `ingest-prime`, `ingest-akf`, `ingest-cleanjet`
- AI agents: `lead-qualifier`, `data-monitor`, `vapi-webhook`, `telegram-webhook`
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
| Assign NZ numbers to AKF + CleanJet Vapi | Alex + Jess assistants need NZ Telnyx numbers |
| ~~Mission Control Vercel deploy~~ | ✅ Live — https://mission-control-six-fawn.vercel.app |
| Telegram bot "brain" upgrade | Function calling / tool use for `handleFreeform` — see reflection for design |

---

## Next Sprint Candidates

| Priority | Task | Description |
|----------|------|-------------|
| 1 | VERCEL-MC | Deploy Mission Control to Vercel |
