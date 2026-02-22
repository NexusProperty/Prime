# CleanJet — AI Quote Plan

> **Business:** CleanJet (residential home cleaning service)
> **Location:** Auckland, New Zealand
> **Industry:** Residential cleaning — regular, deep clean, end of tenancy, post-build
> **Supabase Project:** `tfdxlhkaziskkwwohtwd` (shared with Prime Electrical & AKF Construction)
> **Priority:** MEDIUM — lowest average job value ($79–$499+), highest booking volume, greatest need for dynamic custom quoting for non-standard jobs

---

## Business Context

CleanJet offers fixed pricing tiers but has a hard problem: **non-standard jobs resist fixed pricing**.

| Service | Current Pricing | Problem |
|---------|----------------|---------|
| Regular Clean | $79–$199 (room-based) | Works — formulaic |
| Deep Clean | $149–$349 (room-based) | Works — formulaic |
| End of Tenancy | $249+ | Highly variable — carpets, bond requirements, condition |
| Post-Build Clean | "Custom pricing" | No pricing at all — needs AI quote |

**The gap:** Post-build cleans (referred by AKF Construction) have zero automated pricing. The customer sees "Custom" and either calls (friction) or bounces. An AI quote for post-build cleans would directly convert AKF cross-sell leads.

**Secondary gap:** "End of Tenancy" varies wildly based on property condition. A 3-bed in move-out condition costs very differently from a neglected rental. AI can triage the complexity and price accordingly.

**Existing infrastructure:** `BookingWizard` handles room selection and add-ons for standard cleans but has no AI quoting capability.

---

## Current State Assessment

### What Exists
- `BookingWizard` — room selector, add-ons, date picker, contact capture
- Fixed pricing: 1–2 bed ($99 one-off / $79 weekly), 3–4 bed ($149/$119), 5+ bed ($199/$159)
- Add-ons: Extra Bathrooms (+$20), Oven Clean (+$30), Windows (+$25)
- Subscription toggle: one-off vs weekly (20% discount)
- `AIUpsellCard` — referrer-based upsell messages (e.g. AKF Construction post-build cross-sell)
- `AIInteractiveLayer` — emergency keyword detection
- `ingest-cleanjet` Edge Function — lead capture to shared Supabase
- `LeadCaptureForm` — AI processing overlay (cosmetic)

### What's Missing
- Custom quote generation for post-build and complex end-of-tenancy jobs
- Service type recommendation engine (what does this customer actually need?)
- Dynamic extras suggestion (e.g. "3 cats detected → add pet hair removal")
- Scheduling-aware pricing (urgent/same-day premium)
- Quote storage (shared `quotes` table, filtered by CleanJet `site_id`)

---

## Recommended AI Functions

### 1. `generate-cleaning-quote` (Priority: P0)

**Purpose:** Generate a custom quote for non-standard cleaning jobs — primarily post-build cleans and complex end-of-tenancy situations that the BookingWizard's fixed pricing cannot handle.

**Supabase Edge Function:** `supabase/functions/generate-cleaning-quote/index.ts`

**Inputs:**
```typescript
{
  job_description: string         // Customer's description of the job
  service_type: string            // 'post_build' | 'end_of_tenancy' | 'deep_clean_custom' | 'commercial'
  property_type: string           // 'apartment' | 'house' | 'townhouse' | 'commercial'
  bedrooms?: number               // Number of bedrooms
  bathrooms?: number              // Number of bathrooms
  area_m2?: number                // Total floor area if known
  property_condition?: string     // 'good' | 'average' | 'poor' | 'post_renovation'
  extras: string[]                // ['carpet_steam', 'oven', 'windows', 'garage', 'pet_hair']
  urgency?: 'standard' | 'urgent' | 'same_day'
  subscription?: boolean          // Weekly repeat service
  site_id: string
  worker_id: string
  contact_id: string
  lead_id?: string
  idempotency_key?: string
  // Cross-sell context
  referred_by?: 'akf_construction' | 'prime_electrical' | 'direct'
}
```

**LLM System Prompt Template:**
```
You are a quoting assistant for CleanJet, a professional residential cleaning service in Auckland, New Zealand.

Pricing is in NZD cents (e.g. $149.00 = 14900). Cleaning rates reflect Auckland market (2025-2026).

Pricing benchmarks:
Regular clean (per bedroom): $45–$60
Deep clean (per bedroom): $65–$85
End of tenancy (base): $249 for 1-2 bed; +$80 per additional bedroom
Post-build clean: $150–$350 per bedroom depending on construction debris level
Carpet steam clean: $60–$120 per room
Oven deep clean: $65–$90
Window cleaning (internal/external): $15–$25 per window
Garage clean: $80–$150
Pet hair removal: +$30–$60 flat fee
Same-day/urgent surcharge: +25%

For post-build cleans, assess:
- Level of construction dust (light/medium/heavy)
- Whether paint splatters, adhesive residue, or silicone cleaning needed
- Number of tradespeople who worked on site (more trades = more mess)

For end of tenancy cleans, assess:
- Whether bond return is the goal (recommend photo report add-on)
- Carpet condition (recommend steam clean if any staining mentioned)
- Oven condition (include oven clean in all end of tenancy quotes by default)

Return ONLY valid JSON:
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

**Integration point:** Called when user selects "Post-Build Clean" or "Custom End of Tenancy" in BookingWizard, or from LeadCaptureForm when AKF Construction cross-sell triggers a CleanJet referral.

---

### 2. `suggest-service-type` (Priority: P1)

**Purpose:** Recommend the correct CleanJet service tier based on free-text customer description. Prevents under-quoting (customer says "deep clean" but describes end-of-tenancy scenario).

**Inputs:**
```typescript
{
  customer_description: string
  property_bedrooms?: number
  moving_out?: boolean
  post_renovation?: boolean
}
```

**Outputs:**
```typescript
{
  recommended_service: 'regular' | 'deep_clean' | 'end_of_tenancy' | 'post_build'
  confidence: 'high' | 'medium' | 'low'
  reasoning: string    // 1-2 sentences explaining the recommendation
  price_range: {
    min_cents: number
    max_cents: number
  }
}
```

**Use case:** Customer types "Need a really thorough clean — we're moving out next Friday and want to get our bond back." System detects end-of-tenancy intent and recommends the correct service before they select "Regular Clean" by mistake.

**Integration point:** Live query during BookingWizard step 1 (service type selection). Display recommendation as a subtle AI suggestion card below the service options.

---

### 3. `calculate-post-build-price` (Priority: P0)

**Purpose:** Dedicated pricing function for AKF Construction cross-sell leads. Calculates post-renovation cleaning cost based on construction scope.

**This is the highest-priority function because:**
- AKF Construction sends cross-sell leads to CleanJet after every build
- Current pricing is "Custom" (no price shown) — leads bounce
- Post-build cleans are high-value jobs ($400–$2,500+)

**Inputs:**
```typescript
{
  renovation_type: string[]    // ['full_house', 'kitchen', 'bathroom', 'extension', 'deck', 'paint_job']
  property_bedrooms: number
  area_m2?: number
  construction_dust_level: 'light' | 'medium' | 'heavy'  // light = paint only, heavy = structural work
  extras_needed: string[]      // ['windows', 'carpet_steam', 'oven', 'garage']
  contact_id: string
  site_id: string
  worker_id: string
  referred_by_akf_lead_id?: string   // Link back to the AKF construction lead
  idempotency_key?: string
}
```

**Pricing formula:**
- Base rate: $180/bedroom for light dust, $250/bedroom for medium, $350/bedroom for heavy
- Minimum: $350 (any post-build job)
- Window cleaning: $20/window (post-build often has paint overspray)
- Carpet steam (post-build): $90/room (higher due to construction dust)
- Garage/workshop: +$120

**Output:** Same standard `{ quote_id, status, total_amount, currency }` format.

---

### 4. `recommend-extras` (Priority: P1)

**Purpose:** AI-driven add-on recommendations based on property size, type, pets, and service history.

**Inputs:**
```typescript
{
  service_type: string
  bedrooms: number
  has_pets?: boolean
  has_oven?: boolean           // Always true, but ask explicitly
  has_dishwasher?: boolean
  window_count?: number
  customer_description?: string  // Free text for additional context
}
```

**Outputs:**
```typescript
{
  recommended_extras: Array<{
    name: string
    description: string
    price_cents: number
    priority: 'essential' | 'recommended' | 'optional'
    reason: string    // Why this extra is being recommended
  }>
}
```

**Example outputs:**
- Has pets → "Pet Hair Removal Treatment (+$45) — ensures no fur left on furniture or carpets"
- End of tenancy → "Oven Deep Clean (+$65) — required for most bond return inspections"
- Post-build → "Internal Window Clean (+$15/window) — construction dust leaves residue on all glass"

---

### 5. `estimate-cleaning-time` (Priority: P2)

**Purpose:** Calculate estimated duration for a job. Critical for scheduling — CleanJet must allocate cleaner time accurately.

**Inputs:**
```typescript
{
  service_type: string
  bedrooms: number
  bathrooms: number
  extras: string[]
  property_condition?: string
}
```

**Output:**
```typescript
{
  estimated_hours: number
  cleaners_required: number      // 1 for standard, 2 for large/post-build
  team_hours: number             // estimated_hours × cleaners_required
  scheduling_notes: string
}
```

---

### 6. `cross-sell-to-cleanjet` (Priority: P1)

**Purpose:** Webhook receiver — called by AKF Construction `bundle-analyzer-akf` when a construction project nears completion. Automatically generates a post-build clean quote and emails the customer.

**Trigger:** AKF Construction fires this when:
- A job enters "near completion" status in job management
- A `cross_sell_events` record is created with `target_brand = 'cleanjet'`

**What it does:**
1. Fetches the AKF job details from `cross_sell_events` and `leads`
2. Calls `calculate-post-build-price` with estimated construction scope
3. Generates draft quote
4. Sends proactive email to customer: "Your AKF Construction project is nearly done — here's a CleanJet post-build clean quote ready for you."
5. Updates `cross_sell_events.status` to `'accepted'` or logs the outreach

---

## Database Schema Required

CleanJet uses the **shared Supabase project** (`tfdxlhkaziskkwwohtwd`). The `quotes` and `quote_line_items` tables from the Prime Electrical plan are reused — all CleanJet quotes use CleanJet's `site_id`.

### Additional Columns Needed on `quotes` Table

```sql
-- Add cleaning-specific columns to shared quotes table
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS service_duration_hours NUMERIC(4,1),
  ADD COLUMN IF NOT EXISTS cleaners_required SMALLINT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS subscription_interval TEXT
    CHECK (subscription_interval IN ('weekly', 'fortnightly', 'monthly', NULL));
```

### No Separate Migration Required
If the base tables are created by Prime Electrical's schema plan, CleanJet only needs the `ALTER TABLE` additions above plus these CleanJet-specific extras.

---

## Environment Variables

| Variable | Value | Required |
|----------|-------|---------|
| `OPENROUTER_API_KEY` | `sk-or-...` | Yes |
| `OPENROUTER_MODEL` | `anthropic/claude-3.5-sonnet` | Optional |
| `SUPABASE_URL` | `https://tfdxlhkaziskkwwohtwd.supabase.co` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Yes |
| `RESEND_API_KEY` | `re_...` | Yes (send) |
| `BUSINESS_TYPE` | `residential cleaning` | Yes |
| `BUSINESS_LOCATION` | `Auckland, New Zealand` | Yes |
| `CURRENCY` | `NZD` | Optional |
| `CLEANJET_SITE_ID` | UUID of CleanJet site record | Yes |

---

## Integration with Existing Infrastructure

### BookingWizard Enhancement
Add a "Custom Quote" path to `BookingWizard` for post-build and complex end-of-tenancy:

```
Step 1: Choose service type
  → Regular / Deep Clean → existing wizard flow (no change)
  → End of Tenancy → add: "Describe the property condition" text area → call suggest-service-type
  → Post-Build Clean → NEW: property details form → call calculate-post-build-price
  → Other / Not Sure → call suggest-service-type first, then route

Step 2 (custom path): Property details form
Step 3 (custom path): AI quote generated and displayed
Step 4: Date selection + contact capture (existing)
```

### AIUpsellCard Enhancement
When `referred_by === 'akf_construction'`, the existing `AIUpsellCard` already shows a message. Enhance it to also display the auto-generated post-build clean quote amount:

```tsx
// Current: generic "AKF Construction bundle deal" message
// Enhanced: "Your post-build clean is estimated at $420 — book now and save $40"
```

### Cross-sell Receiver Integration
Add `/api/cross-sell/cleanjet` Next.js API route that receives the AKF webhook and triggers `cross-sell-to-cleanjet` Edge Function.

---

## Implementation Order

```
Phase 1 — Schema (shared with Prime Electrical/AKF)
  └── Ensure quotes, quote_line_items, workers tables exist
  └── ALTER TABLE quotes ADD service_duration_hours, cleaners_required, subscription_interval
  └── supabase db push

Phase 2 — Post-Build Calculator (highest value, clearest spec)
  └── Scaffold calculate-post-build-price Edge Function
  └── Deploy: supabase functions deploy calculate-post-build-price
  └── Smoke test with AKF kitchen renovation referral

Phase 3 — Core Custom Quote Function
  └── Scaffold generate-cleaning-quote Edge Function
  └── Deploy: supabase functions deploy generate-cleaning-quote
  └── Smoke test with end-of-tenancy description

Phase 4 — Service Recommender
  └── Scaffold suggest-service-type Edge Function
  └── Deploy and wire to BookingWizard step 1

Phase 5 — Extras Recommender
  └── Scaffold recommend-extras Edge Function
  └── Wire to BookingWizard add-ons step

Phase 6 — Cross-sell Receiver
  └── Scaffold cross-sell-to-cleanjet Edge Function
  └── Add /api/cross-sell/cleanjet Next.js route
  └── Wire to AKF bundle-analyzer-akf output webhook

Phase 7 — Scheduling Aid
  └── estimate-cleaning-time Edge Function
  └── Expose to admin/scheduling view
```

---

## Success Criteria

- [ ] "Post-Build Clean" service in BookingWizard shows AI-generated price (not "Custom")
- [ ] AKF Construction cross-sell leads automatically receive a CleanJet post-build quote by email
- [ ] End-of-tenancy quote accounts for property condition (good vs neglected)
- [ ] Service type recommender prevents mis-categorised bookings (e.g. customer books "Regular" but needs "End of Tenancy")
- [ ] Extras recommender increases average booking value by suggesting relevant add-ons
- [ ] All CleanJet quotes stored with `site_id = CLEANJET_SITE_ID`
- [ ] Quote duration estimate enables accurate cleaner scheduling

---

## Smoke Test Commands

```bash
# Post-build clean quote (AKF cross-sell scenario)
supabase functions invoke calculate-post-build-price --body '{
  "renovation_type": ["kitchen", "bathroom"],
  "property_bedrooms": 3,
  "construction_dust_level": "heavy",
  "extras_needed": ["windows", "carpet_steam", "oven"],
  "contact_id": "INSERT_CONTACT_UUID",
  "site_id": "INSERT_CLEANJET_SITE_UUID",
  "worker_id": "INSERT_WORKER_UUID",
  "idempotency_key": "test-cleanjet-postbuild-001"
}'

# End of tenancy custom quote
supabase functions invoke generate-cleaning-quote --body '{
  "job_description": "3 bedroom house in Mt Eden, moving out in 2 weeks, carpet has some staining in living room, oven needs cleaning, want bond back guaranteed. Have 2 cats.",
  "service_type": "end_of_tenancy",
  "property_type": "house",
  "bedrooms": 3,
  "bathrooms": 1,
  "property_condition": "average",
  "extras": ["carpet_steam", "oven", "pet_hair"],
  "urgency": "standard",
  "contact_id": "INSERT_CONTACT_UUID",
  "site_id": "INSERT_CLEANJET_SITE_UUID",
  "worker_id": "INSERT_WORKER_UUID",
  "idempotency_key": "test-cleanjet-eot-001"
}'
```

Expected (end of tenancy, 3-bed with pets + extras): Total around $550–$700.
