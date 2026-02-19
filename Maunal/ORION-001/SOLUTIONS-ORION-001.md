# Skills Review — Solutions & Fix Recommendations

- **Orion ID:** ORION-001
- **Date:** 2026-02-19
- **Reference:** FINDINGS-ORION-001.md

---

## Prioritized Fix Phases

### Phase A: Project Skills

#### Created (9 skills)

| Skill | Path |
|-------|------|
| `united-trades-cross-sell` | `.cursor/skills/united-trades-cross-sell/SKILL.md` |
| `make-com-webhooks-and-scenarios` | `.cursor/skills/make-com-webhooks-and-scenarios/SKILL.md` |
| `vapi-twilio-voice-pipeline` | `.cursor/skills/vapi-twilio-voice-pipeline/SKILL.md` |
| `tanstack-query-server-state` | `.cursor/skills/tanstack-query-server-state/SKILL.md` |
| `headless-ui-patterns` | `.cursor/skills/headless-ui-patterns/SKILL.md` |
| `salient-template-integration` | `.cursor/skills/salient-template-integration/SKILL.md` |
| `tailwind-v4-theme` | `.cursor/skills/tailwind-v4-theme/SKILL.md` |
| `supabase-auth-patterns` | `.cursor/skills/supabase-auth-patterns/SKILL.md` |
| `openai-gpt4o-patterns` | `.cursor/skills/openai-gpt4o-patterns/SKILL.md` |

---

### Phase B: .agent Curation

- Create a curated index (e.g. `f:\Prime\.cursor\skills\CURATED-AGENT-SKILLS.md`) listing `.agent` skills relevant to United Trades.
- Include: `nextjs-supabase-auth`, `nextjs-app-router-patterns`, `zapier-make-patterns`, `twilio-communications`, `voice-ai-development`, `tailwind-patterns`, `supabase-automation`, `postgres-best-practices`.
- Do not load all 864+ skills; reference the index when agents need stack-specific guidance.

---

### Phase C: Skill Pack (Optional)

- Bundle the 9 created project skills + curated `.agent` references into a "United Trades skill pack" for onboarding or `/setup` integration.
- Effort: Medium. Phase A (9 skills) complete; pack can proceed.

---

## Estimated Effort

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| A | 9 skills created | None |
| B | 1–2 hours | None |
| C | 2–3 hours | Phase A (9 skills) done |

---

## Lessons from Prior Work

- Project skills use frontmatter with `evidence` and `source_learnings` (see `dynamic-entity-selectors`).
- Cursor skills are simpler; project skills should align with `.cursor/skills` format for consistency.
- Anti-hallucination rules apply: verify `.agent` skill contents before recommending; do not assume Make.com or Supabase patterns without reading the actual SKILL.md.
