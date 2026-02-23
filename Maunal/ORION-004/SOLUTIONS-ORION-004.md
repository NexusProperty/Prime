# ORION-004 — Quote Preview: Solutions & Fix Recommendations

- **Orion ID:** ORION-004
- **Date:** 2026-02-23

---

## Phase A — Test Prime Electrical Quote Flow (Immediate — no code change needed)

To confirm Prime Electrical is working:

1. Start the dev server: `cd f:\Prime\prime-electrical && npm run dev`
2. Open `http://localhost:3000` (or wherever the lead form lives)
3. Open browser DevTools → Network tab
4. Fill the lead form:
   - Name: Test User
   - Phone: 021 123 4567
   - **Email: [any valid email]** ← REQUIRED for contactId lookup
   - **Message: "I need a switchboard upgrade for my 4-bedroom house"** ← REQUIRED for LLM
   - Service Type: any
5. Submit the form
6. Watch Network tab for:
   - `/api/leads/submit` → response should include `contactId`
   - `quote-generate-electrical` → should return 200 with quote data
7. Expected: Form shows amber estimate card ("Your Instant Estimate")

**If contactId is missing:** The ingest-prime edge function created the contact but the REST lookup failed. Check browser console for errors.

**If quote-generate-electrical fails:** Check the response body in Network tab. Common causes: worker_id or site_id not matching DB values.

---

## Phase B — Add Quote Error Visibility (MEDIUM — 30 min)

Currently all quote errors are silently swallowed. Add minimal logging/UI to help debug:

**In `LeadCaptureForm.tsx` (all brands), change:**
```typescript
const quoteRes = await fetch(`${supabaseUrl}/functions/v1/quote-generate-electrical`, {
  ...
}).catch(() => null)
```

**To (add console.error):**
```typescript
const quoteRes = await fetch(`${supabaseUrl}/functions/v1/quote-generate-electrical`, {
  ...
}).catch((err) => {
  console.error('[quote-generate] fetch error:', err)
  return null
})

if (quoteRes && !quoteRes.ok) {
  const errBody = await quoteRes.text().catch(() => 'unreadable')
  console.error('[quote-generate] non-200:', quoteRes.status, errBody)
}
```

This makes failures visible in the browser console during local development.

---

## Phase C — Make CleanJet Custom Quote More Discoverable (LOW — 15 min)

The "Custom Quote" tab is easy to miss. Consider:
- Adding a default selection or a highlighted badge to the Custom Quote tab
- Adding a note under the Standard booking: "Need a post-build or commercial clean? Try Custom Quote →"
- OR defaulting to Custom Quote for Post-Build/Commercial service types

---

## Effort Estimates

| Phase | Change | Effort | Impact |
|-------|--------|--------|--------|
| A | Test Prime flow | 10 min | Confirm or diagnose Prime flow |
| B | Add error logging | 30 min | Makes silent failures visible |
| C | CleanJet discoverability | 15 min | UX improvement |
