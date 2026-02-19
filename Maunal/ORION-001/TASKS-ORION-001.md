# Skills Review — Task List

- **Orion ID:** ORION-001
- **Date:** 2026-02-19

---

## Task ID | Description | Priority | Effort | Dependencies | Status

| Task ID | Description | Priority | Effort | Dependencies | Status |
|---------|-------------|----------|--------|--------------|--------|
| T-001 | Create project skill: `tailwind-v4-theme` | High | 2–3h | — | Done |
| T-002 | Create project skill: `supabase-auth-patterns` | High | 2–3h | — | Done |
| T-003 | Create project skill: `make-com-webhooks-and-scenarios` | High | 2–3h | — | Done |
| T-004 | Create project skill: `united-trades-cross-sell` | Medium | 2–3h | — | Done |
| T-005 | Create project skill: `openai-gpt4o-patterns` | Medium | 2–3h | — | Done |
| T-006 | Create project skill: `vapi-twilio-voice-pipeline` | Medium | 2–3h | — | Done |
| T-009 | Create project skill: `tanstack-query-server-state` | Medium | 2–3h | — | Done |
| T-010 | Create project skill: `headless-ui-patterns` | Medium | 2–3h | — | Done |
| T-011 | Create project skill: `salient-template-integration` | Medium | 2–3h | — | Done |
| T-007 | Create curated index: `CURATED-AGENT-SKILLS.md` for `.agent` skills | Medium | 1–2h | — | Pending |
| T-008 | (Optional) Create United Trades skill pack | Low | 2–3h | T-001..T-011 | Pending |

---

## Acceptance Criteria

- **T-001..T-006, T-009..T-011:** Each skill has `SKILL.md` with `name`, `description`, `when_to_use`, and content aligned to United Trades stack.
- **T-007:** Index lists `.agent` skills with paths and brief descriptions; referenced by project docs or rules.
- **T-008:** Skill pack bundles project skills + index; usable by `/setup` or onboarding.

---

## Dependencies Between Tasks

- T-001..T-006, T-009..T-011: Independent; can be parallelized.
- T-007: Independent.
- T-008: Depends on T-001..T-006, T-009..T-011 for meaningful pack.
