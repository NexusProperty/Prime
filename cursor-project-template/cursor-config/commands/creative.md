# CREATIVE Command - Design Decisions

This command performs structured design exploration for components flagged during planning.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/creative` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `explore` with `model: fast` — for Memory Bank and codebase pattern scanning
> - `codebase-scanner-fast` — for existing component and pattern analysis
> - `component-architecture-reviewer-fast` — for existing architecture analysis
> - `frontend-architect-fast` — for layout/routing/navigation pattern discovery
> - `ui-ux-engineer-fast` — for design system and UI pattern discovery

1. **Scan Memory Bank files** listed under "Memory Bank Integration → Reads from" (below).
   - Read `memory-bank/tasks.md` for components requiring creative phases.
   - Read `memory-bank/activeContext.md` for current project context.
2. **Scan target output paths** — confirm `memory-bank/creative/` directory exists and check for existing creative documents.
3. **Collect file summaries** — each subagent returns a structured summary of what it found (file exists / missing, key content highlights, any anomalies).

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify that every file listed under "Reads from" was successfully scanned. If any file is missing or unreadable, halt and report to the user before proceeding.
2. **Context synthesis** — Combine the subagent findings into a single understanding of the current task state: components flagged for creative work, complexity level, and current context.
3. **Prerequisite validation** — Confirm that all preconditions for the command are satisfied (e.g., planning is complete for `/creative`). If a precondition fails, inform the user and suggest the corrective command (e.g., `/plan`).
4. **Execution plan** — Outline the specific steps that will be delegated in Phase 3, referencing the verified context.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has explicitly confirmed that all discovery data is complete and all preconditions are met.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (components to design, complexity level, constraints).
   - The specific Workflow steps the subagent is responsible for.
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Recommended subagent types for `/creative`:**
   - `component-architecture-reviewer-fast` — for component-level architecture design decisions
   - `frontend-architect-fast` — for layout, routing, navigation, and structural architecture design decisions
   - `ui-ux-engineer-fast` — for UI/UX design decisions, design system exploration, and accessibility design
   - `performance-optimization-analyst-fast` — for algorithm design decisions
   - `memory-bank-specialist-fast` — for creating creative phase documents and updating `tasks.md`
   - `file-operations-fast` — for document creation

2. **Subagents execute** — The spawned subagents perform all file creation and file editing operations (creating creative documents, updating `tasks.md`, etc.).
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
- `memory-bank/tasks.md` - Components requiring creative phases
- `memory-bank/activeContext.md` - Current project context

Creates:
- `memory-bank/creative/[task_id]/` - Task-specific folder
- `memory-bank/creative/[task_id]/creative-[task_id].md` - Main creative document
- `memory-bank/creative/[task_id]/creative-[task_id]-[phase].md` - Phase-specific creative documents (if multi-phase)

Updates:
- `memory-bank/tasks.md` - Records design decisions

## Progressive Rule Loading

### Step 1: Load Core Rules
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/main.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/memory-bank-paths.mdc
```

### Step 2: Load CREATIVE Mode Map
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/creative-mode-map.mdc
```

### Step 3: Load Creative Phase Enforcement
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/creative-phase-enforcement.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/creative-phase-metrics.mdc
```

### Step 4: Load Specialized Creative Rules (Lazy Loaded)
Load only when specific creative phase type is needed:

**For Architecture Design:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Phases/CreativePhase/creative-phase-architecture.mdc
```

**For UI/UX Design:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Phases/CreativePhase/creative-phase-uiux.mdc
```

**For Algorithm Design:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Phases/CreativePhase/creative-phase-algorithm.mdc
```

## Workflow

1. **Verify Planning Complete**
   - Check `memory-bank/tasks.md` for planning completion
   - Verify creative phases are identified
   - If not complete, return to `/plan` command

2. **Create Task Folder Structure**
   - Create folder: `memory-bank/creative/[task_id]/`
   - Use task ID from `memory-bank/tasks.md`
   - Folder should match the plan folder name for consistency

3. **Identify Creative Phases**
   - Read components flagged for creative work from `memory-bank/tasks.md`
   - Prioritize components for design exploration

4. **Execute Creative Phase**
   For each component:
   - **🎨🎨🎨 ENTERING CREATIVE PHASE: [TYPE]**
   - Define requirements and constraints
   - Generate 2-4 design options
   - Analyze pros/cons of each option
   - Select and justify recommended approach
   - Document implementation guidelines
   - Verify solution meets requirements
   - **🎨🎨🎨 EXITING CREATIVE PHASE**

5. **Document Decisions**
   - Create documents in `memory-bank/creative/[task_id]/` folder
   - Update `memory-bank/tasks.md` with design decisions

6. **Verify Completion**
   - Ensure all flagged components have completed creative phases
   - Mark creative phase as complete in `memory-bank/tasks.md`

## Usage

Type `/creative` to start creative design work for components flagged in the plan.

## Next Steps

After all creative phases complete, proceed to `/build` command for implementation.
