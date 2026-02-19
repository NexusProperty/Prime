# BUILD Command - Code Implementation

This command implements the planned changes following the implementation plan and creative phase decisions. It enforces a test-driven approach where tests are written for all success criteria and must pass before completing each phase.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/build` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `explore` with `model: fast` — for Memory Bank and codebase scanning
> - `codebase-scanner-fast` — for structured codebase analysis
> - `type-system-guardian-fast` — for type-related context gathering
> - `component-architecture-reviewer-fast` — for component structure analysis
> - `frontend-architect-fast` — for layout, routing, and navigation architecture analysis
> - `ui-ux-engineer-fast` — for design system, accessibility, and responsive pattern review

1. **Scan Memory Bank files** listed under "Memory Bank Integration → Reads from" (below).
   - Read `memory-bank/tasks.md` for implementation plan and checklists.
   - Read `memory-bank/creative/creative-*.md` for design decisions (Level 3-4).
   - Read `memory-bank/activeContext.md` for current project context.
2. **Scan target output paths** — verify files that will be updated exist and note their current state.
3. **Collect file summaries** — each subagent returns a structured summary of what it found (file exists / missing, key content highlights, any anomalies).

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify that every file listed under "Reads from" was successfully scanned. If any file is missing or unreadable, halt and report to the user before proceeding.
2. **Context synthesis** — Combine the subagent findings into a single understanding of the current task state: complexity level, implementation plan, creative decisions, and current context.
3. **Prerequisite validation** — Confirm that all preconditions for the command are satisfied (e.g., planning is complete for `/build`). If a precondition fails, inform the user and suggest the corrective command (e.g., `/plan`).
4. **Execution plan** — Outline the specific steps that will be delegated in Phase 3, referencing the verified context.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has explicitly confirmed that all discovery data is complete and all preconditions are met.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (complexity level, implementation plan, creative decisions).
   - The specific Workflow steps the subagent is responsible for.
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Recommended subagent types for `/build`:**
   - `component-architecture-reviewer-fast` — for component implementation and refactoring
   - `type-system-guardian-fast` — for TypeScript type implementations
   - `react-query-specialist-fast` — for data fetching hooks and cache logic
   - `frontend-architect-fast` — for layout shells, routing changes, navigation adapters, and migration scaffolding
   - `ui-ux-engineer-fast` — for UI component implementation, design system compliance, and accessibility
   - `file-operations-fast` — for batch file creation and updates
   - `memory-bank-specialist-fast` — for updating Memory Bank files (`tasks.md`, `progress.md`)
   - `validation-specialist-fast` — for lint checking and pre-verification

2. **Subagents execute** — The spawned subagents perform all file creation and file editing operations.
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
- `memory-bank/tasks.md` - Implementation plan and checklists
- `memory-bank/creative/creative-*.md` - Design decisions (Level 3-4)
- `memory-bank/activeContext.md` - Current project context

Creates:
- `memory-bank/build/[task_id]/` - Task-specific folder
- `memory-bank/build/[task_id]/build-[task_id].md` - Main build document
- `memory-bank/build/[task_id]/build-[task_id]-phase[N].md` - Phase completion reports (for multi-phase tasks)

Updates:
- `memory-bank/tasks.md` - Implementation progress, test results, and status
- `memory-bank/progress.md` - Build status, test outcomes, and observations

## Progressive Rule Loading

### Step 1: Load Core Rules
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/main.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/memory-bank-paths.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/command-execution.mdc
```

### Step 2: Load BUILD Mode Map
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/build-mode-map.mdc
```

### Step 3: Load Complexity-Specific Implementation Rules
Based on complexity level from `memory-bank/tasks.md`:

**Level 1:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level1/workflow-level1.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level1/optimized-workflow-level1.mdc
```

**Level 2:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level2/workflow-level2.mdc
```

**Level 3-4:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level3/implementation-intermediate.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level4/phased-implementation.mdc
```

## Workflow

1. **Verify Prerequisites**
   - Check `memory-bank/tasks.md` for planning completion
   - For Level 3-4: Verify creative phase documents exist
   - Review implementation plan

2. **Create Task Folder Structure**
   - Create folder: `memory-bank/build/[task_id]/`
   - Use task ID from `memory-bank/tasks.md`
   - For multi-phase tasks, prepare for multiple phase completion files

3. **Determine Complexity Level**
   - Read complexity level from `memory-bank/tasks.md`
   - Load appropriate workflow rules

4. **Execute Implementation**

   **Level 1 (Quick Bug Fix):**
   - Review bug report
   - Examine relevant code
   - Implement targeted fix
   - Write test(s) validating the fix
   - Run tests and ensure they pass
   - Update `memory-bank/tasks.md`

   **Level 2 (Simple Enhancement):**
   - Review build plan
   - Examine relevant code areas
   - Implement changes sequentially
   - Write tests for each success criterion
   - Run all tests and ensure they pass
   - Update `memory-bank/tasks.md`

   **Level 3-4 (Feature/System):**
   - Review plan and creative decisions
   - Create directory structure
   - Build in planned phases
   - **For each phase:**
     - Write tests for all phase success criteria
     - Run tests and ensure they pass
     - Do NOT proceed to next phase until all tests pass
   - Integration testing
   - Document implementation
   - Update `memory-bank/tasks.md` and `memory-bank/progress.md`
   - Build documentation is created in: `memory-bank/build/[task_id]/`

5. **Test-Driven Phase Completion**
   - Extract success criteria from current phase in `memory-bank/tasks.md`
   - Write test cases covering each success criterion
   - Execute all tests
   - **Gate:** All tests MUST pass before phase completion
   - Document test results in `memory-bank/tasks.md`
   - If tests fail: fix implementation, re-run tests, repeat until all pass

6. **Command Execution**
   - Document all commands executed
   - Document results and observations
   - Follow platform-specific command guidelines

7. **Verification**
   - Verify all build steps completed
   - Verify all success criteria tests pass
   - Verify changes meet requirements
   - Update `memory-bank/tasks.md` with completion status

## Usage

Type `/build` to start implementation based on the plan in `memory-bank/tasks.md`.

## Next Steps

After implementation complete, proceed to `/reflect` command for task review.
