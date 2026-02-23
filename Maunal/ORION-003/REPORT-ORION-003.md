# REPORT — ORION-003

## Status Dashboard

| Component | Status | Notes |
|-----------|--------|------|
| Prime Electrical — quote UI | ✅ | Amber estimate card in LeadCaptureForm |
| AKF Construction — quote UI | ✅ | Amber estimate card + building consent notice |
| CleanJet — quote UI | ✅ | Standard/Custom Quote tabs + cyan quote result |
| FormState quote_preview | ✅ | In packages/ui-ai/src/types.ts |
| quote-generate-electrical | ✅ | Exists, smoke test passed |
| quote-generate-akf | ✅ | Exists |
| generate-cleaning-quote | ✅ | Smoke test passed |
| estimate-cleaning-time | ✅ | Smoke test passed |
| project-timeline-estimator | ✅ | Smoke test passed |
| quote-accept | ❌ | **MISSING** — never implemented |
| RLS policies (quotes, quote_line_items) | ⚠️ | Enabled but no SELECT policies |
| AKF_WEBHOOK_SECRET | ⚠️ | Placeholder in akf-construction/.env.local |
| n8n quote-enrichment trigger | ⚠️ | Not wired |
| KB embedding (AKF) | ⚠️ | Pending |
| KB embedding (CleanJet) | ⚠️ | Pending |

---

## What Works Right Now

1. **Quote UI** — All three brands display quote/estimate cards in their lead capture flows.
2. **Electrical quote generation** — `quote-generate-electrical` edge function works and passed live smoke test.
3. **AKF quote generation** — `quote-generate-akf` edge function exists.
4. **Cleaning quote flow** — `generate-cleaning-quote`, `estimate-cleaning-time`, and `project-timeline-estimator` all passed smoke tests.
5. **FormState** — Shared `quote_preview` state is defined and used across brands.

---

## What Is Broken / Missing

1. **quote-accept** — Accept links in quote emails point to a non-existent edge function. Customers cannot accept quotes via email.
2. **RLS policies** — No SELECT policies on `quotes` and `quote_line_items`; may block reads depending on access pattern.
3. **AKF webhook** — Placeholder secret prevents real webhook verification.
4. **n8n quote-enrichment** — Trigger not wired; automated enrichment does not run.
5. **KB embeddings** — AKF and CleanJet KBs not seeded; FAQ-based enrichment unavailable.

---

## Next Sprint Recommendations

| Priority | Item | Rationale |
|----------|------|-----------|
| 1 | Implement `quote-accept` edge function | Critical — broken customer flow |
| 2 | Add RLS SELECT policies for quotes tables | Prevents future read failures |
| 3 | Replace AKF_WEBHOOK_SECRET with real secret | Required for production webhooks |
| 4 | Wire n8n trigger for quote-enrichment | Enables automated enrichment |
| 5 | Run KB embedding scripts (AKF, CleanJet) | Enables FAQ-based quote enrichment when content ready |
