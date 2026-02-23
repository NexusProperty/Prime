# ORION-004 — Quote Preview Visibility Investigation

## Metadata
- Orion ID: ORION-004
- Date: 2026-02-23
- Target: QUOTES-001 frontend flow (LeadCaptureForm + BookingWizard) — live user observation
- Status: Complete

## Generated Files
- FINDINGS-ORION-004.md — Root cause analysis of why quote preview isn't visible
- SOLUTIONS-ORION-004.md — Step-by-step fix plan including AKF URL bug
- REPORT-ORION-004.md — Status dashboard: what works vs what needs fixing

## Summary
The quote preview UI code exists and is correct. It does NOT appear as a standalone feature — it only renders after submitting the lead form and only if the edge function succeeds. The user likely hasn't triggered the flow OR the flow is silently failing. A confirmed bug exists in AKF Construction's route.ts (`select=id?id` URL typo) that prevents contactId from being returned, meaning AKF will never show quote_preview. Prime Electrical should work if the form is submitted with email + message filled in.
