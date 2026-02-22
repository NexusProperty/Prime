# TASK ARCHIVE: Sprint 3 — INFRA-002 + DEPLOY-002 + PHASE6-001 + TEST-002

## METADATA

- **Sprint ID:** SPRINT3
- **Date:** 2026-02-21
- **Duration:** Single session
- **Complexity:** Level 3 (multi-task sprint)
- **Status:** Code complete. n8n workflow activation deferred to user.
- **Files consolidated:** 4 (reflection + 3 PHASE6-001 build docs)
- **Source locations:**
  - `memory-bank/build/PHASE6-001/` — n8n workflow files (kept in place as user reference)
  - `memory-bank/reflection/SPRINT3/` — sprint reflection

---

## SUMMARY

Sprint 3 delivered four major workstreams:
1. **INFRA-002** — Extracted 11 shared AI components into `@prime/ui-ai` npm workspace package, eliminating 30 duplicate files across 3 sites with 0 TypeScript errors.
2. **DEPLOY-002** — Redeployed all 3 sites to Vercel with workspace package support. Required `rootDirectory` configuration via REST API and `transpilePackages` + `outputFileTracingRoot` in `next.config.js`.
3. **PHASE6-001** — n8n lead enrichment pipeline code complete. Fixed stale Make.com references. Created 5-node importable workflow JSON + blueprint + import instructions. Awaiting user manual activation.
4. **TEST-002** — Expanded Playwright E2E suite from 39 to 66 tests (27 new): cross-sell engine edge cases, `/api/jobs/sync` coverage, AIChatWidget voice flow.

---

## PLANNING

No formal plan documents were created for Sprint 3 tasks (they were queued as "Next Sprint Candidates" in `tasks.md` and executed directly).

---

## IMPLEMENTATION

### INFRA-002 — @prime/ui-ai Shared Package

**Package location:** `f:\Prime\packages\ui-ai\`
**Package name:** `@prime/ui-ai` (npm workspace)

**11 components extracted:**
- `VoiceStatusIndicator.tsx` + `WaveformBars.tsx`
- `AIChatWidget/ChatMessage.tsx` + `ChatInput.tsx`
- `AIProcessingOverlay.tsx`
- `CrossSellPromptCard.tsx`
- `EmergencyTriageAlert.tsx`
- `LeadCaptureForm/FormFields.tsx`
- `types.ts`, `brandConfig.ts`, `index.ts` (barrel)

**Per-site components kept separate (intentional):**
- `AIChatWidget.tsx` — different bottom positioning per site
- `LeadCaptureForm.tsx` — Prime uses real API; AKF/CleanJet use setTimeout mocks

**tsconfig.json changes (all 3 sites):**
```json
"@prime/ui-ai": ["../packages/ui-ai/src/index.ts"],
"@prime/ui-ai/*": ["../packages/ui-ai/src/*"]
```

---

### DEPLOY-002 — Vercel Monorepo Deployment

**Problem solved:** Vercel subdirectory deployments don't resolve `..` to repo root, so `installCommand: "cd .. && npm install"` fails.

**Solution pattern (to reuse for future workspace packages):**
1. Set `rootDirectory` for each project via Vercel REST API: `PATCH /v9/projects/{projectId}?teamId={teamId}` with `{"rootDirectory": "prime-electrical"}`
2. Add to each site's `next.config.js`:
```javascript
const path = require('path')
const nextConfig = {
  transpilePackages: ['@prime/ui-ai'],
  outputFileTracingRoot: path.join(__dirname, '../'),
}
```

**Live site verification:**
- https://prime-electrical-nu.vercel.app — ✅ HTTP 200
- https://akf-construction.vercel.app — ✅ HTTP 200
- https://cleanjet-phi.vercel.app — ✅ HTTP 200

---

### PHASE6-001 — n8n Lead Enrichment Pipeline

**Code changes:**
- `prime-electrical/src/app/api/leads/submit/route.ts` — Fixed log message from Make.com to n8n
- `memory-bank/ai-prompts/cross-sell-gpt4o.md` — Updated prompt header for n8n syntax

**Workflow files (kept in `memory-bank/build/PHASE6-001/` as active reference):**
- `united-trades-lead-enrichment.workflow.json` — Importable 5-node n8n workflow
- `n8n-workflow-blueprint.md` — Node-by-node configuration guide
- `IMPORT-INSTRUCTIONS.md` — 7-step manual activation checklist

**5-node pipeline:**
```
Webhook → GPT-4o Analysis → Parse Response → POST /api/leads/enrich → Respond
```

**Pending user actions (n8n activation):**
1. Import `united-trades-lead-enrichment.workflow.json` into https://primenz.app.n8n.cloud
2. Connect OpenAI credential on GPT-4o Analysis node
3. Set `ENRICH_SECRET` in n8n Variables (Settings → Variables)
4. Activate workflow — copy Production Webhook URL
5. Add `N8N_WEBHOOK_URL` to Vercel → prime-electrical → Environment Variables
6. Redeploy: `cd f:\Prime && vercel deploy --prod --scope nexus-property --yes`
7. Test: submit lead → check Supabase `leads.ai_notes` populated within ~30s

---

### TEST-002 — Playwright E2E Expansion

**Before:** 39 tests (3 spec files)
**After:** 66 tests (6 spec files)

| Spec File | Tests | Coverage |
|-----------|-------|----------|
| `e2e/lead-capture-form.spec.ts` | 10 | LeadCaptureForm UI, all 3 sites |
| `e2e/booking-wizard.spec.ts` | 15 | CleanJet BookingWizard full flow |
| `e2e/api-leads.spec.ts` | 14 | /api/leads/submit + /api/leads/enrich + /api/jobs/sync security |
| `e2e/cross-sell-edge-cases.spec.ts` | 13 | detectCrossSell all 4 rules + UI flows |
| `e2e/jobs-sync.spec.ts` | 6 | /api/jobs/sync payload validation + conversion |
| `e2e/voice-flow.spec.ts` | 8 | AIChatWidget rendering + accessibility + per-site |

**CI gate:** `PLAYWRIGHT_SKIP_API_TESTS=true` skips 11 DB-dependent tests safely.

---

## CHALLENGES & RESOLUTIONS

| Challenge | Resolution |
|-----------|------------|
| Vercel `installCommand: "cd .."` fails in subdirectory deployments | Set `rootDirectory` via REST API + `transpilePackages` + `outputFileTracingRoot` |
| n8n MCP JWT scoped to `/mcp-server/http` — can't create workflows via REST | Generated importable JSON + manual instructions |
| browser-use aborted on n8n import via existing session | Provided `IMPORT-INSTRUCTIONS.md` as manual fallback |
| AKF/CleanJet `LeadCaptureForm` uses `setTimeout` (no fetch) — `page.route()` has no effect | Redirected UI cross-sell tests to Prime Electrical |

---

## LESSONS LEARNED

- Vercel monorepo: `rootDirectory` via REST API is required; `vercel.json` `installCommand` cannot reference parent directories
- n8n MCP JWT is endpoint-scoped; programmatic workflow creation needs REST API key or manual import
- Before writing `page.route()` UI tests, verify the component uses fetch — not local mocks
- `PLAYWRIGHT_SKIP_API_TESTS` env gate pattern for DB-dependent tests is clean and portable

---

## ARCHIVED FILES

| File | Action |
|------|--------|
| `memory-bank/reflection/SPRINT3/reflection-SPRINT3.md` | Consolidated into this archive |
| `memory-bank/build/PHASE6-001/n8n-workflow-blueprint.md` | Kept in place (active user reference) |
| `memory-bank/build/PHASE6-001/IMPORT-INSTRUCTIONS.md` | Kept in place (active user reference) |
| `memory-bank/build/PHASE6-001/united-trades-lead-enrichment.workflow.json` | Kept in place (import file for n8n) |
| `memory-bank/build/INFRA-002/` | Empty folder — deleted |
| `memory-bank/build/DEPLOY-002/` | Empty folder — deleted |
| `memory-bank/build/TEST-002/` | Empty folder — deleted |
| `memory-bank/build/PHASE6-001/` | Kept (contains active user reference files) |
| `memory-bank/reflection/SPRINT3/` | Folder deleted after consolidation |
