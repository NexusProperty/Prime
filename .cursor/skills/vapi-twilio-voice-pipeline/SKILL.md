---
name: vapi-twilio-voice-pipeline
description: Vapi agent + Twilio integration checklist, webhook security, call flows, fallback SMS
when_to_use: |
  Use when configuring Vapi.ai voice agents, Twilio telephony, or voice/SMS pipelines.
  Trigger phrases: "Vapi", "Twilio", "voice AI", "phone number", "call flow", "SMS fallback"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  session_count: 1
  validation: United Trades voice AI stack (techContext.md)
source_learnings:
  - "Vapi + Twilio Integration"
---

# Vapi + Twilio Voice Pipeline

## Overview

United Trades uses Vapi.ai for voice AI receptionists and Twilio for telephony (3 phone numbers). This skill provides an integration checklist, webhook security, call flows, and fallback SMS patterns.

## Prerequisites

- Do NOT assume Vapi/Twilio accounts, numbers, or webhooks exist
- Read `memory-bank/techContext.md` for current status (Vapi TBC, Twilio numbers TBC)
- Verify env vars before referencing: `VAPI_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`

## Steps

### Step 1: Verify Environment
**Action:** Read `.env.local` for Vapi and Twilio keys.
**Success Criteria:** Keys confirmed or explicitly noted as missing.
**If missing:** Tell user; do not invent keys or webhook URLs.

### Step 2: Vapi Agent Configuration
**Action:** Configure Vapi agent (prompt, model, voice) for each brand if needed.
**Success Criteria:** Agent responds correctly; brand-specific prompts verified.
**Verification:** Do not assume agent IDs — read Vapi dashboard or config.

### Step 3: Twilio Number Setup
**Action:** Confirm Twilio numbers exist and are assigned to Vapi.
**Success Criteria:** Incoming calls route to Vapi; outbound if needed.
**Verification:** Numbers TBC per techContext — do not assume count or assignment.

### Step 4: Webhook Security
**Action:** Validate webhook requests (signature, secret) from Vapi/Twilio.
**Success Criteria:** Only legitimate requests processed.
**Best practice:** Use Vapi/Twilio signature verification; never trust raw payload without validation.

### Step 5: Call Flow and Fallback SMS
**Action:** Define flow: Incoming call → Vapi → (success | fallback).
**Success Criteria:** Fallback to SMS or human when voice fails.
**Example:** Vapi timeout or error → trigger Twilio SMS to lead with callback option.

## Verification Checklist

- [ ] Env vars read before use
- [ ] No assumed phone numbers or agent IDs
- [ ] Webhook signatures validated
- [ ] Fallback path defined
- [ ] Lead/call data schema verified if storing in Supabase

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Assume 3 Twilio numbers exist | Verify or note TBC |
| Skip webhook validation | Implement signature check |
| Hardcode agent IDs | Read from config/env |
| Assume call schema | Verify Supabase table if storing |

## Related

- `memory-bank/techContext.md` — Vapi, Twilio status
- `.cursorrules` — Anti-hallucination
- `united-trades-cross-sell` — lead capture from calls
