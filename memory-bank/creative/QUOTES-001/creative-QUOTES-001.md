# QUOTES-001 — Creative Phase
## AI Quote Generation System — Design Decisions

**Task:** QUOTES-001  
**Phase:** Creative  
**Date:** 2026-02-22  
**Covers:** LLM System Prompts · Email HTML Templates · Quote UI Components

---

## 🎨🎨🎨 ENTERING CREATIVE PHASE: LLM System Prompt Design

### Context & Constraints

Three quote-generation Edge Functions call OpenRouter with brand-specific system prompts. The prompt quality is the primary determinant of quote accuracy — too vague produces unusable estimates, too prescriptive limits LLM reasoning on edge cases.

**Shared constraints across all prompts:**
- Output must be **JSON only** (`response_format: { type: 'json_object' }`)
- All prices in **NZD cents** (integer, not float)
- `total` must equal `quantity × unit_price` — enforce in prompt wording
- `valid_until` recommended at 30 days from today unless job complexity suggests otherwise

### Option A — Minimal Prompt (Pricing Range Only)
Provide only price ranges per service type. Let LLM infer line item breakdown.

**Pros:** Shorter prompt = lower token cost, faster response  
**Cons:** Line item breakdowns are vague ("electrical work - $2,000"). Fails Zod's `description: z.string().min(1)` spirit.

### Option B — Benchmarked Prompt with Example Structure ✅ SELECTED
Provide pricing benchmarks per service type + labour rate + example line item structure. Include consent triggers for AKF.

**Pros:** Produces specific, defensible line items. Guides LLM on what granularity is expected.  
**Cons:** Larger prompt (~400 tokens). Mitigated by `response_format: json_object` preventing JSON markdown wrapping overhead.

### Option C — Few-Shot Examples
Include 1-2 example input/output pairs in the system prompt.

**Pros:** Highest accuracy for known job types  
**Cons:** 2-3× token cost. Risk of LLM anchoring to examples rather than reasoning from job description.

### Decision: Option B — Benchmarked Prompt

**Rationale:** Option B hits the sweet spot between cost and accuracy. Few-shot (C) is expensive and risks anchoring bias. Minimal (A) produces outputs that fail quality review.

---

### Final Prompt Designs

#### `quote-generate-electrical` System Prompt

```
You are a quoting assistant for Prime Electrical, a licensed electrical contractor in Auckland, New Zealand.

SERVICES: Fault finding & diagnostics, power points, lighting circuits, switchboard upgrades, RCD protection, heat pump installation (Daikin/Panasonic/Mitsubishi), EV charger installation, solar systems (SEANZ-certified), smart home automation (Control4/KNX/DALI).

PRICING (NZD cents — e.g. $150.00 = 15000):
- Labour rate: $120–$150/hour. Always itemise labour hours separately.
- Fault finding / callout: 15000–30000
- Standard power point installation: 8000–15000 each
- Switchboard upgrade (single phase): 250000–500000
- Switchboard upgrade (3-phase): 450000–800000
- RCD/RCBO installation: 30000–60000 per device
- Heat pump supply + install (2.5kW): 180000–250000
- Heat pump supply + install (5kW): 280000–380000
- EV charger (7kW Type 2): 120000–200000
- Solar system (6.6kW + 5kW battery): 1500000–2200000
- Smart home (DALI lighting 10 zones): 800000–2000000

RULES:
1. Break every distinct task into its own line item.
2. Separate labour (hours) from materials/supply where applicable.
3. quantity for labour = hours (decimal ok, e.g. 2.5). unit_price = hourly rate in cents.
4. total MUST equal quantity × unit_price (integer, rounded).
5. valid_until should be 30 days from today unless complexity suggests otherwise.
6. If job description is ambiguous, estimate for the most likely residential scenario.

Return ONLY valid JSON — no explanation, no markdown:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null"
}
```

---

#### `quote-generate-akf` System Prompt

```
You are a quoting assistant for AKF Construction Ltd, a licensed general contractor in Auckland, New Zealand. Established 2010.

SERVICES: Residential renovations (kitchens, bathrooms, structural alterations), architectural decks, new builds and extensions, fencing and boundaries, landscaping.

PRICING (NZD cents — e.g. $15,000.00 = 1500000):
- Builder labour rate: $90–$120/hour
- Kitchen renovation (mid-range, full gut): 3500000–6000000
- Kitchen renovation (premium): 6000000–10000000
- Bathroom renovation (standard): 1800000–3500000
- Bathroom renovation (ensuite, premium): 3500000–6000000
- Hardwood deck: 90000–120000 per m² installed
- Composite deck (Trex/Millboard): 70000–100000 per m² installed
- Pine deck: 50000–70000 per m² installed
- Glass balustrade: 45000–60000 per linear metre
- Stairs (single flight): 250000–450000
- Pergola addition: 1000000–2000000
- Horizontal slat privacy fencing: 20000–45000 per linear metre
- Pool fence (glass): 40000–70000 per linear metre
- Retaining wall (concrete block): 120000–350000 per m²
- Driveway (concrete): 10000–18000 per m²
- New build: 350000–650000 per m²

BUILDING CONSENT RULES (Auckland Council):
Consent IS REQUIRED for:
- Any structural work (removing/adding walls, beams)
- Decks more than 1.5m above ground level
- All new builds and extensions > 10m²
- Retaining walls more than 1.5m high
- Any alterations to plumbing or drainage
When consent is required, add a line item:
  { "description": "Auckland Council Building Consent (estimated)", "quantity": 1, "unit_price": [fee], "total": [fee] }
  Consent fee guide: project < $20k → 250000; $20k–$100k → 500000; > $100k → 900000
Set consent_required: true and explain in consent_notes.

RULES:
1. Break every distinct task into its own line item.
2. Separate materials from labour where meaningful.
3. total MUST equal quantity × unit_price (integer, rounded).
4. valid_until: 30 days for standard jobs; 14 days for jobs where materials pricing is volatile (steel, timber).
5. If scope unclear, estimate for residential mid-range finish.

Return ONLY valid JSON — no explanation, no markdown:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null",
  "consent_required": true | false,
  "consent_notes": "string or null"
}
```

---

#### `generate-cleaning-quote` System Prompt

```
You are a quoting assistant for CleanJet, a professional residential cleaning service in Auckland, New Zealand.

SERVICES: Regular maintenance cleans, deep cleans, end of tenancy cleans, post-build/renovation cleans, commercial cleans.

PRICING (NZD cents — e.g. $79.00 = 7900):
- Regular clean: 4500–6000 per bedroom (minimum 7900 for 1-2 bed)
- Deep clean: 6500–8500 per bedroom (minimum 14900 for 1-2 bed)
- End of tenancy: base 24900 for 1-2 bed; add 8000 per additional bedroom
- Post-build clean (light dust — paint only): 18000 per bedroom (minimum 35000)
- Post-build clean (medium construction dust): 25000 per bedroom
- Post-build clean (heavy — structural, multiple trades): 35000 per bedroom
- Carpet steam clean: 6000–12000 per room (lower for regular, higher for heavily soiled)
- Oven deep clean: 6500–9000
- Internal window cleaning: 1500–2500 per window
- External window cleaning (add 50% to internal rate)
- Garage clean: 8000–15000
- Pet hair removal: 3000–6000 flat fee

URGENCY SURCHARGES:
- urgent (same-day or next-day): +25% to total
- standard: no surcharge

END OF TENANCY DEFAULTS:
Always include oven clean. If any carpet staining mentioned, include carpet steam. Include all bathrooms in the base price.

POST-BUILD ASSESSMENT:
Estimate dust level from renovation description:
- light: painting, tiling, minor cosmetic work
- medium: kitchen/bathroom renovation, plastering
- heavy: structural work, new builds, multiple trades on site

RULES:
1. Break into clear line items (base clean, each extra separately).
2. total MUST equal quantity × unit_price (integer, rounded).
3. Include recommended_service and duration_hours in output.
4. duration_hours: regular = 0.75h/room; deep = 1.25h/room; end of tenancy = 1.5h/room + extras.

Return ONLY valid JSON — no explanation, no markdown:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null",
  "recommended_service": "regular | deep_clean | end_of_tenancy | post_build",
  "duration_hours": number
}
```

---

#### `quote-enrichment` System Prompt

```
You are a quote quality reviewer for Prime Electrical, an Auckland electrical contractor.
You receive a completed quote and job description. Identify upsell opportunities, cross-sell signals, and pricing issues.

Respond with JSON only:
{
  "upsell_suggestions": [
    { "description": "string", "reason": "string", "estimated_value_cents": number }
  ],
  "financing_recommended": true | false,
  "cross_sell_opportunities": [
    { "brand": "akf | cleanjet", "reason": "string", "pitch": "string" }
  ],
  "review_notes": "string — 1-3 sentences on quote accuracy and completeness"
}

UPSELL TRIGGERS:
- Switchboard upgrade quoted → suggest EV-charger-ready conduit (+$800)
- Heat pump quoted → suggest smart thermostat integration (+$400)
- Solar quoted → suggest Tesla Powerwall or Enphase battery (+$8,000–$15,000)
- Any job > $1,200 → set financing_recommended: true

CROSS-SELL TRIGGERS (write to cross_sell_opportunities):
- Job description mentions renovation, building work, new kitchen/bathroom → brand: "akf"
- Job description mentions move-in, move-out, renovation clean, builder → brand: "cleanjet"
```

## 🎨🎨🎨 EXITING CREATIVE PHASE: LLM System Prompt Design

**Selected approach:** Option B — Benchmarked Prompts  
**Key decisions:**
- Prices in cents, integer only — enforced in prompt wording and Zod
- `total MUST equal quantity × unit_price` — explicit wording prevents LLM rounding errors
- Labour always itemised separately for electrical and construction
- AKF consent detection built into prompt (not post-processing)
- CleanJet `duration_hours` and `recommended_service` returned from LLM for scheduling

---

## 🎨🎨🎨 ENTERING CREATIVE PHASE: Email HTML Templates

### Context & Constraints

`quote-send-*` Edge Functions build HTML inline and send via Resend API. No shared template system exists in `mc-send` — HTML is built per-function. Three brand-specific templates needed.

**Confirmed brand tokens (from actual CSS files):**
- Prime Electrical: `brandConfig: amber-600` (amber-500, amber-50) — blue primary but amber is the AI/action colour
- AKF Construction: `brandConfig: slate-900` (slate-100) — deep slate, amber/timber accent
- CleanJet: `brandConfig: cyan-500` (cyan-600, cyan-50) — blue/green, cyan action colour

**Technical constraints:**
- Must be inline CSS (email clients don't support `<style>` tags reliably)
- Tables for layout (Outlook compatibility)
- Maximum width: 600px
- Fonts: system-safe stack (Arial, Helvetica, sans-serif) — no web fonts in email

### Option A — Text-Heavy Functional Layout
Simple table with minimal styling. Maximum compatibility, looks generic.

### Option B — Branded Card Layout with Colour Header ✅ SELECTED
Coloured header block matching brand, white content card, line items table with alternating row shading, branded CTA button.

**Pros:** Professional appearance. Consistent with Prime Group brand identity. Resend/Gmail/Outlook all render this pattern correctly.

### Option C — Full Graphic Design (Logo + Hero Image)
Large logo, hero banner image, feature tiles.

**Cons:** Image blocking in email clients. Heavy maintenance. Overkill for a quote.

### Decision: Option B — Branded Card Layout

---

### Template Structure (shared across all 3 brands)

```
┌─────────────────────────────────────────┐
│  [BRAND HEADER — coloured background]   │
│  Logo/Brand Name    📍 Auckland, NZ     │
├─────────────────────────────────────────┤
│  Hi [Contact Name],                     │
│  Here's your quote from [Brand]:        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ QUOTE SUMMARY                   │   │
│  │ Quote #: [id truncated]         │   │
│  │ Valid until: [date]             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  LINE ITEMS TABLE:                      │
│  Description | Qty | Unit | Total       │
│  ─────────────────────────────────────  │
│  [item 1]                               │
│  [item 2 — shaded row]                 │
│  [item 3]                               │
│  ─────────────────────────────────────  │
│  TOTAL:                   $X,XXX.XX NZD│
│                                         │
│  [BRAND-SPECIFIC INSERT — see below]    │
│                                         │
│  [CTA BUTTON — "Accept This Quote"]     │
│  [Secondary link — "Call us: 09-xxx"]   │
│                                         │
│  Notes: [if any]                        │
├─────────────────────────────────────────┤
│  [FOOTER — certifications, address]     │
└─────────────────────────────────────────┘
```

---

### Prime Electrical Email Template

**Header colour:** `#D97706` (amber-600 — matches brandConfig)  
**Button colour:** `#D97706`  
**Brand-specific insert:** Financing callout box

```html
<!-- Financing callout (Prime Electrical only) -->
<tr>
  <td style="padding: 16px; background-color: #FEF3C7; border-radius: 8px; border-left: 4px solid #D97706;">
    <p style="margin: 0; font-size: 14px; color: #92400E; font-weight: 600;">
      💳 Finance Available — Pay from $0 Upfront
    </p>
    <p style="margin: 4px 0 0; font-size: 13px; color: #78350F;">
      GEM Visa · Q Mastercard · ANZ · Westpac interest-free options available.
      Ask us about 12-month no-interest finance.
    </p>
  </td>
</tr>
```

**Footer content:**
- Master Electricians New Zealand member
- SEANZ certified solar installer
- 12-month workmanship guarantee
- Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013
- info@theprimeelectrical.co.nz · 09-390-3620

---

### AKF Construction Email Template

**Header colour:** `#1E293B` (slate-800 — close to brandConfig slate-900)  
**Button colour:** `#D97706` (amber accent — matches brand accent)  
**Brand-specific insert:** Consent notice (conditional)

```html
<!-- Consent notice (AKF only — shown when consent_required = true) -->
<tr>
  <td style="padding: 16px; background-color: #FFFBEB; border-radius: 8px; border-left: 4px solid #F59E0B;">
    <p style="margin: 0; font-size: 14px; color: #78350F; font-weight: 600;">
      📋 Auckland Council Building Consent
    </p>
    <p style="margin: 4px 0 0; font-size: 13px; color: #92400E;">
      This project may require building consent. Consent fee included as a line item above.
      AKF Construction manages the full consent application on your behalf.
      Processing typically takes 20 working days.
    </p>
  </td>
</tr>
```

**Footer content:**
- Licensed Building Practitioner (LBP)
- Established 2010 · 10-year structural guarantee
- 2/41 Smales Rd, East Tāmaki, Auckland 2013
- info@akfconstruction.co.nz · 09-951-8763

---

### CleanJet Email Template

**Header colour:** `#0891B2` (cyan-600 — matches brandConfig)  
**Button colour:** `#0891B2`  
**Brand-specific insert:** Duration + scheduling info

```html
<!-- Scheduling info (CleanJet only) -->
<tr>
  <td style="padding: 16px; background-color: #ECFEFF; border-radius: 8px; border-left: 4px solid #0891B2;">
    <p style="margin: 0; font-size: 14px; color: #164E63; font-weight: 600;">
      🗓 Estimated Duration: [X] hours · [N] cleaner(s)
    </p>
    <p style="margin: 4px 0 0; font-size: 13px; color: #155E75;">
      We'll confirm your exact booking time after you accept this quote.
      Flexible morning and afternoon slots available Mon–Sat.
    </p>
  </td>
</tr>
```

**Footer content:**
- 45-point cleaning checklist on every visit
- Bond-back guarantee on end of tenancy cleans
- Auckland-wide service
- cleanjet.co.nz · hello@cleanjet.co.nz

---

### Shared HTML Scaffolding (TypeScript template literal)

Used in all three `quote-send-*` functions:

```typescript
function buildQuoteEmail(params: {
  brandName: string;
  brandColour: string;      // hex
  contactName: string;
  quoteId: string;
  lineItems: Array<{ description: string; quantity: number; unit_price: number; total: number }>;
  totalAmount: number;      // in cents
  currency: string;
  validUntil: string | null;
  notes: string | null;
  brandInsert: string;      // pre-built HTML for the brand-specific section
  footerLines: string[];
  phone: string;
  acceptUrl: string;        // webhook URL for acceptance
}): string {
  const formatCents = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${params.currency}`;

  const lineItemRows = params.lineItems.map((item, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'};">
      <td style="padding: 10px 12px; font-size: 14px; color: #374151;">${item.description}</td>
      <td style="padding: 10px 12px; font-size: 14px; color: #374151; text-align: center; white-space: nowrap;">${item.quantity}</td>
      <td style="padding: 10px 12px; font-size: 14px; color: #374151; text-align: right; white-space: nowrap;">${formatCents(item.unit_price)}</td>
      <td style="padding: 10px 12px; font-size: 14px; color: #374151; text-align: right; white-space: nowrap; font-weight: 600;">${formatCents(item.total)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Quote from ${params.brandName}</title></head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
      <!-- HEADER -->
      <tr>
        <td style="background-color:${params.brandColour};padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td><span style="font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.5px;">${params.brandName}</span></td>
              <td align="right"><span style="font-size:13px;color:rgba(255,255,255,0.8);">📍 Auckland, NZ</span></td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- GREETING -->
      <tr>
        <td style="padding:28px 32px 0;">
          <p style="margin:0 0 8px;font-size:16px;color:#111827;">Hi ${params.contactName},</p>
          <p style="margin:0;font-size:15px;color:#4B5563;">Here's your quote from ${params.brandName}:</p>
        </td>
      </tr>
      <!-- QUOTE META -->
      <tr>
        <td style="padding:16px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;">
            <tr>
              <td style="padding:12px 16px;font-size:13px;color:#6B7280;">
                <strong style="color:#374151;">Quote Reference:</strong> ${params.quoteId.substring(0, 8).toUpperCase()}
                ${params.validUntil ? `&nbsp;&nbsp;·&nbsp;&nbsp;<strong style="color:#374151;">Valid Until:</strong> ${params.validUntil}` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- LINE ITEMS -->
      <tr>
        <td style="padding:20px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #E2E8F0;">
            <tr style="background-color:${params.brandColour};">
              <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
              <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
              <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Unit Price</th>
              <th style="padding:10px 12px;font-size:12px;font-weight:600;color:#FFFFFF;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
            </tr>
            ${lineItemRows}
            <!-- TOTAL ROW -->
            <tr style="background-color:#1E293B;">
              <td colspan="3" style="padding:14px 12px;font-size:15px;font-weight:700;color:#FFFFFF;text-align:right;">TOTAL</td>
              <td style="padding:14px 12px;font-size:15px;font-weight:700;color:#FFFFFF;text-align:right;white-space:nowrap;">${formatCents(params.totalAmount)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- BRAND INSERT (financing / consent / scheduling) -->
      <tr><td style="padding:16px 32px 0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td>${params.brandInsert}</td></tr></table></td></tr>
      <!-- CTA BUTTONS -->
      <tr>
        <td style="padding:24px 32px 0;text-align:center;">
          <a href="${params.acceptUrl}" style="display:inline-block;padding:14px 32px;background-color:${params.brandColour};color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
            Accept This Quote
          </a>
          <p style="margin:12px 0 0;font-size:14px;color:#6B7280;">
            Or call us: <a href="tel:${params.phone}" style="color:${params.brandColour};font-weight:600;">${params.phone}</a>
          </p>
        </td>
      </tr>
      ${params.notes ? `<tr><td style="padding:16px 32px 0;"><p style="margin:0;font-size:13px;color:#6B7280;font-style:italic;"><strong>Notes:</strong> ${params.notes}</p></td></tr>` : ''}
      <!-- FOOTER -->
      <tr>
        <td style="padding:24px 32px;margin-top:24px;border-top:1px solid #E2E8F0;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
            ${params.footerLines.join('<br>')}
          </p>
          <p style="margin:12px 0 0;font-size:11px;color:#D1D5DB;">
            This quote was generated by ${params.brandName} AI quoting system. Prices are estimates — final pricing confirmed after site assessment.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
```

## 🎨🎨🎨 EXITING CREATIVE PHASE: Email HTML Templates

**Selected approach:** Option B — Branded Card Layout  
**Key decisions:**
- `buildQuoteEmail()` shared function eliminates duplication across 3 send functions
- Brand-specific colour as header + table header (single `brandColour` parameter)
- Brand-specific insert section handles financing/consent/scheduling callout
- `formatCents()` helper formats integers to `$X,XXX.XX NZD` consistently
- Footer disclaimer: "Prices are estimates — final pricing confirmed after site assessment" protects against liability on AI-generated values

---

## 🎨🎨🎨 ENTERING CREATIVE PHASE: Quote UI Components

### Context & Constraints

Two existing UI flows need quote integration:
1. `LeadCaptureForm.tsx` — Prime Electrical + AKF Construction (state machine: idle → ai_processing → cross_sell → confirmed)
2. `BookingWizard.tsx` — CleanJet (3-step wizard: RoomSelector → DatePicker → ConfirmReview)

**Confirmed patterns:**
- Success state: `rounded-xl border border-emerald-200 bg-emerald-50` (both components)
- Brand colours via `brandConfig[brand].bg`, `brandConfig[brand].text`, `brandConfig[brand].bg/10`
- Cross-sell card uses violet "AI Recommendation" badge
- Spinner overlay pattern exists in `AIProcessingOverlay`

### Decision Area 1: LeadCaptureForm Quote Display

#### Option A — Quote in AI Processing Overlay
Show estimated range while spinner runs: "Generating your quote... ~$2,800–$4,500"

**Pros:** Exciting — customer sees price forming in real time  
**Cons:** Quote isn't ready until the API call completes. Would need a two-stage spinner (processing → result).

#### Option B — New `quote_preview` State After `ai_processing` ✅ SELECTED
After AI processing completes, transition to a `quote_preview` state that shows the estimated range and line item count before cross-sell cards.

**Pros:** Clean separation of concerns. Quote preview state can be shown to all users regardless of cross-sell. Natural flow.

#### Option C — Inline in Success/Confirmed State
Show quote total in the success box alongside "We'll be in touch within 2 hours."

**Pros:** Minimal code change  
**Cons:** Success state feels anticlimactic. Customer may not notice the price buried in the confirmation.

**Decision: Option B — `quote_preview` state**

**New state machine:**
```
idle → submitting → ai_processing → quote_preview → [cross_sell_triggered?] → confirmed
                                         ↑
                              (new state — shows estimated quote)
```

**`quote_preview` UI design:**
```tsx
// After ai_processing, before cross_sell check
{formState === 'quote_preview' && quoteResult && (
  <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
    <div className="mb-1 text-sm font-medium text-amber-700 uppercase tracking-wide">
      Your Instant Estimate
    </div>
    <div className="text-4xl font-bold text-amber-900 tracking-tight">
      ${(quoteResult.total_amount / 100).toLocaleString('en-NZ', { maximumFractionDigits: 0 })}
    </div>
    <div className="mt-1 text-sm text-amber-700">NZD · {quoteResult.line_items_count} line items</div>
    <p className="mt-3 text-xs text-amber-600">
      Estimate only — final price confirmed at site assessment.
      Full quote sent to your email shortly.
    </p>
    <button
      onClick={() => setFormState(hasCrossSell ? 'cross_sell_triggered' : 'confirmed')}
      className="mt-4 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
    >
      Continue →
    </button>
  </div>
)}
```

**AKF consent notice** (shown in `quote_preview` when `consent_required: true`):
```tsx
{quoteResult?.consent_required && (
  <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-left">
    <p className="text-xs font-semibold text-amber-800">📋 Building Consent Required</p>
    <p className="mt-0.5 text-xs text-amber-700">
      This project likely requires Auckland Council building consent.
      Estimated fee included in your quote. AKF handles the full application.
    </p>
  </div>
)}
```

---

### Decision Area 2: CleanJet BookingWizard Custom Quote Path

#### Option A — Pre-Step 0 Service Type Router
Add a step 0 before RoomSelector: "What type of clean do you need?" with 4 options. Standard → existing flow; Custom → AI quote flow.

**Pros:** Clear bifurcation point. User makes an explicit choice.  
**Cons:** Adds a step to the existing (already working) standard flow.

#### Option B — Modify Step 1 (RoomSelector) to Include Custom Option ✅ SELECTED
Keep the existing 3-step flow unchanged. Add a "Custom Quote" tab or section at the top of Step 1 for post-build and end-of-tenancy.

**Pros:** Zero impact on existing standard booking flow. Custom quote is opt-in.  
**Cons:** Slightly more complex Step 1 component.

#### Option C — Separate Page/Modal for Custom Quote
New route (`/custom-quote`) or full-screen modal.

**Cons:** Breaks the wizard metaphor. Harder to cross-sell after.

**Decision: Option B — Enhanced Step 1 with Custom Tab**

**Step 1 UI layout:**
```
┌─────────────────────────────────────────┐
│  Book Your Clean                        │
│                                         │
│  [Standard] [Custom Quote] ← tab toggle │
│                                         │
│  STANDARD TAB (existing):               │
│  Bedrooms: [1] [2] [3] [4] [5+]        │
│  Extras: [Oven] [Windows] [Bathrooms]   │
│                                         │
│  CUSTOM QUOTE TAB (new):               │
│  Service: [Post-Build] [End of Tenancy] │
│           [Commercial] [Other]          │
│  Bedrooms: [number input]               │
│  Describe your situation: [textarea]    │
│  [Get AI Quote →]                      │
└─────────────────────────────────────────┘
```

**Custom quote result display (replaces Step 2 in custom flow):**
```tsx
// After AI quote returns
<div className="rounded-xl border border-cyan-200 bg-cyan-50 p-6">
  <div className="text-sm font-medium text-cyan-700 uppercase tracking-wide mb-1">
    Your Custom Clean Quote
  </div>
  <div className="text-4xl font-bold text-cyan-900">
    ${(quoteResult.total_amount / 100).toLocaleString('en-NZ', { maximumFractionDigits: 0 })}
  </div>
  <div className="text-sm text-cyan-700 mt-1">NZD · Est. {quoteResult.duration_hours}h</div>
  {/* Line items expandable accordion */}
  <details className="mt-4">
    <summary className="cursor-pointer text-sm font-medium text-cyan-800">
      View {quoteResult.line_items.length} line items
    </summary>
    <div className="mt-2 space-y-1">
      {quoteResult.line_items.map((item, i) => (
        <div key={i} className="flex justify-between text-sm text-cyan-700">
          <span>{item.description}</span>
          <span className="font-medium">${(item.total / 100).toFixed(2)}</span>
        </div>
      ))}
    </div>
  </details>
  <button onClick={() => setStep(2)} className="mt-4 w-full rounded-lg bg-cyan-600 py-3 text-white font-semibold">
    Book This Clean →
  </button>
</div>
```

## 🎨🎨🎨 EXITING CREATIVE PHASE: Quote UI Components

**Selected approaches:**
- LeadCaptureForm: New `quote_preview` state (Option B) — amber styling matching Prime Electrical brandConfig
- BookingWizard: Enhanced Step 1 with Custom tab (Option B) — zero impact on standard flow
- AKF consent notice: Inline in `quote_preview` state, amber warning box
- CleanJet quote result: `<details>` accordion for line items (collapsible, mobile-friendly)
- Both quote displays use brand colour (amber for Prime/AKF, cyan for CleanJet) — consistent with brandConfig

---

## Summary of All Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| LLM Prompts | Option B — Benchmarked with pricing tables | Best accuracy/cost ratio |
| Prompt pricing units | NZD cents (integer) — enforced in wording | Matches Zod `z.number().int()` |
| Consent detection | In prompt + extended Zod output schema | Not post-processing — more reliable |
| Email layout | Option B — Branded Card Layout | Professional, email-client compatible |
| Email HTML | Shared `buildQuoteEmail()` function | Eliminates 3-way code duplication |
| Email brand insert | Per-brand slot (financing/consent/scheduling) | Flexible, maintainable |
| LeadCaptureForm quote | Option B — New `quote_preview` state | Clean flow, doesn't bury price in success |
| AKF consent notice | Inline in `quote_preview` | Contextually placed where user can act on it |
| BookingWizard custom | Option B — Enhanced Step 1 tab | Zero impact on existing standard flow |
| CleanJet line items | `<details>` accordion | Mobile-friendly, reduces visual noise |

---

## Implementation Notes for `/build`

1. **`buildQuoteEmail()`** — Create in `f:/Prime/supabase/functions/_shared/email.ts` (new shared module)
2. **`quote_preview` state** — Add to `FormState` type in `LeadCaptureForm.tsx`. Update the state machine after the `quote-generate-*` API call returns.
3. **BookingWizard Step 1** — Add `quoteMode: boolean` state. When `quoteMode: true`, skip RoomSelector and render custom quote form.
4. **AKF `quote_preview`** — Pass `consent_required` and `consent_notes` from API response through form state.
5. **CleanJet quote state** — Add `aiQuoteResult` to BookingWizard state. When set, Step 2 renders the quote result card instead of DatePicker.

---

*Creative phase complete. All design decisions are final. Proceed to `/build`.*
