# Active Context

**Last Updated:** 2026-02-22
**Status:** Idle — VAPI-001 + INFRA-003 archived. No active tasks.

---

## Current Focus

**All tasks archived.** VAPI-001 voice agent is live for Prime Electrical (Max, +6498734191). INFRA-003 completed the E2E → `@prime/ui-ai` type migration (root `tsconfig.json` created). AKF and CleanJet assistants deployed but phone numbers not yet assigned.

Next sprint candidate: N8N-ACTIVATE (user action) or AKF/CleanJet KB seeding.

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

## Optional Next Actions

| Priority | Action | Notes |
|----------|--------|-------|
| 1 | Embed AKF + CleanJet KB | `BRAND=akf deno run ...` when FAQ content ready |
| 2 | Assign NZ numbers to Alex + Jess | Buy 2 more Telnyx numbers, link in Vapi |
| 3 | ~~INFRA-003~~ | ✅ Archived — root tsconfig + `CrossSellData` imports in 2 spec files |
| 4 | N8N-ACTIVATE | Activate n8n workflow (see IMPORT-INSTRUCTIONS.md) |
