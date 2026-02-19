# SKILLIFY Command - Skill Extraction

This command extracts reusable skills from recurring patterns observed across sessions.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/skillify` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `memory-bank-specialist-fast` — for learnings.md and session context

1. **Scan `memory-bank/learnings.md`** — identify entries with `Skill Status: candidate`
2. **Scan `memory-bank/activeContext.md`** — get current session context
3. **List `.cursor/skills/`** — check for existing skills to avoid duplicates

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Candidate List** — Compile list of skill candidates from `learnings.md`
2. **Existing Skills Check** — Verify no duplicate skills exist in `.cursor/skills/`
3. **User Presentation** — Present candidates to user for selection

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until the user has selected a candidate or described a new pattern.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion). It **must** use the `Task` tool to spawn subagents for ALL file modifications.

**Recommended subagent types for `/skillify`:**
- `memory-bank-specialist-fast` — for updating learnings.md
- `file-operations-fast` — for creating SKILL.md files

---

## Memory Bank Integration

Reads from:
- `memory-bank/learnings.md` - Pattern entries with session counts and skill status
- `memory-bank/activeContext.md` - Current session context

Creates:
- `.cursor/skills/[skill-name]/SKILL.md` - Extracted skill definition

Updates:
- `memory-bank/learnings.md` - Updates skill status to `extracted`

---

## Workflow

### 1. Gather Candidates

Read `memory-bank/learnings.md` and identify entries where:
- `Skill Status` column shows `candidate`
- Session count ≥ 2

Present to user:
```markdown
## Skill Candidates

The following patterns have been observed in 2+ sessions and are ready for extraction:

| # | Pattern | Sessions | First Observed | Category |
|---|---------|----------|----------------|----------|
| 1 | [Pattern Name] | 3 | 2026-02-10 | Code Patterns |
| 2 | [Pattern Name] | 2 | 2026-02-08 | Tool Preferences |

**Options:**
- Enter a number to extract that candidate
- Type "new" to describe a new pattern
- Type "skip" to exit without extraction
```

### 2. Select Candidate

Wait for user input:
- **Number (1, 2, etc.)** — Select that candidate for extraction
- **"new"** — User will describe a new pattern manually
- **"skip"** — Exit without extraction

### 3. Interview (Abbreviated)

For selected candidate, conduct abbreviated interview:

**Round 1: Identity**
```markdown
## Skill Identity

Based on the pattern "[Pattern Name]", let's define the skill:

1. **Name:** [suggest based on pattern, e.g., "radiant-migration"]
2. **Description:** [suggest based on pattern context]
3. **Trigger Phrases:** When should this skill be used?
   - [suggest phrase 1]
   - [suggest phrase 2]

Please confirm or modify these values.
```

**Round 2: Steps**
```markdown
## Skill Steps

Based on observed usage, this skill involves:

1. [Step 1 from pattern observation]
   - Success Criteria: [observed outcome]
   
2. [Step 2 from pattern observation]
   - Success Criteria: [observed outcome]

Please confirm, add, or modify these steps.
```

**Round 3: Verification**
```markdown
## Verification

How do we know the skill completed successfully?

- [ ] [Suggested check based on pattern]
- [ ] [Suggested check based on pattern]

Please confirm or add verification checks.
```

### 4. Generate SKILL.md

Create the skill file based on interview responses:

**Path:** `.cursor/skills/[skill-name]/SKILL.md`

```markdown
---
name: [confirmed name]
description: [confirmed description]
when_to_use: |
  Use when [trigger condition]
  Trigger phrases: "[phrase 1]", "[phrase 2]"
evidence:
  first_observed: [from learnings.md]
  last_confirmed: [today's date]
  session_count: [from learnings.md]
source_learnings:
  - "[Pattern name from learnings.md]"
---

# [Skill Name]

## Overview
[Description expanded]

## Prerequisites
- [Any required context or state]

## Steps

### Step 1: [Action]
**Success Criteria:** [Confirmed criteria]
**Artifacts:** [What this produces]

### Step 2: [Action]
**Success Criteria:** [Confirmed criteria]
**Artifacts:** [What this produces]

[Additional steps as confirmed]

## Verification
- [ ] [Confirmed check 1]
- [ ] [Confirmed check 2]

## Related
- Learnings: `memory-bank/learnings.md` ([Pattern Name])
```

### 5. Confirm and Save

Show the complete skill to user:
```markdown
## Skill Preview

Here is the generated skill:

[Full SKILL.md content]

**Actions:**
- Type "save" to create this skill
- Type "edit [section]" to modify a section
- Type "cancel" to discard
```

On "save":
1. Create `.cursor/skills/[skill-name]/SKILL.md`
2. Update `memory-bank/learnings.md` — set skill status to `extracted`
3. Confirm completion to user

### 6. Update Learnings

After skill creation, update the source entry in `learnings.md`:

**Before:**
```markdown
| Pattern | When to Apply | First Observed | Last Confirmed | Sessions | Skill Status |
|---------|---------------|----------------|----------------|----------|--------------|
| Radiant migration | Legacy gradients | 2026-02-10 | 2026-02-12 | 3 | candidate |
```

**After:**
```markdown
| Pattern | When to Apply | First Observed | Last Confirmed | Sessions | Skill Status |
|---------|---------------|----------------|----------------|----------|--------------|
| Radiant migration | Legacy gradients | 2026-02-10 | 2026-02-12 | 3 | extracted |
```

---

## Usage

Type `/skillify` to extract skills from recurring patterns.

### When to Use

- After `/archive` prompts that skill candidates exist
- When you've noticed a recurring pattern you want to formalize
- When the team wants to standardize an approach

### Evidence Threshold

By default, patterns must appear in **2+ sessions** before extraction. This can be overridden:
```
/skillify --force [pattern name]
```
Use `--force` sparingly — evidence-based extraction produces better skills.

---

## Next Steps

After skill creation:
1. Skill is immediately available for use
2. Future sessions will suggest the skill when triggers match
3. Skill can be updated by running `/skillify` again on the same pattern
