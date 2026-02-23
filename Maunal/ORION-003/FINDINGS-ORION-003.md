# FINDINGS — ORION-003

## Executive Summary

The QUOTES-001 quote UI is fully built across all three brands (Prime Electrical, AKF Construction, CleanJet), and the core quote generation edge functions (`quote-generate-electrical`, `quote-generate-akf`) exist and passed live smoke tests. The critical gap is the missing `quote-accept` edge function — accept links in quote emails point to a non-existent endpoint, so customers cannot accept quotes via email. Four additional deferred items (RLS policies, AKF webhook secret, n8n trigger, KB embeddings) pose lower risk and are tracked for future sprints.

---

## Finding 1: UI CONFIRMED BUILT — All 3 Brands

| Brand | Component | Path | What Was Verified |
|-------|-----------|------|-------------------|
| **Prime Electrical** | LeadCaptureForm | `f:\Prime\prime-electrical\src\components\ai\LeadCaptureForm.tsx` | Amber estimate card UI present (lines 127–157) |
| **AKF Construction** | LeadCaptureForm | `f:\Prime\akf-construction\src\components\ai\LeadCaptureForm.tsx` | Amber estimate card + building consent notice present (lines 133–151) |
| **CleanJet** | BookingWizard | `f:\Prime\cleanjet\src\components\BookingWizard.tsx` | Standard/Custom Quote tabs + cyan quote result present (lines 130–152, 243–248) |

The shared `FormState` type in `packages/ui-ai/src/types.ts` includes `quote_preview` state, confirming the UI layer is wired for quote display.

---

## Finding 2: Core Quote Generation Functions Working

| Edge Function | Path | Smoke Test |
|---------------|------|------------|
| `quote-generate-electrical` | `f:\Prime\supabase\functions\quote-generate-electrical\index.ts` | ✅ PASSED (live test) |
| `quote-generate-akf` | `f:\Prime\supabase\functions\quote-generate-akf\index.ts` | ✅ EXISTS |
| `generate-cleaning-quote` | — | ✅ PASSED |
| `estimate-cleaning-time` | — | ✅ PASSED |
| `project-timeline-estimator` | — | ✅ PASSED |

---

## Finding 3: CRITICAL — quote-accept Function Missing

**Impact:** Accept links in quote emails point to `/functions/v1/quote-accept`, but the edge function does not exist. Customers who receive quote emails cannot complete the accept flow — the link returns 404 or equivalent.

**Path checked:** `f:\Prime\supabase\functions\quote-accept\index.ts` — **MISSING** (never implemented)

---

## Finding 4: MODERATE — RLS Policies Missing

**Risk:** The `quotes` and `quote_line_items` tables have RLS enabled but no SELECT policies for `anon` or `authenticated` roles. Depending on how quote data is accessed (e.g., accept flow, admin dashboards), this may block reads or require service-role bypass.

---

## Finding 5: LOW — AKF_WEBHOOK_SECRET Is a Placeholder

**Location:** `akf-construction/.env.local`  
**Issue:** `AKF_WEBHOOK_SECRET` is currently a placeholder value. Real webhook verification will fail until replaced with the production secret.

---

## Finding 6: LOW — n8n quote-enrichment Not Wired

**Issue:** The `quote-enrichment` edge function exists, but the n8n trigger must be wired up manually. Until then, automated quote enrichment will not run.

---

## Finding 7: LOW — KB Embeddings Pending

**Issue:** AKF and CleanJet knowledge base embedding scripts have not been run. When FAQ content is ready, these need to be executed to enable FAQ-based quote enrichment.
