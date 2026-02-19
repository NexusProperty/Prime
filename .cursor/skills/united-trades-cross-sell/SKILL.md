---
name: united-trades-cross-sell
description: Lead → cross-sell evaluation rules; capture flags/events; handoff between Prime/AKF/CleanJet
when_to_use: |
  Use when implementing lead capture, cross-sell logic, or handoff between United Trades brands.
  Trigger phrases: "cross-sell", "lead handoff", "Prime AKF CleanJet", "opportunity flag", "brand routing"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  session_count: 1
  validation: United Trades ecosystem cross-sell dependency (see .cursorrules)
source_learnings:
  - "United Trades Sites Context"
---

# United Trades Cross-Sell

## Overview

United Trades is a hub-and-spoke ecosystem: Prime Electrical, AKF Construction, and CleanJet. Leads from one brand may qualify for services from another. This skill defines evaluation rules, capture flags, and handoff patterns.

## Prerequisites

- Read `.cursorrules` for Sites Context
- Verify Supabase schema exists before assuming tables (anti-hallucination rule)
- Do NOT assume `leads`, `cross_sell_flags`, or handoff tables exist — read schema first

## Cross-Sell Rules (Source of Truth)

| Source Lead | Cross-Sell Opportunity | Condition |
|-------------|------------------------|-----------|
| Prime Electrical | AKF Construction | Wall/ceiling work mentioned |
| Prime Electrical | CleanJet | Post-install dust cleanup mentioned |
| AKF Construction | CleanJet | Post-build clean needed |
| CleanJet | Prime Electrical | Electrical inspection mentioned |

## Steps

### Step 1: Verify Schema
**Action:** Read Supabase schema or migration files before adding cross-sell logic.
**Success Criteria:** Confirm tables/columns exist for leads, flags, handoffs.
**If schema missing:** Propose schema; do not invent table names.

### Step 2: Capture Flags at Lead Creation
**Action:** When a lead is created, evaluate cross-sell rules and store flags.
**Success Criteria:** Boolean or enum flags (e.g., `akf_opportunity`, `cleanjet_opportunity`) persisted.
**Example fields (verify against schema):**
```
lead_id, source_brand, akf_opportunity, cleanjet_opportunity, prime_opportunity, evaluated_at
```

### Step 3: Evaluation Logic
**Action:** Implement evaluation as server-side logic or AI-assisted (OpenAI GPT-4o).
**Success Criteria:** Rules applied consistently; no hardcoded strings without verification.
**Verification:** Read `memory-bank/techContext.md` for OpenAI usage — do not assume API shape.

### Step 4: Handoff Flow
**Action:** When handoff occurs, record event and route to target brand.
**Success Criteria:** Audit trail; target brand notified (Make.com webhook or direct DB).
**Verification:** Do NOT assume Make.com webhook URL — read `.env.local` or config.

### Step 5: UI Surface
**Action:** Show cross-sell opportunities in lead detail or dashboard.
**Success Criteria:** Flags visible; handoff action available when opportunity exists.

## Verification Checklist

- [ ] Schema read before referencing tables
- [ ] Cross-sell rules match .cursorrules Sites Context
- [ ] No invented table/column names
- [ ] Webhook URLs from env, not hardcoded
- [ ] Handoff events logged for audit

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Assume `leads.cross_sell` exists | Read schema, use verified columns |
| Hardcode Make.com URL | Use `process.env.MAKE_WEBHOOK_URL` |
| Invent new cross-sell rule | Use rules from .cursorrules |

## Related

- `.cursorrules` — Sites Context
- `memory-bank/techContext.md` — APIs & Services
- `.cursor/rules/anti-hallucination.mdc` — verification protocol
