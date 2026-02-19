# Skills Review — Fix Plan

- **Orion ID:** ORION-001
- **Date:** 2026-02-19

---

## Phased Approach

### Gate 1: Project Skills (Phase A) — Complete

**Goal:** Add project skills to `f:\Prime\.cursor\skills\` for United Trades stack.

**Created (9 skills):**
1. `united-trades-cross-sell` — Prime ↔ AKF ↔ CleanJet cross-sell logic
2. `make-com-webhooks-and-scenarios` — Make.com webhooks, env, anti-hallucination
3. `vapi-twilio-voice-pipeline` — Vapi.ai + Twilio voice AI
4. `tanstack-query-server-state` — TanStack Query in Next.js App Router
5. `headless-ui-patterns` — Headless UI (Dialog, Menu, Popover)
6. `salient-template-integration` — Scaffold from salient-ts without modifying source
7. `tailwind-v4-theme` — Tailwind v4 `@theme {}`, no tailwind.config.js
8. `supabase-auth-patterns` — Supabase Auth, RLS, session
9. `openai-gpt4o-patterns` — OpenAI GPT-4o API patterns

**Success criteria:** Met — all 9 skills created; `npm run lint` and `npm run build` unaffected (skills are markdown).

---

### Gate 2: Curation (Phase B)

**Goal:** Curate `.agent/skills/skills` for United Trades relevance.

**Files to create:** `f:\Prime\.cursor\skills\CURATED-AGENT-SKILLS.md` (or equivalent in `memory-bank/` or `docs/`).

**Fix strategy:** List `.agent` skills with paths and one-line descriptions. Include: `nextjs-supabase-auth`, `nextjs-app-router-patterns`, `zapier-make-patterns`, `twilio-communications`, `voice-ai-development`, `tailwind-patterns`, `supabase-automation`, `postgres-best-practices`. Verify each SKILL.md exists before listing.

**Success criteria:** Index exists; agents can reference it for stack-specific guidance.

---

### Gate 3: Skill Pack (Phase C, Optional)

**Goal:** Bundle project skills + curated index for onboarding.

**Fix strategy:** Create a README or setup step that references the 9 project skills and the curated index. Integrate with `/setup` if applicable.

**Success criteria:** New contributors or agents can discover and use the skill pack.

---

## Rollback Strategy

- Skills are additive; removal = delete `f:\Prime\.cursor\skills\<name>/` folder.
- Curated index is standalone; removal = delete file.
- No code changes; no rollback of application logic.

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Gate 1 | Complete (9 skills created) |
| Gate 2 | 1–2h |
| Gate 3 | 2–3h |

Total: ~3–5h for curation and optional skill pack.
