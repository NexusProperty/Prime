---
name: make-com-webhooks-and-scenarios
description: Designing Make scenarios, webhook verification, idempotency, retries, logging
when_to_use: |
  Use when integrating Make.com webhooks, designing automation scenarios, or debugging webhook flows.
  Trigger phrases: "Make.com", "webhook scenario", "Make scenario", "webhook idempotency", "Make automation"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  session_count: 1
  validation: United Trades automation stack (techContext.md)
source_learnings:
  - "Make.com Integration"
---

# Make.com Webhooks and Scenarios

## Overview

Make.com receives webhooks from Next.js sites (form submissions, lead events) and routes to Supabase, email, or other services. This skill covers scenario design, webhook security, idempotency, and retries.

## Prerequisites

- Do NOT assume Make.com webhook URL exists — read `.env.local` or config
- Verify webhook endpoint before referencing
- Understand payload shape from the sending application

## Steps

### Step 1: Verify Webhook URL
**Action:** Read `.env.local` or equivalent for `MAKE_WEBHOOK_URL`.
**Success Criteria:** URL confirmed or explicitly noted as missing.
**If missing:** Tell user; propose adding to env. Do not invent URL.

### Step 2: Design Scenario Structure
**Action:** Map flow: Webhook → Parse → Router → Actions (DB, email, etc.).
**Success Criteria:** Clear module sequence; error handling on each step.
**Best practice:** Use Router for branching; separate scenarios for different event types.

### Step 3: Webhook Verification
**Action:** Validate incoming requests (optional: signature, secret header).
**Success Criteria:** Unauthorized requests rejected.
**Verification:** Check if Make.com scenario supports custom headers or secret — read Make docs or existing scenario.

### Step 4: Idempotency
**Action:** Use unique `idempotency_key` or `request_id` to avoid duplicate processing.
**Success Criteria:** Same payload sent twice → processed once.
**Example:** Store `(idempotency_key, processed_at)` in DB or use Make's built-in deduplication if available.

### Step 5: Retries and Logging
**Action:** Configure retry on failure; log errors to a table or external service.
**Success Criteria:** Failed runs retried; errors traceable.
**Make.com:** Use "Ignore" vs "Commit" for error handling; add Error Handler route.

## Verification Checklist

- [ ] Webhook URL from env, not hardcoded
- [ ] Payload shape documented or read from sender
- [ ] Idempotency strategy defined
- [ ] Retry/error handling configured
- [ ] No assumed Make.com modules — verify in scenario

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Hardcode webhook URL | Use env variable |
| Assume payload shape | Read form/API that sends it |
| Skip idempotency for DB writes | Use request_id or similar |
| Assume Make scenario exists | Verify or document as planned |

## Related

- `memory-bank/techContext.md` — Make.com status
- `.cursorrules` — Anti-hallucination (never assume webhook URL)
- `AGENTS.md` — Verification Layer
