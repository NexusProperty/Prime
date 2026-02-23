# ORION-004 — Quote Preview Status Report

- **Orion ID:** ORION-004
- **Date:** 2026-02-23

---

## Dashboard

| Brand | UI Code | Flow Reachable | Confirmed Working | Bug |
|-------|---------|---------------|------------------|-----|
| Prime Electrical | ✅ | ✅ | ⏳ Untested locally | None |
| AKF Construction | ✅ | ✅ | ⏳ Untested locally | None |
| CleanJet Custom Quote | ✅ | ✅ | ⏳ Untested locally | None |

---

## What Works (as designed)

- Quote preview code exists in all 3 brand LeadCaptureForm/BookingWizard files
- Prime Electrical env vars are complete (all 6 required NEXT_PUBLIC and server vars set)
- Edge functions `quote-generate-electrical` and `quote-generate-akf` are deployed and passed smoke tests
- ORION-003 confirmed the UI state machine transitions are coded correctly
- `quote-accept` is deployed and working (QUOTE-ACCEPT task — 4/4 smoke tests passed)

## What Is Broken / Needs Verification

1. **Prime Electrical not flow-tested** — Code is correct and env vars are set, but the actual end-to-end flow (form submit → contactId → edge function → quote_preview) has not been verified locally. No errors have been reported from the deployed Vercel version.

2. **Silent failures hide issues** — Any error in the chain (edge function timeout, wrong siteId/workerId in DB, contact lookup race condition) causes a silent fallback to "confirmed". No visibility into which step failed.

---

## Why the User Doesn't See Quote Features

Most likely reasons (in order of probability):

1. **Not submitting the form** — The quote preview is inside the form flow, not a visible page element. It only appears after form submission + successful AI call.
2. **Missing email or message** — The quote call requires both `contactId` (from email lookup) and `data.message` to be present.
3. **Edge function silently failing** — No user-visible error if the AI call fails.

---

## Recommended Next Actions

1. **Test:** Submit Prime Electrical lead form with email + message and verify quote preview appears
2. **Optional:** Add console.error logging around quote fetch for dev visibility
