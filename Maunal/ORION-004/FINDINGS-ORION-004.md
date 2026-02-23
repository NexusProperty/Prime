# ORION-004 — Quote Preview Visibility: Findings Report

- **Orion ID:** ORION-004
- **Date:** 2026-02-23
- **Target:** QUOTES-001 quote preview flow (all 3 brands)
- **Trigger:** User observation — "no quote features visible on local website"

---

## Executive Summary

The quote preview UI code is implemented correctly across all 3 brands. However, the preview is **not a standalone feature** — it only renders after a user submits the lead form AND the AI generation edge function succeeds. The system has several silent failure paths where errors are swallowed and the user is shown a generic "confirmed" state. All env vars are correctly configured in both brands' `.env.local` files. The form is placed on both the homepage and contact-us page for Prime Electrical and AKF Construction.

---

## Finding 1 — Quote Preview Is Flow-Gated, Not Standalone (MEDIUM — UX confusion)

**Files:** All 3 brand `LeadCaptureForm.tsx` files + `BookingWizard.tsx`

The quote preview (`quote_preview` state) is not a button, page, or separate UI element. It appears **only during the lead form submission flow**:

```
User fills form → Submit → AI processing overlay → [quote_preview card]
```

The user must:
1. Navigate to the correct page (the page hosting the `LeadCaptureForm` component)
2. Fill in ALL required fields including **email** (required for contactId lookup) and **message** (job description — used as LLM input)
3. Submit the form
4. Wait for the AI processing overlay to complete

If the user expects a standalone "Get a Quote" page or button, they will not find it — the design embeds the preview inside the lead capture flow.

---

## Finding 2 — Silent Failure Hides All Quote Errors (MEDIUM)

**File:** All brand `LeadCaptureForm.tsx` files

The quote API call uses `.catch(() => null)`:

```typescript
const quoteRes = await fetch(`${supabaseUrl}/functions/v1/quote-generate-electrical`, {
  ...
}).catch(() => null)
```

If the edge function:
- Returns a non-200 status
- Times out
- Throws any error
- Returns `{ data: null, error: "..." }`

...the form **silently falls back** to `confirmed` or `cross_sell_triggered`. The user sees "Request received!" with no indication that the quote generation failed. There is no way for the user to know if quote preview was attempted or why it didn't appear.

---

## Finding 3 — contactId Depends on Timing and Email (MEDIUM)

**File:** `prime-electrical/src/app/api/leads/submit/route.ts`

The `contactId` is looked up AFTER the ingest edge function runs:

```typescript
const ingestRes = await fetch(INGEST_URL, ...) // creates/upserts contact
const result = await ingestRes.json()           // returns leadId
// Then: lookup contactId by email
const contactRes = await fetch(`/rest/v1/contacts?email=eq.{email}...`)
```

If `email` is not in the form submission, `contactId` is `undefined` → quote is skipped.
If the ingest function hasn't finished upserting the contact by the time the lookup runs (race condition), `contactId` may also be `undefined`.

---

## Finding 4 — CleanJet Custom Quote Tab Is Hidden by Default (LOW)

**File:** `cleanjet/src/components/BookingWizard.tsx`

The CleanJet custom quote flow is inside a "Custom Quote" tab in the BookingWizard's Step 1. The **default view is "Standard"** booking. A user who doesn't notice the tab toggle will never see the custom AI quote path.

---

## Finding 5 — ORION-003 "UI Confirmed" Was Code-Level, Not Flow-Level (INFO)

ORION-003 confirmed the quote UI existed by reading the source files and finding the correct JSX at the correct lines. It did NOT verify the end-to-end form submission flow. The code being present does not mean the flow completes successfully — multiple runtime conditions must align.

---

## Pattern Analysis

| Component | Code Present | Flow Reachable | Silent Failure | Bug |
|-----------|-------------|---------------|---------------|-----|
| Prime Electrical quote preview | ✅ | ✅ (if email + message filled) | ✅ | None |
| AKF Construction quote preview | ✅ | ✅ (if email + message filled) | ✅ | None |
| CleanJet Custom Quote | ✅ | ✅ (if Custom tab selected) | ✅ | None |
| CleanJet Standard flow | N/A | N/A — no quote in standard | N/A | N/A |
