# AI Quotes — Prime Group

This folder contains the AI quoting plans for all three Prime Group websites. All three brands share the same Supabase project (`tfdxlhkaziskkwwohtwd`) and can share the same `quotes`, `quote_line_items`, and `workers` database tables — differentiated by `site_id`.

---

## Plans

| File | Brand | Priority | Status |
|------|-------|---------|--------|
| [`prime-electrical-plan.md`](./prime-electrical-plan.md) | Prime Electrical | HIGH | Ready to implement |
| [`akf-construction-plan.md`](./akf-construction-plan.md) | AKF Construction | HIGH | Ready to implement |
| [`cleanjet-plan.md`](./cleanjet-plan.md) | CleanJet | MEDIUM | Ready to implement |

---

## Architecture Overview

All three brands share a single Supabase backend. The quoting system is designed to be additive — one schema migration creates all tables, then each brand deploys its own Edge Functions.

```
Shared Supabase Project: tfdxlhkaziskkwwohtwd
│
├── Tables (shared, filtered by site_id)
│   ├── workers
│   ├── quotes
│   └── quote_line_items
│
├── Edge Functions (brand-specific)
│   ├── quote-generate-electrical   ← Prime Electrical
│   ├── quote-send-electrical       ← Prime Electrical
│   ├── quote-enrichment            ← Prime Electrical
│   ├── quote-generate-akf          ← AKF Construction
│   ├── estimate-deck-cost          ← AKF Construction
│   ├── consent-estimator           ← AKF Construction
│   ├── bundle-analyzer-akf         ← AKF Construction (cross-sell)
│   ├── generate-cleaning-quote     ← CleanJet
│   ├── calculate-post-build-price  ← CleanJet (AKF cross-sell receiver)
│   ├── suggest-service-type        ← CleanJet
│   └── recommend-extras            ← CleanJet
│
└── Cross-sell bridge
    └── cross_sell_events table links all three brands
```

---

## Cross-Brand Flow

The three brands actively cross-sell to each other. The quoting system must honour these flows:

```
AKF Construction job nears completion
  └── bundle-analyzer-akf detects post-build clean opportunity
  └── Creates cross_sell_events record (target: cleanjet)
  └── Calls calculate-post-build-price
  └── CleanJet sends proactive quote email to customer

Prime Electrical renovation job
  └── quote-enrichment detects AKF cross-sell keywords in job description
  └── Creates cross_sell_events record (target: akf)
  └── AKF Construction follow-up team contacts customer

CleanJet end-of-tenancy job
  └── Property requires rewiring/electrical check mentioned
  └── recommend-extras flags Prime Electrical referral opportunity
  └── Creates cross_sell_events record (target: prime)
```

---

## Implementation Sequence

Run these commands in order:

### Step 1 — Schema (once, shared)
```bash
/ai-quote schema
# Creates: workers, quotes, quote_line_items tables
# Plus: ALTER TABLE additions for construction and cleaning columns
supabase db push
```

### Step 2 — Prime Electrical (P0)
```bash
/ai-quote generate  # → Deploys quote-generate-electrical
/ai-quote send      # → Deploys quote-send-electrical
supabase functions deploy quote-generate-electrical
supabase functions deploy quote-send-electrical
```

### Step 3 — AKF Construction (P0)
```bash
# Deploy AKF quote functions
supabase functions deploy quote-generate-akf
supabase functions deploy estimate-deck-cost
supabase functions deploy consent-estimator
```

### Step 4 — CleanJet (P1)
```bash
# Deploy CleanJet quote functions
supabase functions deploy calculate-post-build-price
supabase functions deploy generate-cleaning-quote
supabase functions deploy suggest-service-type
```

### Step 5 — Cross-sell bridge (P1)
```bash
supabase functions deploy bundle-analyzer-akf
supabase functions deploy cross-sell-to-cleanjet
supabase functions deploy quote-enrichment
```

---

## Shared Environment Variables

Set once on the shared Supabase project — all Edge Functions inherit:

```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-...
supabase secrets set OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set CURRENCY=NZD
```

Brand-specific secrets:
```bash
# Prime Electrical
supabase secrets set PRIME_BUSINESS_TYPE="electrical contracting"
supabase secrets set PRIME_BUSINESS_LOCATION="Auckland, New Zealand"
supabase secrets set PRIME_SITE_ID="<uuid>"

# AKF Construction
supabase secrets set AKF_BUSINESS_TYPE="residential construction and renovation"
supabase secrets set AKF_BUSINESS_LOCATION="Auckland, New Zealand"
supabase secrets set AKF_SITE_ID="<uuid>"

# CleanJet
supabase secrets set CLEANJET_BUSINESS_TYPE="residential cleaning"
supabase secrets set CLEANJET_BUSINESS_LOCATION="Auckland, New Zealand"
supabase secrets set CLEANJET_SITE_ID="<uuid>"
```

---

## AI Functions Summary

### Prime Electrical (5 functions)

| Function | Priority | Purpose |
|----------|---------|---------|
| `quote-generate-electrical` | P0 | AI quote from electrical job description |
| `quote-send-electrical` | P1 | Email formatted quote to customer |
| `quote-enrichment` | P1 | Upsell + cross-sell suggestions |
| `quote-review` | P2 | AI quality review before sending |
| `quote-followup` | P2 | Automated follow-up for unsent quotes |

### AKF Construction (6 functions)

| Function | Priority | Purpose |
|----------|---------|---------|
| `quote-generate-akf` | P0 | AI quote from construction job description |
| `estimate-deck-cost` | P1 | Precise m²-based deck calculator |
| `consent-estimator` | P1 | Auckland Council consent fee estimator |
| `bundle-analyzer-akf` | P1 | Cross-sell trigger (Prime Electrical + CleanJet) |
| `quote-send-akf` | P1 | Email formatted quote with consent notices |
| `project-timeline-estimator` | P2 | Week-by-week project timeline |

### CleanJet (6 functions)

| Function | Priority | Purpose |
|----------|---------|---------|
| `calculate-post-build-price` | P0 | Post-renovation clean pricing (AKF cross-sell) |
| `generate-cleaning-quote` | P0 | Custom quote for non-standard jobs |
| `suggest-service-type` | P1 | Recommends correct service tier from description |
| `recommend-extras` | P1 | AI-driven add-on suggestions |
| `cross-sell-to-cleanjet` | P1 | Receives AKF cross-sell webhook, auto-sends quote |
| `estimate-cleaning-time` | P2 | Duration estimate for scheduling |

**Total: 17 AI functions across 3 brands**

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time from lead submission to quote in inbox | < 5 minutes (vs 24–48 hours currently) |
| Post-build clean conversion from AKF cross-sell | > 40% |
| BookingWizard custom quote completion rate | > 60% |
| Quote accuracy (within 20% of final invoice) | > 80% |
| Unqualified lead filter rate (AKF) | > 30% scope-managed before site visit |

---

## Related Documents

- [`ai-quote-command.md`](../.cursor/commands/ai-quote-command.md) — the `/ai-quote` command reference
- [`ai-quote-implementation-skill.md`](../.cursor/skills/ai-quote-implementation-skill.md) — Edge Function implementation skill
- [`ai-quoting-architecture-skill.md`](../.cursor/skills/ai-quoting-architecture-skill.md) — Architecture validation skill
