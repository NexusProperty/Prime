# PLAN Command - Task Planning

This command creates detailed implementation plans based on complexity level determined in VAN mode.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/plan` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `explore` with `model: fast` — for Memory Bank and codebase structure scanning
> - `codebase-scanner-fast` — for structured codebase analysis and framework detection
> - `component-architecture-reviewer-fast` — for existing architecture analysis
> - `type-system-guardian-fast` — for type system overview
> - `frontend-architect-fast` — for layout, routing, navigation, and migration architecture analysis
> - `ui-ux-engineer-fast` — for design system evaluation, accessibility review, and UI pattern assessment

1. **Scan Memory Bank files** listed under "Memory Bank Integration → Reads from" (below).
   - Read `memory-bank/tasks.md` for task requirements and complexity level.
   - Read `memory-bank/activeContext.md` for current project context.
   - Read `memory-bank/projectbrief.md` for project foundation (if exists).
2. **Scan codebase structure** — gather an overview of the project's directory structure and key files.
3. **Collect file summaries** — each subagent returns a structured summary of what it found (file exists / missing, key content highlights, any anomalies).

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify that every file listed under "Reads from" was successfully scanned. If any file is missing or unreadable, halt and report to the user before proceeding.
2. **Context synthesis** — Combine the subagent findings into a single understanding of the current task state: task requirements, complexity level, project context, and codebase structure.
3. **Prerequisite validation** — Confirm that all preconditions for the command are satisfied (e.g., VAN mode has determined complexity for `/plan`). If a precondition fails, inform the user and suggest the corrective command (e.g., `/van`).
4. **Execution plan** — Outline the specific steps that will be delegated in Phase 3, referencing the verified context.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has explicitly confirmed that all discovery data is complete and all preconditions are met.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (task requirements, complexity level, project context).
   - The specific Workflow steps the subagent is responsible for.
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Recommended subagent types for `/plan`:**
   - `component-architecture-reviewer-fast` — for creating implementation plans
   - `frontend-architect-fast` — for layout/routing/navigation architecture planning and migration strategies
   - `ui-ux-engineer-fast` — for UI/UX design planning, design system decisions, and accessibility requirements
   - `memory-bank-specialist-fast` — for updating `tasks.md` with the plan
   - `file-operations-fast` — for comprehensive planning documentation

2. **Subagents execute** — The spawned subagents perform all file creation and file editing operations (updating `tasks.md` with the implementation plan, etc.).
3. **Main Agent verifies** — After all subagents return, the Main Agent reads the modified files to confirm correctness and completeness.
4. **Follow-up delegation loop** — If verification reveals missing updates, incorrect content, or incomplete work:
   - The Main Agent identifies exactly what needs to be fixed or added.
   - The Main Agent spawns a new subagent via the `Task` tool with specific instructions to perform the follow-up work.
   - The Main Agent **does NOT** perform the follow-up edits itself — this is a hard rule.
   - After the follow-up subagent returns, repeat step 3 (verify again).
   - Continue this loop until all outputs are correct and complete.

> **Violation:** If the Main Agent uses `StrReplace`, `Write`, `Delete`, or any file-modifying tool directly during Phase 3 — whether for initial execution, corrections, or follow-up tasks — it is a protocol violation. The delegation rule applies to ALL file operations, not just the first pass.
>
> **Execution constraint:** Subagents in this phase receive the full verified context from Phase 2. They must not re-discover or re-scan files already covered in Phase 1.

---

## Memory Bank Integration

Reads from:
- `memory-bank/tasks.md` - Task requirements and complexity level
- `memory-bank/activeContext.md` - Current project context
- `memory-bank/projectbrief.md` - Project foundation (if exists)

Creates:
- `memory-bank/plan/[task_id]/` - Task-specific folder
- `memory-bank/plan/[task_id]/plan-[task_id].md` - Main planning document
- `memory-bank/plan/[task_id]/plan-[task_id]-[phase].md` - Phase-specific plans (for multi-phase tasks)

Updates:
- `memory-bank/tasks.md` - Adds detailed implementation plan with folder reference

## Progressive Rule Loading

### Step 1: Load Core Rules
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/main.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/memory-bank-paths.mdc
```

### Step 2: Load PLAN Mode Map
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/plan-mode-map.mdc
```

### Step 3: Load Complexity-Specific Planning Rules
Based on complexity level from `memory-bank/tasks.md`:

**Level 2:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level2/task-tracking-basic.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level2/workflow-level2.mdc
```

**Level 3:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level3/task-tracking-intermediate.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level3/planning-comprehensive.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level3/workflow-level3.mdc
```

**Level 4:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level4/task-tracking-advanced.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level4/architectural-planning.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level4/workflow-level4.mdc
```

## Workflow

1. **Read Task Context**
   - Read `memory-bank/tasks.md` to get complexity level
   - Read `memory-bank/activeContext.md` for current context
   - Review codebase structure

2. **Create Task Folder Structure**
   - Create folder: `memory-bank/plan/[task_id]/`
   - Use task ID from `memory-bank/tasks.md` (e.g., HEALTH-002, UPGRADE-001, GEO-001)
   - If multi-phase task (Level 3-4), prepare for multiple plan files

3. **Create Implementation Plan**
   - All planning documents are created in the task-specific folder: `memory-bank/plan/[task_id]/`
   - **Level 2:** Document planned changes, files to modify, implementation steps
   - **Level 3:** Create comprehensive plan with components, dependencies, challenges
   - **Level 4:** Create phased implementation plan with architectural considerations

4. **Technology Validation** (Level 2-4)
   - Document technology stack selection
   - Create proof of concept if needed
   - Verify dependencies and build configuration

5. **Identify Creative Phases**
   - Flag components requiring design decisions
   - Document which components need creative exploration

6. **Update Memory Bank**
   - Update `memory-bank/tasks.md` with complete plan
   - Mark planning phase as complete

## Usage

Type `/plan` to start planning based on the task in `memory-bank/tasks.md`.

## Next Steps

- **If creative phases identified:** Use `/creative` command
- **If no creative phases:** Proceed to `/build` command
