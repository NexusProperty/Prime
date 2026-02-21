# Cursor Skills Directory

> **Source:** CC-018 (ORION-011 Claude Code Integration)
> **Design Document:** `memory-bank/creative/ORION-011/creative-ORION-011-skill-extraction.md`

This directory contains extracted skills — reusable patterns learned from successful task completions.

---

## How Skills Work

### Extraction Flow

1. **Pattern Detection** — During context compaction or reflection, recurring patterns are identified
2. **Evidence Accumulation** — Patterns are tracked in `memory-bank/learnings.md` with session counts
3. **Candidate Flagging** — When a pattern reaches 2+ sessions, it becomes a skill candidate
4. **Skill Extraction** — User runs `/skillify` to convert candidates into full skills
5. **Skill Usage** — Skills can be referenced in future sessions for consistent execution

### Evidence Threshold

Skills are only extracted after a pattern has been observed in **2 or more sessions**. This ensures:
- The pattern is genuinely recurring (not a one-off)
- The approach has been validated through repeated use
- Enough context exists to document the skill properly

---

## Skill Format

Each skill lives in its own directory: `.cursor/skills/[skill-name]/SKILL.md`

### Frontmatter

```yaml
---
name: skill-name
description: Brief description of what this skill does
when_to_use: |
  Use when the user asks to...
  Trigger phrases: "...", "..."
evidence:
  first_observed: YYYY-MM-DD
  last_confirmed: YYYY-MM-DD
  session_count: N
source_learnings:
  - "Pattern name from learnings.md"
---
```

### Structure

```markdown
# Skill Name

## Overview
[What this skill does and when to use it]

## Prerequisites
- [Required context, files, or state]

## Steps

### Step 1: [Action Name]
**Success Criteria:** [How to know this step succeeded]
**Artifacts:** [What this step produces for later steps]

### Step 2: [Action Name]
...

## Verification
- [ ] [Final verification check 1]
- [ ] [Final verification check 2]

## Related
- Learnings: [Reference to learnings.md entry]
- Patterns: [Reference to systemPatterns.md if applicable]
```

---

## Creating Skills

### Automatic (Recommended)

1. Work on tasks normally — patterns are tracked automatically
2. When `/archive` runs, you'll be prompted if skill candidates exist
3. Run `/skillify` to extract skills with guided interview

### Manual

1. Run `/skillify` at any time
2. Describe the pattern you want to extract
3. Follow the interview to define the skill

---

## Using Skills

### In Sessions

When a skill matches the current task, it will be suggested automatically based on:
- Trigger phrases in `when_to_use`
- Similar context patterns

### Invoking Skills

Reference a skill by name:
```
Use the [skill-name] skill to complete this task.
```

### Updating Skills

Skills evolve over time. When a pattern changes:
1. The skill's `evidence.session_count` updates
2. If significant changes occur, `/skillify` may propose updates
3. User confirms any modifications

---

## Skill Lifecycle

| Status | Description |
|--------|-------------|
| `candidate` | Pattern in `learnings.md` with 2+ sessions, ready for extraction |
| `active` | Skill extracted and available for use |
| `deprecated` | Skill no longer relevant, kept for history |

---

## Related Files

- `memory-bank/learnings.md` — Pattern tracking with session counts
- `.cursor/commands/skillify.md` — Skill extraction command
- `.cursor/rules/context-compaction.mdc` — Extracts learned patterns (Section 7)

---

*Skills are stored as markdown files for readability and version control.*
