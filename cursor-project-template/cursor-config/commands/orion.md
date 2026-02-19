# ORION Command - Context Review, Analysis & Reporting

This command reviews and understands a specific file or folder that the user `@` mentions or references. It gathers all context, information, and related data regarding the mentioned target, then creates tasks, drafts fix plans, or generates reports in the `Maunal/` directory.

## Maunal Directory Integration

**CRITICAL:** Each `/orion` execution creates a **task-specific folder** inside `Maunal/` to group all output files for that analysis session — identical to how `/build` creates `memory-bank/build/[task_id]/` and `/archive` creates `memory-bank/archive/[task_id]/`.

### Folder Structure

Reads & Updates:
- `Maunal/CONTEXT.md` — Persistent context file tracking all Orion sessions, their relationships, and outcomes (read at start, updated at end of every `/orion` execution)

Creates:
- `Maunal/[orion_id]/` — Task-specific folder for this analysis session
- `Maunal/[orion_id]/README.md` — Index file describing this analysis session (target, date, outputs)
- `Maunal/[orion_id]/FINDINGS-[orion_id].md` — Detailed analysis and cross-referenced findings
- `Maunal/[orion_id]/SOLUTIONS-[orion_id].md` — Fix recommendations, prioritized phases, effort estimates
- `Maunal/[orion_id]/REPORT-[orion_id].md` — Status dashboards, tracking, and comparison reports
- `Maunal/[orion_id]/TASKS-[orion_id].md` — Generated task lists and action items
- `Maunal/[orion_id]/PLAN-[orion_id].md` — Drafted fix plans with phased approaches

> **Only create the output files that are determined necessary in Phase 2.** Not every analysis session requires all five output types.

### Orion ID Convention

The `[orion_id]` is generated at the start of each `/orion` execution:
- Format: `ORION-[NNN]` (e.g., `ORION-001`, `ORION-002`)
- Sequential numbering: scan existing `Maunal/ORION-*/` folders to determine the next number
- If no prior ORION folders exist, start at `ORION-001`

### Example Folder Layout

```
Maunal/
├── README.md                          ← Directory-level README
├── CONTEXT.md                         ← Persistent context tracking all sessions
├── ORION-001/                         ← First analysis session
│   ├── README.md                      ← Session index
│   ├── FINDINGS-ORION-001.md
│   ├── SOLUTIONS-ORION-001.md
│   └── REPORT-ORION-001.md
├── ORION-002/                         ← Second analysis session
│   ├── README.md
│   ├── FINDINGS-ORION-002.md
│   ├── TASKS-ORION-002.md
│   └── PLAN-ORION-002.md
└── ...
```

### Persistent Context File (`Maunal/CONTEXT.md`)

**CRITICAL:** The `CONTEXT.md` file is the cross-session memory for the Orion system. It tracks:
- Every Orion session that has been executed (ID, date, target, status, outputs)
- Relationships between sessions (e.g., ORION-002 was a follow-up to ORION-001)
- Which sessions led to actual fixes (via `/van` → `/build` pipeline)
- Unresolved findings that still need attention
- Active threads of investigation

**Read-Update Protocol:**
1. **At the START** of every `/orion` execution, read `Maunal/CONTEXT.md` to understand prior sessions and their outcomes.
2. Use the context to determine if the current analysis is **related to** or a **follow-up of** a previous session.
3. **At the END** of every `/orion` execution, update `Maunal/CONTEXT.md` with the new session entry, any relationship links, and updated statuses.

> If `Maunal/CONTEXT.md` does not exist, create it with the initial structure defined in the CONTEXT Document Structure section below.

### Reference Sources (read-only)

- `Maunal/CONTEXT.md` — Prior Orion session history and relationships (read-write)
- `reporters/` — Raw test failure reports
- `memory-bank/archive/` — Prior fix cycle archives and lessons learned
- `memory-bank/tasks.md` — Current task state (if exists)
- `memory-bank/activeContext.md` — Current project focus (if exists)
- Any file or folder the user `@` references

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/orion` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (MANDATORY Fast Subagent Delegation)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from performing Phase 1 discovery directly. It **MUST** use the `Task` tool to spawn subagents for ALL discovery work. The Main Agent's role in Phase 1 is to define discovery tasks and dispatch subagents — never to read, scan, or gather context itself.

The Main Agent spawns **2–4 parallel subagents** via the `Task` tool. **ALL subagents MUST use `model: "fast"`** — no exceptions. Each subagent prompt must include the project's Primary Rule preamble (per `AGENTS.md` §4a) and specify `readonly: true`.

> **Model Rule:** Every `Task` tool call in Phase 1 MUST include `model: "fast"`. Only use subagent types ending in `-fast` (e.g., `codebase-scanner-fast`, `memory-bank-specialist-fast`). The `explore` type is allowed but MUST always be paired with `model: "fast"`. Non-fast models are forbidden in discovery — they waste tokens on read-only work.

#### 1.1 Required Subagent Dispatches

The Main Agent **MUST** dispatch at least these subagents (launch in parallel where possible):

**Subagent A — Target Scanner** (`codebase-scanner-fast`, `model: "fast"`)
- Read and analyze the file or folder the user `@` mentioned
- If a **file**: Read the full contents; identify its type (test report, source code, config, documentation)
- If a **folder**: List all files; read each file; map the folder's purpose and structure
- Return a structured discovery summary

**Subagent B — Context Gatherer** (`memory-bank-specialist-fast`, `model: "fast"`)
- Read `Maunal/CONTEXT.md` — load all prior Orion sessions, targets, outcomes, relationships
- Read existing `Maunal/` session folders to avoid duplicating prior analysis
- Read `memory-bank/tasks.md` and `memory-bank/activeContext.md` if they exist
- Scan `memory-bank/archive/` for prior fix cycles related to the referenced target
- Return: prior session summary, relationship candidates, unresolved threads

**Subagent C — Source/Reporter Scanner** (optional, `codebase-scanner-fast`, `model: "fast"`)
- If the target references spec files, components, or source code: read those files to understand current state
- If the target is test-related: scan `reporters/` for raw test failure data
- Return: current state of referenced files, relevant code snippets

**Subagent D — Deep Investigation** (optional, `explore`, `model: "fast"`)
- For complex targets that span multiple directories or systems
- Cross-reference imports, dependencies, and usage patterns
- Return: dependency map, usage analysis

#### 1.2 Subagent Prompt Template

Each Phase 1 subagent must receive this preamble in its prompt:

```
**MANDATORY CONTEXT FOR SUB-AGENT:** You are bound by the project's Primary Rule.
You MUST read every file with the Read tool before referencing or editing it. You are
forbidden from assuming file contents, inventing import paths, or fabricating function
signatures. If you cannot verify something exists, say so and stop. Do not hallucinate.

**CONSTRAINT:** You are in DISCOVERY mode — read-only. Do NOT create, edit, or delete
any files. Return your findings as a structured summary.
```

#### 1.3 Required Return Format

Each subagent must return a structured summary:
```
## Discovery Summary — [Subagent Role]

### Target
- Path: [file/folder path]
- Type: [test report | source code | config | documentation | archive]

### Key Content
- [highlight 1]
- [highlight 2]

### Related Files Found
- [path] — [relevance]

### Prior Work
- [archive/task reference] — [what was done before]

### Recommendations for Phase 2
- [what the Main Agent should focus on during review]
```

#### 1.4 Enforcement

> **Violation:** If the Main Agent uses `Read`, `Glob`, `Grep`, `SemanticSearch`, `LS`, or any discovery tool directly during Phase 1 — instead of delegating to subagents — it is a protocol violation. The ONLY exception is a single `LS` call to `Maunal/` to determine the next Orion ID, which is needed before subagents can be dispatched.
>
> **Parallelism:** Subagents A and B MUST be launched in the same tool-call batch (parallel). Subagents C and D may be launched in the same batch or deferred based on complexity.
>
> **Subagent constraint:** All Phase 1 subagents are **read-only** (`readonly: true`). They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify that the referenced target was fully read and all related context was gathered. If any critical file is missing or unreadable, halt and report to the user.
2. **Context synthesis** — Combine subagent findings into a unified understanding:
   - What does the referenced target contain?
   - What is the current state of the system it describes?
   - What prior work has been done (from archives)?
   - What has changed since the prior work?
3. **Relationship detection** — Using `Maunal/CONTEXT.md`, determine if the current analysis:
   - Is a **follow-up** to a previous Orion session (same target or related target)
   - Is a **new investigation** of something not previously analyzed
   - **Overlaps** with an ongoing or unresolved session
   - References findings from a session that was already **actioned** (via `/van` → `/build`)
   Record the relationship type and linked session IDs for inclusion in the CONTEXT update.
4. **Orion ID assignment** — Scan existing `Maunal/ORION-*/` folders to determine the next sequential ID. Confirm the folder does not already exist.
5. **Output determination** — Based on the analysis, determine which output types are needed:
   - **FINDINGS** — When failures, regressions, or issues are identified
   - **SOLUTIONS** — When actionable fixes can be recommended
   - **REPORT** — When a status comparison or tracking dashboard is needed
   - **TASKS** — When discrete work items need to be captured
   - **PLAN** — When a phased fix approach is warranted
6. **Execution plan** — Outline the folder structure to create (`Maunal/[orion_id]/`) and the specific files within it, referencing verified context.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has explicitly confirmed that all discovery data is complete and the output determination is finalized.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. **ALL subagents MUST use `model: "fast"`** — no exceptions. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (target analysis, related context, output determination).
   - The specific output files to create and their content structure.
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Required subagent types for `/orion` (all `-fast`, all `model: "fast"`):**
   - `documentation-manager-fast` — for creating FINDINGS, SOLUTIONS, and REPORT documents
   - `file-operations-fast` — for batch file creation in `Maunal/`
   - `e2e-testing-engineer-fast` — for analyzing test failures and recommending fixes
   - `memory-bank-specialist-fast` — for cross-referencing with archived task data
   - `validation-specialist-fast` — for verifying output completeness and accuracy
   
   > **Model Rule:** Every `Task` tool call in Phase 3 MUST include `model: "fast"`. Only use subagent types ending in `-fast`. Non-fast models are forbidden in `/orion` execution.

2. **Subagents execute** — The spawned subagents create the `Maunal/[orion_id]/` folder, the session `README.md`, and all determined output files within it.
3. **Main Agent verifies** — After all subagents return, the Main Agent reads the created files to confirm correctness and completeness.
4. **Follow-up delegation loop** — If verification reveals missing content, incorrect analysis, or incomplete coverage:
   - The Main Agent identifies exactly what needs to be fixed or added.
   - The Main Agent spawns a new subagent via the `Task` tool with specific instructions to perform the follow-up work.
   - The Main Agent **does NOT** perform the follow-up edits itself — this is a hard rule.
   - After the follow-up subagent returns, repeat step 3 (verify again).
   - Continue this loop until all outputs are correct and complete.

> **Violation:** If the Main Agent uses `StrReplace`, `Write`, `Delete`, or any file-modifying tool directly during Phase 3 — whether for initial execution, corrections, or follow-up tasks — it is a protocol violation. The delegation rule applies to ALL file operations, not just the first pass.
>
> **Execution constraint:** Subagents in this phase receive the full verified context from Phase 2. They must not re-discover or re-scan files already covered in Phase 1.

---

## Workflow

1. **Read Orion Context**
   - Read `Maunal/CONTEXT.md` (if it exists) to load the history of all prior Orion sessions
   - Identify sessions that are related to the current target (same file, same test suite, same feature area)
   - Note any unresolved findings or active investigation threads

2. **Identify the Target**
   - Parse the user's message for `@` referenced files or folders
   - Determine target type (test report, source code, archive, etc.)
   - Cross-reference with CONTEXT.md to check if this target was previously analyzed

3. **Establish Orion ID & Create Folder Structure**
   - Scan existing `Maunal/ORION-*/` folders to determine next sequential number
   - Generate the Orion ID (e.g., `ORION-001`, `ORION-002`)
   - Create the task-specific folder: `Maunal/[orion_id]/`
   - Create `Maunal/[orion_id]/README.md` with session metadata (target, date, purpose)

4. **Gather Full Context**
   - Read the target file/folder completely
   - Scan `Maunal/` for existing analysis of the same target (prior ORION sessions)
   - Scan `memory-bank/archive/` for prior fix cycles
   - Scan `reporters/` for related test failure data
   - Read referenced source files if applicable

5. **Analyze and Cross-Reference**
   - Compare current state against prior work (archives and prior ORION sessions)
   - Cross-reference with CONTEXT.md entries to identify:
     - Regressions (things that were fixed but broke again)
     - Known issues (things flagged in prior sessions that were never resolved)
     - New issues (things not seen before)
     - Progress (things that improved since the last related session)
   - Categorize by severity and type

6. **Determine Outputs**
   Based on analysis, generate one or more of:

   | Output Type | When to Create | File Path |
   |------------|----------------|-----------|
   | **FINDINGS** | Issues, regressions, or failures identified | `Maunal/[orion_id]/FINDINGS-[orion_id].md` |
   | **SOLUTIONS** | Actionable fixes can be recommended | `Maunal/[orion_id]/SOLUTIONS-[orion_id].md` |
   | **REPORT** | Status comparison or tracking needed | `Maunal/[orion_id]/REPORT-[orion_id].md` |
   | **TASKS** | Discrete work items to capture | `Maunal/[orion_id]/TASKS-[orion_id].md` |
   | **PLAN** | Phased fix approach warranted | `Maunal/[orion_id]/PLAN-[orion_id].md` |

7. **Generate Output Files**
   - Create all determined output files in `Maunal/[orion_id]/`
   - Cross-reference prior archives, prior ORION sessions, and current findings
   - Include severity ratings, effort estimates, and priority ordering
   - Update `Maunal/[orion_id]/README.md` with the list of generated files

8. **Update Orion Context**
   - Update `Maunal/CONTEXT.md` with:
     - New session entry (Orion ID, date, target, status, outputs generated)
     - Relationship links to prior sessions (if this is a follow-up or related analysis)
     - Updated status of prior sessions (e.g., mark as "Actioned" if the user ran `/van` → `/build` on its findings)
     - Move resolved findings from "Unresolved" to "Resolved" section
     - Add any new unresolved findings from this session

9. **Summary to User**
   - Present a concise summary of what was found
   - List the files created and their purpose
   - Highlight relationships to prior sessions (if any)
   - Highlight the most critical findings or recommended next steps

## Output Document Standards

### Session README Structure (`Maunal/[orion_id]/README.md`)
```
# [orion_id] — [Brief Description of Target]

## Metadata
- Orion ID: [orion_id]
- Date: [YYYY-MM-DD]
- Target: [file/folder that was analyzed]
- Status: Complete

## Generated Files
- FINDINGS-[orion_id].md — [brief description]
- SOLUTIONS-[orion_id].md — [brief description]
- REPORT-[orion_id].md — [brief description]
  (only list files that were actually created)

## Summary
[1-3 sentence summary of the analysis and key findings]
```

### FINDINGS Document Structure
```
# [Topic] Findings Report
- Orion ID, Date, Source, Reference
- Executive Summary
- Detailed Findings (numbered, categorized)
- Pattern Analysis
- Files Requiring Investigation
```

### SOLUTIONS Document Structure
```
# [Topic] Solutions & Fix Recommendations
- Orion ID, Date, Reference
- Prioritized Fix Phases (A, B, C...)
- Each phase: affected tests, root cause, solution steps, verification command
- Estimated Effort table
- Lessons from prior work
```

### REPORT Document Structure
```
# [Topic] Status Report
- Orion ID, Date
- Dashboard (metrics table)
- Comparison vs prior state
- Test-by-test status
- Root cause summary
- Recommended action items
- Risk assessment
```

### TASKS Document Structure
```
# [Topic] Task List
- Orion ID, Date
- Task ID, description, priority, estimated effort
- Dependencies between tasks
- Acceptance criteria for each task
```

### PLAN Document Structure
```
# [Topic] Fix Plan
- Orion ID, Date
- Phased approach with clear gates
- Per-phase: goal, files to modify, fix strategy, success criteria
- Rollback strategy
- Timeline estimate
```

### CONTEXT Document Structure (`Maunal/CONTEXT.md`)

This is a **persistent file** (not per-session). It is read at the start and updated at the end of every `/orion` execution.

```
# Orion Context

> Persistent context file tracking all Orion analysis sessions, their relationships, and outcomes.
> Read at the START and updated at the END of every `/orion` execution.

---

## Session Log

| Orion ID | Date | Target | Status | Outputs | Related Sessions |
|----------|------|--------|--------|---------|------------------|
| ORION-001 | 2026-02-11 | `reporters/failures-2026-02-11.md` | Actioned → E2E-FIX-005 | FINDINGS, SOLUTIONS, REPORT | — |
| ORION-002 | 2026-02-12 | `e2e/tests/layout/navigation.spec.ts` | Complete | FINDINGS, TASKS | Follow-up to ORION-001 |

### Status Values
- **Complete** — Analysis finished, outputs generated
- **Actioned** — Findings were acted on via `/van` → `/build` (include task ID)
- **Superseded** — A newer session covers the same target (link to successor)
- **Stale** — Target has changed significantly since analysis; re-run recommended

---

## Active Threads

> Ongoing investigations or unresolved findings that need attention.

### [Thread Name]
- **Origin Session**: ORION-XXX
- **Target**: [file/folder]
- **Unresolved Findings**:
  1. [Finding description — severity]
  2. [Finding description — severity]
- **Last Updated**: [date]
- **Next Action**: [what needs to happen]

---

## Resolved Threads

> Threads that have been fully addressed.

### [Thread Name]
- **Origin Session**: ORION-XXX
- **Resolution**: [how it was resolved — task ID, date]
- **Archived**: [link to archive if applicable]

---

## Relationship Map

> How sessions connect to each other and to the broader task workflow.

- ORION-001 → **actioned as** E2E-FIX-005 (via `/van` → `/build`)
- ORION-002 → **follow-up to** ORION-001 (same target area, deeper investigation)
- ORION-003 → **new thread** (unrelated to prior sessions)
```

> **Key difference from session-level files:** CONTEXT.md is cumulative. It grows over time as more sessions are executed. Session-level files (FINDINGS, SOLUTIONS, etc.) are snapshots frozen at creation time.

## Usage

Type `/orion` followed by an `@` reference to the file or folder you want analyzed.

Examples:
```
/orion @reporters/failures-2026-02-10-10-17-21.md
/orion @memory-bank/archive/E2E-FIX-004
/orion @e2e/tests/layout/navigation.spec.ts
/orion @Maunal
```

## Next Steps

- To act on generated SOLUTIONS or PLANS: use `/van` to initialize a task, then `/build` to implement
- To archive completed manual work: move relevant files to `memory-bank/archive/` via `/archive`
- To re-analyze after fixes: run `/orion` again on the same target to compare
