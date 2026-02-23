# TASKS — ORION-003

## Task List

| Task ID | Description | Priority | Effort |
|---------|-------------|----------|--------|
| QUOTE-ACCEPT | Implement `quote-accept` edge function | HIGH | 2h |
| QUOTES-RLS | Add RLS SELECT policies for quotes and quote_line_items | MEDIUM | 1h |
| AKF-WEBHOOK-SECRET | Replace placeholder AKF_WEBHOOK_SECRET with real secret | LOW | 15m |
| N8N-QUOTE-ENRICHMENT | Wire n8n trigger for quote-enrichment edge function | LOW | 1h |
| KB-EMBED-AKF | Run KB embedding script for AKF brand | LOW | 30m |
| KB-EMBED-CLEANJET | Run KB embedding script for CleanJet brand | LOW | 30m |

---

## Acceptance Criteria

### QUOTE-ACCEPT
- [ ] `f:\Prime\supabase\functions\quote-accept\index.ts` exists
- [ ] Function accepts POST with quote ID and optional token/params
- [ ] Updates quote status to accepted (or equivalent) in DB
- [ ] Returns success response; handles invalid/missing quote gracefully
- [ ] Deployable via `supabase functions deploy quote-accept`

### QUOTES-RLS
- [ ] `quotes` table has SELECT policy for appropriate role(s) (anon or authenticated, per design)
- [ ] `quote_line_items` table has SELECT policy for appropriate role(s)
- [ ] Policies allow reads needed for accept flow and admin dashboards
- [ ] No unintended data exposure

### AKF-WEBHOOK-SECRET
- [ ] `akf-construction/.env.local` contains real `AKF_WEBHOOK_SECRET` (not placeholder)
- [ ] Secret matches value configured in AKF webhook provider
- [ ] Webhook verification succeeds in staging/production

### N8N-QUOTE-ENRICHMENT
- [ ] n8n workflow exists that invokes `quote-enrichment` edge function
- [ ] Trigger (webhook, schedule, or event) is configured
- [ ] End-to-end test: trigger fires → function runs → enrichment completes

### KB-EMBED-AKF
- [ ] KB embedding script run for AKF brand
- [ ] Embeddings stored in expected vector store/table
- [ ] FAQ content available for quote enrichment when ready

### KB-EMBED-CLEANJET
- [ ] KB embedding script run for CleanJet brand
- [ ] Embeddings stored in expected vector store/table
- [ ] FAQ content available for quote enrichment when ready
