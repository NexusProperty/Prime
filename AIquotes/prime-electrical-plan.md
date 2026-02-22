# Prime Electrical — AI Quote Plan

> **Business:** Prime Electrical (The Prime Electrical Ltd)
> **Location:** Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013
> **Industry:** Licensed electrical contracting — residential & commercial
> **Supabase Project:** `tfdxlhkaziskkwwohtwd` (shared with AKF Construction & CleanJet)
> **Priority:** HIGH — most complex service catalogue, highest average job value ($150–$8,000+)

---

## Business Context

Prime Electrical offers three service tiers with dramatically different price points:

| Tier | Label | Starting Price | Typical Job Value |
|------|-------|---------------|------------------|
| 1 | Essential Electrical | From $150 | $150–$800 |
| 2 | Comfort Package | From $1,200 | $1,200–$4,500 |
| 3 | Solar & Smart Home | From $8,000 | $8,000–$30,000+ |

**Current quoting flow:** Customer fills lead form → AI processing overlay → Cross-sell detection → Manual follow-up within 24 hours of site assessment. No automated quote generation exists.

**Quote opportunity:** The 24-hour manual turnaround is a conversion bottleneck. Customers who get an instant ballpark are 3× more likely to commit to a site assessment.

---

## Current State Assessment

### What Exists
- `leads` table — captures service type, message, AI notes
- `customers` table — master customer data
- `cross_sell_events` table — cross-brand suggestions
- `LeadCaptureForm` — AI processing overlay (cosmetic only, no quote engine)
- `AIChatWidget` — voice-enabled, OpenRouter connected
- `/api/leads/enrich` — AI enrichment webhook (Make.com/n8n)
- `/api/voice/webhook` — Twilio voice integration
- Cross-sell detection in `src/lib/crossSell.ts`

### What's Missing
- `quotes` table — no quote storage
- `quote_line_items` table — no line item tracking
- `quote-generate` Edge Function — no AI quote engine
- `quote-send` Edge Function — no delivery mechanism
- Dynamic pricing logic — everything is static "From $X"
- Quote status tracking — no draft → sent → accepted flow

---

## Recommended AI Functions

### 1. `quote-generate-electrical` (Priority: P0)

**Purpose:** Generate a detailed, line-item quote from a customer's job description or lead form data.

**Supabase Edge Function:** `supabase/functions/quote-generate-electrical/index.ts`

**Inputs:**
```typescript
{
  job_description: string     // Customer's description of work needed
  service_type: string        // 'essential' | 'comfort' | 'solar_smart'
  property_type: string       // 'residential' | 'commercial' | 'industrial'
  property_size?: string      // '1-2 bed' | '3-4 bed' | '5+ bed' | 'small commercial' | 'large commercial'
  site_id: string             // UUID — FK to sites
  worker_id: string           // UUID — FK to workers (assigning electrician)
  contact_id: string          // UUID — FK to contacts
  lead_id?: string            // UUID — link back to originating lead
  idempotency_key?: string    // Prevent duplicate quotes from retried calls
}
```

**LLM System Prompt Template:**
```
You are a quoting assistant for Prime Electrical, a licensed electrical contractor in Auckland, New Zealand.
You specialize in residential and commercial electrical work including fault finding, switchboard upgrades,
heat pump installation, EV charger installation, solar systems (SEANZ-certified), and smart home automation.

Pricing is in NZD cents (e.g. $150.00 = 15000). Auckland labour rate: $120–$150/hour.
Break every distinct task into its own line item (labour + materials separate where applicable).

Service context:
- Essential jobs (fault finding, power points, lighting): $150–$800
- Heat pumps (Daikin/Panasonic/Mitsubishi): $1,200–$3,500 supply + install
- EV charger installation: $800–$1,800
- Solar systems: $8,000–$25,000 depending on size and battery storage
- Smart home automation (Control4/KNX/DALI): $3,000–$20,000+

Return ONLY valid JSON:
{
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "total_amount": number,
  "notes": "string or null",
  "valid_until": "YYYY-MM-DD or null"
}
```

**Outputs:**
```typescript
{
  data: {
    quote_id: string        // UUID of created quote
    status: 'draft'
    total_amount: number    // in cents
    currency: 'NZD'
  } | null
  error: string | null
}
```

**Integration Point:** Call from `LeadCaptureForm` after AI processing completes, before cross-sell cards appear. Display estimated range to customer immediately.

---

### 2. `quote-send-electrical` (Priority: P1)

**Purpose:** Deliver a formatted quote to the customer via email (Resend), update quote status to `sent`.

**Supabase Edge Function:** `supabase/functions/quote-send-electrical/index.ts`

**Inputs:**
```typescript
{
  quote_id: string   // UUID of the quote to send
  send_to?: string   // Override email (defaults to contact's email)
}
```

**Email template must include:**
- Prime Electrical branding (logo, brand colour #F97316)
- Line items table (description | qty | unit price | total)
- Total amount (in dollars, formatted as `$X,XXX.XX NZD`)
- Financing options callout: "Finance available from $0 upfront — GEM Visa, Q Mastercard, ANZ, Westpac"
- Valid until date
- CTA: "Accept this quote" → triggers acceptance webhook
- CTA: "Call us: 09-390-3620"
- Footer: Master Electricians NZ certified, SEANZ certified, 12-month workmanship guarantee

**Integration Point:** Called from admin dashboard or n8n workflow after quote review.

---

### 3. `quote-enrichment` (Priority: P1)

**Purpose:** Enhance a draft quote with AI-generated upsell suggestions, financing recommendations, and cross-sell opportunities (AKF Construction, CleanJet).

**Inputs:**
```typescript
{
  quote_id: string
  include_cross_sell?: boolean   // default true — check for AKF/CleanJet bundle opportunities
}
```

**Enrichment outputs:**
- `upsell_suggestions[]` — e.g. "Add solar-ready switchboard upgrade for $X extra"
- `financing_recommended` — boolean (true if quote > $1,200)
- `cross_sell_opportunities[]` — e.g. "Customer's message mentions renovation — flag to AKF Construction"
- `review_notes` — AI review of whether quote seems accurate for the described work

**Integration Point:** Called automatically after `quote-generate-electrical`. Results stored in `quotes.ai_notes` JSONB column.

---

### 4. `quote-review` (Priority: P2)

**Purpose:** AI quality review of a generated quote before it's sent. Checks for accuracy, completeness, and pricing sanity.

**Review criteria:**
- Are line items specific enough? (Flag vague items like "electrical work")
- Does `total_amount` equal sum of all `line_item.total` values?
- Are any obvious line items missing for the described work?
- Does pricing fall within expected Auckland market ranges?
- Is `valid_until` set (recommend 30 days from creation)?

**Output:** List of suggestions — no auto-modifications. Worker reviews and approves before sending.

---

### 5. `quote-followup` (Priority: P2)

**Purpose:** Automated follow-up for quotes not responded to within configurable days.

**Inputs:**
```typescript
{
  quote_id: string
  days_since_sent: number
  offer_discount?: boolean   // default false
}
```

**Output:** Personalised follow-up email via Resend. If `offer_discount: true`, adds a time-limited discount offer (configurable percentage).

**Integration Point:** Scheduled via n8n cron — runs daily, checks quotes with `status = 'sent'` and `updated_at < NOW() - INTERVAL 'X days'`.

---

## Database Schema Required

### New Tables

```sql
-- Workers (Prime Electrical employees/contractors who create quotes)
CREATE TABLE workers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID REFERENCES sites(id),
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT DEFAULT 'contractor'
                   CHECK (role IN ('admin', 'contractor', 'viewer')),
  is_active   BOOLEAN DEFAULT true,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Quotes
CREATE TABLE quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID REFERENCES sites(id),
  worker_id       UUID REFERENCES workers(id) NOT NULL,
  contact_id      UUID REFERENCES contacts(id),
  lead_id         UUID REFERENCES leads(id),
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','pending_review','sent','accepted','rejected','expired')),
  total_amount    INTEGER NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL DEFAULT 'NZD',
  ai_generated    BOOLEAN NOT NULL DEFAULT false,
  ai_model        TEXT,
  ai_notes        JSONB DEFAULT '{}',   -- enrichment results
  notes           TEXT,
  valid_until     DATE,
  idempotency_key TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE INDEX quotes_site_idx    ON quotes(site_id);
CREATE INDEX quotes_worker_idx  ON quotes(worker_id);
CREATE INDEX quotes_status_idx  ON quotes(status);
CREATE INDEX quotes_contact_idx ON quotes(contact_id);
CREATE INDEX quotes_lead_idx    ON quotes(lead_id);

-- Quote Line Items
CREATE TABLE quote_line_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price  INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX quote_line_items_quote_idx ON quote_line_items(quote_id);
```

### Migration Command
```bash
supabase db push
# or create migration file:
# supabase/migrations/[timestamp]_create_electrical_quotes.sql
```

---

## Environment Variables

| Variable | Value | Required |
|----------|-------|---------|
| `OPENROUTER_API_KEY` | `sk-or-...` | Yes |
| `OPENROUTER_MODEL` | `anthropic/claude-3.5-sonnet` | Optional |
| `SUPABASE_URL` | `https://tfdxlhkaziskkwwohtwd.supabase.co` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Yes |
| `RESEND_API_KEY` | `re_...` | Yes (send) |
| `BUSINESS_TYPE` | `electrical contracting` | Yes |
| `BUSINESS_LOCATION` | `Auckland, New Zealand` | Yes |
| `CURRENCY` | `NZD` | Optional |

Set via: `supabase secrets set KEY=value`

---

## Integration with Existing Infrastructure

### LeadCaptureForm Enhancement
After AI processing completes (step 3 of the overlay), add a call to `quote-generate-electrical`:

```typescript
// src/components/ai/LeadCaptureForm.tsx — after AI processing step
const quoteResponse = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/quote-generate-electrical`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      job_description: formData.message,
      service_type: detectedServiceType,
      property_type: 'residential',
      site_id: PRIME_ELECTRICAL_SITE_ID,
      worker_id: DEFAULT_WORKER_ID,
      contact_id: createdContactId,
      lead_id: createdLeadId,
      idempotency_key: `lead-${createdLeadId}`,
    }),
  }
)
```

### Cross-sell Bridge
`quote-enrichment` must fire the existing cross-sell event if renovation/construction/cleaning keywords are detected in the job description. Write to `cross_sell_events` table with `source_brand: 'prime'`.

### n8n Workflow Hooks
- `quote-generate-electrical` should POST to n8n webhook after DB insert
- `quote-send-electrical` should trigger CRM update in n8n
- `quote-followup` should be triggered by n8n cron schedule

---

## Implementation Order

```
Phase 1 — Schema (run /ai-quote schema)
  └── Create workers, quotes, quote_line_items tables
  └── supabase db push

Phase 2 — Core Generate Function (run /ai-quote generate)
  └── Scaffold quote-generate-electrical Edge Function
  └── Deploy: supabase functions deploy quote-generate-electrical
  └── Smoke test with sample electrical job description

Phase 3 — Send Function (run /ai-quote send)
  └── Scaffold quote-send-electrical Edge Function
  └── Configure Resend email template (Prime Electrical branding)
  └── Deploy: supabase functions deploy quote-send-electrical

Phase 4 — Enrichment (run /ai-quote generate with enrichment flag)
  └── Scaffold quote-enrichment Edge Function
  └── Deploy and wire to post-generate hook

Phase 5 — Frontend Integration
  └── Update LeadCaptureForm to call quote-generate-electrical
  └── Add quote display component (show estimated range to customer)
  └── Add "View quote" CTA in confirmation step

Phase 6 — Automation
  └── quote-review for admin dashboard
  └── quote-followup scheduled job in n8n
```

---

## Success Criteria

- [ ] Customer submits lead → instant ballpark quote generated within 3 seconds
- [ ] Quote stored in `quotes` table with line items in `quote_line_items`
- [ ] Worker can review and send quote from dashboard
- [ ] Customer receives formatted quote email within minutes (not 24 hours)
- [ ] Quote acceptance triggers job creation in job management system
- [ ] Cross-sell events created when job description mentions renovation/cleaning
- [ ] Idempotency prevents duplicate quotes from retried form submissions
- [ ] All AI-generated quotes flagged with `ai_generated: true` and `ai_model`

---

## Smoke Test Command

```bash
supabase functions invoke quote-generate-electrical --body '{
  "job_description": "Need switchboard upgrade and 4 new power points in kitchen. Also interested in EV charger installation for garage. Residential property in Ponsonby, Auckland.",
  "service_type": "comfort",
  "property_type": "residential",
  "property_size": "3-4 bed",
  "site_id": "INSERT_PRIME_ELECTRICAL_SITE_UUID",
  "worker_id": "INSERT_WORKER_UUID",
  "contact_id": "INSERT_CONTACT_UUID",
  "idempotency_key": "test-prime-001"
}'
```

Expected response:
```json
{
  "data": {
    "quote_id": "uuid-here",
    "status": "draft",
    "total_amount": 285000,
    "currency": "NZD"
  },
  "error": null
}
```
