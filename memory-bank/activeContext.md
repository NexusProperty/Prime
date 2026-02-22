# Active Context

**Last Updated:** 2026-02-22
**Status:** VAPI-001 Code Complete — Pending User Deployment Actions

---

## Current Focus

**VAPI-001** — Code complete. All files built. Pending 5 user deployment actions (see tasks.md for ordered checklist).

Sprint 3 is archived. n8n workflow activation is a pending user action.

---

## Live Sites

| Site | URL | Status |
|------|-----|--------|
| Prime Electrical | https://prime-electrical-nu.vercel.app | ✅ HTTP 200 |
| AKF Construction | https://akf-construction.vercel.app | ✅ HTTP 200 |
| CleanJet | https://cleanjet-phi.vercel.app | ✅ HTTP 200 |

---

## Infrastructure State

### Code
- `prime-electrical/src/app/api/leads/submit/route.ts` — fires `N8N_WEBHOOK_URL` (fire-and-forget)
- `prime-electrical/src/app/api/leads/enrich/route.ts` — `GET` health-check + `POST` with `x-enrich-secret`
- `packages/ui-ai/` → `@prime/ui-ai` (workspace, live in production)

### Test Coverage
| Spec File | Tests |
|-----------|-------|
| `e2e/lead-capture-form.spec.ts` | 10 |
| `e2e/booking-wizard.spec.ts` | 15 |
| `e2e/api-leads.spec.ts` | 14 |
| `e2e/cross-sell-edge-cases.spec.ts` | 13 |
| `e2e/jobs-sync.spec.ts` | 6 |
| `e2e/voice-flow.spec.ts` | 8 |
| **Total** | **66** |

### Supabase
- **Project:** `tfdxlhkaziskkwwohtwd.supabase.co`
- **Tables:** `leads`, `customers`, `cross_sell_events`
- **Trigger:** `lead_converted_sync` → `net.http_post` to `/api/jobs/sync`

### Pending User Actions
- Activate n8n workflow: see `memory-bank/build/PHASE6-001/IMPORT-INSTRUCTIONS.md`
- Set `JOB_SYNC_WEBHOOK_SECRET` in Supabase when ready for job sync
- Set `JOB_SYNC_TARGET=simpro|fergus` + API keys in Vercel when ready

---

## Ready to Start (User Deployment Actions — in order)

| Priority | Action | Command / Location |
|----------|--------|--------------------|
| 🔴 1 | Rotate `VAPI_API_KEY` | dashboard.vapi.ai → API Keys |
| 2 | Run DB migration | `supabase db push` |
| 3 | Set Supabase secrets | `supabase secrets set ...` (see plan §1.4) |
| 4 | Deploy Edge Function | `supabase functions deploy vapi-webhook --no-verify-jwt` |
| 5 | Set webhook secret | Vapi dashboard → Account → Webhooks → Server URL Secret |
| 6 | Update 3 Vapi assistants | `vapi update assistant <id> --file vapi/assistant-<brand>.json` |
| 7 | Run embedding script | `deno run --allow-net --allow-env --allow-read supabase/seed/embed-knowledge-base.ts` |
| 8 | Integration tests | curl commands in plan §5.3 |
| 9 | Voice smoke tests | `vapi call create --assistant-id <id> --type web` |
