---
name: openai-gpt4o-patterns
description: OpenAI GPT-4o API usage patterns, prompt structure for cross-sell classification, error handling, logging; do not assume env vars exist
when_to_use: |
  Use when integrating OpenAI GPT-4o for cross-sell logic, classification, or AI brain features.
  Trigger phrases: "OpenAI", "GPT-4o", "cross-sell classification", "AI brain", "OpenAI API"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  validation: memory-bank/techContext.md, united-trades-cross-sell
---

# OpenAI GPT-4o Patterns

## Overview

United Trades uses **OpenAI GPT-4o** as the AI brain for cross-sell classification. Use the `openai` npm package. **Do not assume `OPENAI_API_KEY` exists** — verify env before use.

## Prerequisites

- Read `.env.local` or env config — confirm `OPENAI_API_KEY` exists
- Read `package.json` — confirm `openai` package
- Read `united-trades-cross-sell` skill for cross-sell rules

## Verification Steps

### Before Using OpenAI
1. **Read** `.env.local` — confirm `OPENAI_API_KEY` is set
2. **Read** `package.json` — confirm `openai` dependency
3. **Never** hardcode API key or assume it exists

## Cross-Sell Classification Prompt Structure

When classifying leads for cross-sell opportunities, structure prompts with:
- **Input:** Lead description, source brand, service type
- **Output:** Structured JSON with boolean flags per brand (e.g., `akf_opportunity`, `cleanjet_opportunity`, `prime_opportunity`)
- **Rules:** Include cross-sell rules from `.cursorrules` Sites Context

Example prompt shape (verify against actual implementation):
```
Given lead: {description}
Source brand: Prime Electrical
Rules: AKF if wall/ceiling work; CleanJet if post-install dust.
Return JSON: { akf_opportunity: boolean, cleanjet_opportunity: boolean }
```

## Error Handling

- Wrap API calls in try/catch
- Handle rate limits (429), auth errors (401), and network failures
- Log errors without exposing API key or sensitive user data
- Return fallback (e.g., no cross-sell flags) on failure — do not block lead capture

## Logging

- Log request/response metadata (model, tokens, latency) for debugging
- Do NOT log full prompt content with PII
- Do NOT log API key or include it in error messages

## API Usage Pattern

```typescript
// Verify OPENAI_API_KEY exists before use
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}

import OpenAI from 'openai'
const openai = new OpenAI({ apiKey })
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: prompt }],
  response_format: { type: 'json_object' }, // for structured output
})
```

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Assume OPENAI_API_KEY exists | Read .env.local, check before use |
| Hardcode API key | Use process.env.OPENAI_API_KEY |
| Log full prompts with PII | Log metadata only |
| Block lead capture on API failure | Return fallback, log error |
| Invent cross-sell rules | Use rules from .cursorrules |

## Related

- `memory-bank/techContext.md` — OpenAI GPT-4o, env vars
- `united-trades-cross-sell` — cross-sell rules, evaluation logic
- `.cursorrules` — Anti-Hallucination Rules
