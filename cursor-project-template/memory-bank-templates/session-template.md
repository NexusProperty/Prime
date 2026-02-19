# Session Memory Template

> Standard template for capturing session summaries.
> Use this template when completing significant work sessions.
> Copy and fill out, then append to `activeContext.md` or archive.

---

## Session Summary Template

Copy this template and fill in the values:

```
## Session: [YYYY-MM-DD] — [Brief Title]

### Overview
| Field | Value |
|-------|-------|
| **Session Date** | YYYY-MM-DD |
| **Task ID** | [Reference to task, e.g., CC-PHASE2] |
| **Duration** | [Approximate time spent] |
| **Status** | [Complete / Partial / Blocked] |

### Changes Made
| File | Change Type | Summary |
|------|-------------|---------|
| path/to/file | created/modified/deleted | Brief description |

### Decisions
| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| What was decided | Why this choice | What was not chosen |

### Learnings
- [Pattern or insight discovered]
- [Preference confirmed]
- [Mistake to avoid in future]

### Open Questions
- [ ] Unresolved item 1
- [ ] Unresolved item 2

### Next Actions
- [ ] Follow-up task 1
- [ ] Follow-up task 2
```

---

## When to Use

Use this template:
1. **After task completion** — Summarize the work before running `/reflect`
2. **At session boundaries** — When ending a long development session
3. **During context compaction** — To structure the compacted summary
4. **Before handoff** — When another developer or agent will continue the work

---

## Where to Store

Completed session summaries should be:
1. **Appended to `activeContext.md`** — For ongoing context
2. **Included in reflection docs** — `memory-bank/reflection/reflection-[task_id].md`
3. **Archived with task** — `memory-bank/archive/[task_id]/`

---

## Quality Standards

Follow the Update Quality Standards from `memory-bank-paths.mdc`:
- Every line carries information (no filler)
- Use tables for structured data
- Use status prefixes: `[DONE]`, `[BLOCKED]`, `[ACTIVE]`, `[PENDING]`
- Read before update; reconcile contradictions

---

## Cross-References

- **Quality Standards:** `cursor-memory-bank/.cursor/rules/isolation_rules/Core/memory-bank-paths.mdc`
- **Compaction Protocol:** `.cursor/rules/context-compaction.mdc`
- **Learnings File:** `memory-bank/learnings.md`

---

*This template was created as part of CC-PHASE2 (Claude Code Integration Phase 2) on 2026-02-12.*
