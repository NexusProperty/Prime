# VAN Command - Initialization & Entry Point

This command initializes the Memory Bank system, performs platform detection, determines task complexity, and routes to appropriate workflows.

## Memory Bank Integration

**CRITICAL:** All Memory Bank files are located in `memory-bank/` directory:
- `memory-bank/tasks.md` - Source of truth for task tracking
- `memory-bank/activeContext.md` - Current focus
- `memory-bank/progress.md` - Implementation status
- `memory-bank/projectbrief.md` - Project foundation

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/van` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `explore` with `model: fast` — for Memory Bank existence checks and codebase overview
> - `codebase-scanner-fast` — for project structure analysis and framework detection
> - `memory-bank-specialist-fast` — for Memory Bank file analysis (if exists)

1. **Scan Memory Bank files** listed under "Memory Bank Integration" (above).
   - Check if `memory-bank/` directory exists.
   - Read `memory-bank/tasks.md` if it exists (for existing task context).
   - Read `memory-bank/activeContext.md` if it exists (for current focus).
   - Read `memory-bank/progress.md` if it exists (for implementation status).
   - Read `memory-bank/projectbrief.md` if it exists (for project foundation).
2. **Perform platform detection** — gather OS, shell, and path separator information.
3. **Collect file summaries** — each subagent returns a structured summary of what it found (file exists / missing, key content highlights, any anomalies).

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify the Memory Bank structure (exists or needs creation). Note any missing essential files.
2. **Context synthesis** — Combine the subagent findings into a single understanding of the current state: existing tasks, platform details, and project context.
3. **Task analysis** — Based on discovery, analyze the user's task requirements and determine complexity level (1-4).
4. **Execution plan** — Outline the specific steps that will be delegated in Phase 3, referencing the verified context.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has explicitly confirmed that all discovery data is complete.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (platform info, existing task state, complexity determination).
   - The specific Workflow steps the subagent is responsible for (e.g., "Create Memory Bank structure", "Update `tasks.md` with complexity determination").
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Recommended subagent types for `/van`:**
   - `memory-bank-specialist-fast` — for creating/updating Memory Bank files (`tasks.md`, `activeContext.md`)
   - `file-operations-fast` — for Memory Bank structure creation (if needed)
   - `validation-specialist-fast` — for verifying Memory Bank structure

2. **Subagents execute** — The spawned subagents perform all file creation and file editing operations (creating Memory Bank if needed, updating `tasks.md`, updating `activeContext.md`, etc.).
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

## Progressive Rule Loading

This command loads rules progressively to optimize context usage:

### Step 1: Load Core Rules (Always Required)
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/main.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/memory-bank-paths.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/platform-awareness.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/file-verification.mdc
```

### Step 2: Load VAN Mode Map
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/van_mode_split/van-mode-map.mdc
```

### Step 3: Load Complexity-Specific Rules (Based on Task Analysis)
After determining complexity level, load:
- **Level 1:** `cursor-memory-bank/.cursor/rules/isolation_rules/Level1/workflow-level1.mdc`
- **Level 2-4:** Load plan mode rules (transition to PLAN command)

## Workflow

1. **Platform Detection**
   - Detect operating system
   - Adapt commands for platform
   - Set path separators

2. **Memory Bank Verification**
   - Check if `memory-bank/` directory exists
   - If not, create Memory Bank structure
   - Verify essential files exist

3. **Task Analysis**
   - Read `memory-bank/tasks.md` if exists
   - Analyze task requirements
   - Determine complexity level (1-4)

4. **Route Based on Complexity**
   - **Level 1:** Continue in VAN mode, proceed to implementation
   - **Level 2-4:** Transition to `/plan` command

5. **Establish Task ID**
   - Generate or confirm task ID (e.g., HEALTH-002, UPGRADE-001, GEO-001)
   - Task ID will be used by downstream commands to create task-specific folders:
     - `/plan` → `memory-bank/plan/[task_id]/`
     - `/creative` → `memory-bank/creative/[task_id]/`
     - `/build` → `memory-bank/build/[task_id]/`
     - `/reflect` → `memory-bank/reflection/[task_id]/`

6. **Update Memory Bank**
   - Update `memory-bank/tasks.md` with complexity determination and task ID
   - Update `memory-bank/activeContext.md` with current focus

## Usage

Type `/van` followed by your task description or initialization request.

Example:
```
/van Initialize project for adding user authentication feature
```

## Next Steps

- **Level 1 tasks:** Proceed directly to `/build` command
- **Level 2-4 tasks:** Use `/plan` command for detailed planning
