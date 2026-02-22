# AKF Construction — AI Quote Plan

> **Business:** AKF Construction Ltd
> **Location:** 2/41 Smales Rd, East Tāmaki, Auckland 2013
> **Industry:** General contractor — residential renovations, decks, new builds, fencing, landscaping
> **Supabase Project:** `tfdxlhkaziskkwwohtwd` (shared with Prime Electrical & CleanJet)
> **Priority:** HIGH — highest average project value ($5,000–$250,000+), longest sales cycle, most in need of pre-qualification filter

---

## Business Context

AKF Construction offers five service categories with wide price ranges:

| Service | Typical Range | Complexity |
|---------|--------------|-----------|
| Renovations & Alterations | $15,000–$150,000 | High — consent often required |
| Architectural Decks | $8,000–$45,000 | Medium — material & size dependent |
| New Builds & Extensions | $80,000–$500,000+ | Very high — full consent process |
| Fencing & Boundaries | $3,000–$25,000 | Low–Medium |
| Landscaping | $5,000–$80,000 | Medium |

**Current quoting flow:** Lead form → AI processing → Cross-sell detection → Manual site visit → Written quote within 48 hours. No automated estimates exist.

**Key pain point:** AKF receives many unqualified leads who expect $2,000 jobs but describe $50,000 projects. An AI ballpark estimate up-front would filter expectations and save costly site visits for unqualified leads.

**Unique requirement:** Auckland Council building consent is required for many projects. The AI quote must flag when consent is likely required and include estimated council fees — this is a major differentiator.

---

## Current State Assessment

### What Exists
- `ingest-akf` Edge Function (external) — captures leads to shared Supabase
- `leads` table (shared) — captures service type and message
- `LeadCaptureForm` — AI processing overlay (cosmetic, no quote engine)
- `AIChatWidget` — OpenRouter connected, Vapi.ai voice
- `AIInteractiveLayer` — emergency keyword detection
- Cross-sell detection (references Prime Electrical and CleanJet)
- `FeaturedProjects` component — portfolio with project examples

### What's Missing
- Any quote storage tables
- `quote-generate-akf` Edge Function
- Consent fee estimation logic
- Material cost calculator
- Project timeline estimator

---

## Recommended AI Functions

### 1. `quote-generate-akf` (Priority: P0)

**Purpose:** Generate a ballpark cost estimate from a customer's project description. Scoped specifically to construction pricing in Auckland.

**Supabase Edge Function:** `supabase/functions/quote-generate-akf/index.ts`

**Inputs:**
```typescript
{
  job_description: string        // Customer's description of project
  service_type: string           // 'renovation' | 'deck' | 'new_build' | 'fencing' | 'landscaping'
  property_type?: string         // 'residential' | 'commercial'
  property_location?: string     // Auckland suburb (affects consents and logistics)
  site_id: string
  worker_id: string
  contact_id: string
  lead_id?: string
  idempotency_key?: string
}
```

**LLM System Prompt Template:**
```
You are a quoting assistant for AKF Construction Ltd, a licensed general contractor in Auckland, New Zealand.
Established 2010. Specialises in residential renovations, architectural decks, new builds, fencing, and landscaping.

Pricing is in NZD cents (e.g. $15,000.00 = 1500000). Auckland construction labour rate: $80–$120/hour.
Material costs reflect current Auckland supply chain pricing.

Service pricing benchmarks (Auckland 2025-2026):
- Kitchen renovation: $30,000–$80,000 depending on size and finish
- Bathroom renovation: $15,000–$45,000
- Deck (hardwood/composite): $600–$1,200/m² supply and install
- Pool fencing (glass): $400–$700/m linear
- Horizontal slat privacy fencing: $200–$450/m linear
- Retaining wall: $1,200–$3,500/m²
- New build (per m²): $3,500–$6,500/m²
- Driveway concrete: $100–$180/m²

Building consent is typically required for:
- Structural work (new walls, removing load-bearing walls)
- Decks > 1.5m above ground
- New builds and extensions
- Retaining walls > 1.5m high
- Any alterations to drainage or plumbing
Auckland Council consent fees: $2,000–$15,000+ depending on project value
Include consent fee estimate as a separate line item when applicable.

Return ONLY valid JSON:
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

**Note:** The LLM response schema extends the standard `QuoteLineItem[]` with `consent_required` and `consent_notes`. Store these in `quotes.ai_notes` as JSONB.

**Outputs:**
```typescript
{
  data: {
    quote_id: string
    status: 'draft'
    total_amount: number
    currency: 'NZD'
    consent_required: boolean
    consent_notes: string | null
  } | null
  error: string | null
}
```

---

### 2. `estimate-deck-cost` (Priority: P1)

**Purpose:** Precise deck cost calculator based on dimensions, materials, and site conditions. More granular than the general quote function — used when customer has specific deck plans.

**Inputs:**
```typescript
{
  length_m: number           // Deck length in metres
  width_m: number            // Deck width in metres
  height_m: number           // Height above ground (determines consent requirement)
  material: 'hardwood' | 'composite' | 'pine'
  features: string[]         // ['stairs', 'balustrade', 'lighting', 'pergola', 'privacy_screen']
  location: string           // Auckland suburb
  contact_id: string
  site_id: string
  worker_id: string
  idempotency_key?: string
}
```

**Pricing logic (Auckland 2025-2026):**
- Hardwood: $900–$1,200/m² installed
- Composite (Trex/Millboard): $700–$1,000/m² installed
- Pine: $500–$700/m² installed
- Balustrade (glass): +$400–$600/linear metre
- Stairs: +$2,000–$4,500 per flight
- Pergola addition: +$8,000–$20,000
- Consent (height > 1.5m): +$2,500–$5,000

**Use case:** Customer says "I want a 6m × 4m hardwood deck with glass balustrade, 800mm above ground, in Remuera." System returns precise itemised quote.

---

### 3. `estimate-renovation-cost` (Priority: P1)

**Purpose:** Room-by-room renovation cost estimator. Breaks down by trade (builder, plumber, electrician, tiler) and identifies when Prime Electrical cross-sell applies.

**Inputs:**
```typescript
{
  rooms: Array<{
    type: 'kitchen' | 'bathroom' | 'laundry' | 'bedroom' | 'living' | 'other'
    size_m2?: number
    finish_level: 'budget' | 'mid_range' | 'premium' | 'luxury'
    scope: string[]   // ['full_gut', 'cosmetic', 'layout_change', 'extension']
  }>
  property_type: 'residential' | 'commercial'
  property_age?: string     // 'pre_1980' | '1980_2000' | 'post_2000'
  contact_id: string
  site_id: string
  worker_id: string
  idempotency_key?: string
}
```

**Cross-sell trigger:** If rooms include kitchen or bathroom, and scope includes electrical work, automatically create a `cross_sell_events` record pointing to Prime Electrical.

---

### 4. `consent-estimator` (Priority: P1)

**Purpose:** Standalone function to determine if a project requires Auckland Council building consent and estimate the fees and timeline.

**Inputs:**
```typescript
{
  project_type: string      // 'deck' | 'extension' | 'new_build' | 'structural_reno' | 'fencing' | 'retaining'
  project_value_cents: number
  height_m?: number         // For decks and retaining walls
  area_m2?: number          // For extensions and new builds
  suburb?: string           // Auckland suburb for zoning considerations
}
```

**Outputs:**
```typescript
{
  consent_required: boolean
  consent_type: 'building_consent' | 'resource_consent' | 'both' | 'none'
  estimated_council_fee_cents: number
  estimated_processing_weeks: number
  notes: string
  disclaimer: string
}
```

**Pricing data (Auckland Council 2025-2026):**
- Projects < $20,000: ~$2,000–$4,000 consent fee
- Projects $20,000–$100,000: ~$4,000–$8,000 consent fee
- Projects > $100,000: ~$8,000–$15,000+ consent fee
- Resource consent: additional $3,000–$20,000+
- Processing time: 20 working days (simple) to 6+ months (complex/resource consent)

---

### 5. `bundle-analyzer-akf` (Priority: P2)

**Purpose:** Detect multi-service opportunities in a project description and calculate bundle pricing or cross-sell opportunities across Prime Group brands.

**Logic:**
- Renovation + new deck → Bundle discount (5%)
- Renovation mentions electrical → Cross-sell Prime Electrical
- Post-build/renovation completion → Cross-sell CleanJet (post-build clean)
- Fencing + landscaping together → Bundle discount (5%)

**Output:** Bundle suggestions with savings amounts and cross-sell event creation.

---

### 6. `project-timeline-estimator` (Priority: P2)

**Purpose:** Generate a project timeline with key milestones, including consent wait times.

**Inputs:** Service type, scope, consent required (boolean), start date preference.

**Output:** Week-by-week milestone timeline (consent lodgement → approval → materials → build → completion).

---

## Database Schema Required

AKF Construction uses the **shared Supabase project** (`tfdxlhkaziskkwwohtwd`). The `quotes` and `quote_line_items` tables created for Prime Electrical can be reused — differentiate by `site_id`.

### Additional Columns Needed on `quotes` Table

```sql
-- Add construction-specific columns to shared quotes table
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS consent_required BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_notes TEXT,
  ADD COLUMN IF NOT EXISTS project_timeline_weeks INTEGER,
  ADD COLUMN IF NOT EXISTS start_date_estimate DATE;
```

### No Separate Migration Required
If the shared `quotes` and `quote_line_items` tables are created first by Prime Electrical's plan, AKF only needs the `ALTER TABLE` additions above.

---

## Environment Variables

| Variable | Value | Required |
|----------|-------|---------|
| `OPENROUTER_API_KEY` | `sk-or-...` | Yes |
| `OPENROUTER_MODEL` | `anthropic/claude-3.5-sonnet` | Optional |
| `SUPABASE_URL` | `https://tfdxlhkaziskkwwohtwd.supabase.co` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Yes |
| `RESEND_API_KEY` | `re_...` | Yes (send) |
| `BUSINESS_TYPE` | `residential construction and renovation` | Yes |
| `BUSINESS_LOCATION` | `Auckland, New Zealand` | Yes |
| `CURRENCY` | `NZD` | Optional |
| `AKF_SITE_ID` | UUID of AKF Construction site record | Yes |

---

## Integration with Existing Infrastructure

### LeadCaptureForm Enhancement
After AI processing step, call `quote-generate-akf`:

```typescript
// After AI processing completes in LeadCaptureForm
const quoteResponse = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/quote-generate-akf`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      job_description: formData.message,
      service_type: detectedServiceType,
      site_id: AKF_SITE_ID,
      worker_id: DEFAULT_WORKER_ID,
      contact_id: createdContactId,
      lead_id: createdLeadId,
      idempotency_key: `lead-${createdLeadId}`,
    }),
  }
)
```

### Consent Flag Display
When quote response includes `consent_required: true`, display a callout in the UI:
> "This project may require Auckland Council building consent. AKF Construction handles the full consent process on your behalf."

### Cross-sell Triggers
- `estimate-renovation-cost` → always check for electrical scope → cross-sell to Prime Electrical
- `quote-generate-akf` completion → cross-sell to CleanJet for post-build clean
- `bundle-analyzer-akf` → create `cross_sell_events` records

---

## Implementation Order

```
Phase 1 — Schema (shared with Prime Electrical plan)
  └── quotes, quote_line_items, workers tables (if not already created)
  └── ALTER TABLE quotes ADD consent_required, consent_notes columns
  └── supabase db push

Phase 2 — Core Generate Function
  └── Scaffold quote-generate-akf Edge Function
  └── Include consent_required logic in LLM prompt
  └── Deploy: supabase functions deploy quote-generate-akf
  └── Smoke test with renovation description

Phase 3 — Specialist Calculators
  └── Scaffold estimate-deck-cost Edge Function
  └── Scaffold consent-estimator Edge Function
  └── Deploy both

Phase 4 — Send + Enrichment
  └── Scaffold quote-send-akf Edge Function (AKF branded email template)
  └── Scaffold bundle-analyzer-akf Edge Function
  └── Deploy both

Phase 5 — Frontend Integration
  └── Update LeadCaptureForm to call quote-generate-akf
  └── Add consent flag UI component
  └── Wire deck estimator to a dedicated "Deck Quote" form

Phase 6 — Timeline & Automation
  └── project-timeline-estimator Edge Function
  └── n8n webhook integration
```

---

## Success Criteria

- [ ] Customer submits renovation lead → AI ballpark estimate shown within 3 seconds
- [ ] Consent flag auto-detected and displayed when project type requires it
- [ ] Consent fee included as a separate line item in the quote
- [ ] Deck estimator returns precise m²-based quote when dimensions provided
- [ ] AKF cross-sell fires CleanJet event for post-build clean opportunity
- [ ] AKF renovation cross-sell fires Prime Electrical event when electrical scope detected
- [ ] Quote stored with `site_id = AKF_SITE_ID` to separate from Prime Electrical quotes
- [ ] Unqualified leads (expecting $2,000 job but describing $50,000 project) see realistic estimate before booking site visit

---

## Smoke Test Command

```bash
supabase functions invoke quote-generate-akf --body '{
  "job_description": "Looking to add a large deck to the back of my 4-bedroom home in Remuera. Want hardwood timber, around 8m x 5m, with glass balustrade and stairs down to the garden. Also considering a pergola over one end.",
  "service_type": "deck",
  "property_type": "residential",
  "property_location": "Remuera, Auckland",
  "site_id": "INSERT_AKF_SITE_UUID",
  "worker_id": "INSERT_WORKER_UUID",
  "contact_id": "INSERT_CONTACT_UUID",
  "idempotency_key": "test-akf-001"
}'
```

Expected: Itemised quote with hardwood deck m² cost, glass balustrade linear metre cost, stairs, pergola, and consent fee line item (deck will exceed 1.5m). Total around $65,000–$90,000.
