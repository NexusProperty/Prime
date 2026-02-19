# REFLECT Command - Task Reflection

This command facilitates structured reflection on completed implementation, documenting lessons learned and process improvements.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/reflect` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `explore` with `model: fast` — for Memory Bank file scanning
> - `codebase-scanner-fast` — for implementation context gathering
> - `memory-bank-specialist-fast` — for analyzing task and progress files

1. **Scan Memory Bank files** listed under "Memory Bank Integration → Reads from" (below).
   - Read `memory-bank/tasks.md` for completed implementation details.
   - Read `memory-bank/progress.md` for implementation status and observations.
   - Read `memory-bank/creative/creative-*.md` for design decisions (Level 3-4).
2. **Scan target output paths** — confirm `memory-bank/reflection/` directory exists and check for naming conflicts with the reflection file to be created.
3. **Collect file summaries** — each subagent returns a structured summary of what it found (file exists / missing, key content highlights, any anomalies).

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify that every file listed under "Reads from" was successfully scanned. If any file is missing or unreadable, halt and report to the user before proceeding.
2. **Context synthesis** — Combine the subagent findings into a single understanding of the current task state: task ID, complexity level, implementation status, and any creative-phase artifacts.
3. **Prerequisite validation** — Confirm that all preconditions for the command are satisfied (e.g., implementation is complete for `/reflect`). If a precondition fails, inform the user and suggest the corrective command (e.g., `/build`).
4. **Execution plan** — Outline the specific steps that will be delegated in Phase 3, referencing the verified context.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has explicitly confirmed that all discovery data is complete and all preconditions are met.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (task ID, complexity level, implementation details).
   - The specific Workflow steps the subagent is responsible for (e.g., "Create the reflection document at `memory-bank/reflection/[task_id]/reflection-[task_id].md` with the following structure…").
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Recommended subagent types for `/reflect`:**
   - `memory-bank-specialist-fast` — for creating reflection documents
   - `file-operations-fast` — for updating Memory Bank files
   - `validation-specialist-fast` — for verifying reflection document structure

2. **Subagents execute** — The spawned subagents perform all file creation and file editing operations (creating the reflection document, updating `tasks.md`, etc.).
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
- `memory-bank/tasks.md` - Completed implementation details
- `memory-bank/progress.md` - Implementation status and observations
- `memory-bank/creative/creative-*.md` - Design decisions (Level 3-4)

Creates:
- `memory-bank/reflection/[task_id]/` - Task-specific folder
- `memory-bank/reflection/[task_id]/reflection-[task_id].md` - Main reflection document

Updates:
- `memory-bank/tasks.md` - Reflection status
- `memory-bank/learnings.md` - Session counts for patterns observed during implementation

## Progressive Rule Loading

### Step 1: Load Core Rules
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/main.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/memory-bank-paths.mdc
```

### Step 2: Load REFLECT Mode Map
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/reflect-mode-map.mdc
```

### Step 3: Load Complexity-Specific Reflection Rules
Based on complexity level from `memory-bank/tasks.md`:

**Level 1:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level1/quick-documentation.mdc
```

**Level 2:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level2/reflection-basic.mdc
```

**Level 3:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level3/reflection-intermediate.mdc
```

**Level 4:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level4/reflection-comprehensive.mdc
```

## Workflow

1. **Verify Implementation Complete**
   - Check `memory-bank/tasks.md` for implementation completion
   - If not complete, return to `/build` command

2. **Create Task Folder Structure**
   - Create folder: `memory-bank/reflection/[task_id]/`
   - Use task ID from `memory-bank/tasks.md`
   - Folder should match the task ID used in plan, creative, and build folders

3. **Review Implementation**
   - Compare implementation against original plan
   - Review creative phase decisions (Level 3-4)
   - Review code changes and testing

4. **Skill Candidate Check**

   > **Integration:** CC-018 Skill Extraction System

   After reviewing implementation, check for skill candidates:

   1. **Read `memory-bank/learnings.md`** — Look for entries with Skill Status = `candidate`
   2. **Note Candidates** — If candidates exist, include in reflection summary:
      ```markdown
      ## Skill Candidates Detected

      The following patterns are ready for skill extraction:
      | Pattern | Sessions | Category |
      |---------|----------|----------|
      | [Name] | [N] | [Category] |

      Run `/skillify` after `/archive` to extract these patterns.
      ```
   3. **New Patterns** — If this session introduced a recurring pattern, update `learnings.md` session count

5. **Document Reflection**

   **Level 1:**
   - Quick review of bug fix
   - Document solution

   **Level 2:**
   - Review enhancement
   - Document what went well
   - Document challenges
   - Document lessons learned

   **Level 3-4:**
   - Comprehensive review of implementation
   - Compare against original plan
   - Document what went well
   - Document challenges encountered
   - Document lessons learned
   - Document process improvements
   - Document technical improvements

6. **Create Reflection Document**
   - Create `memory-bank/reflection/[task_id]/reflection-[task_id].md`
   - Structure: Summary, What Went Well, Challenges, Lessons Learned, Process Improvements, Technical Improvements, Next Steps

7. **Update Memory Bank**
   - Update `memory-bank/tasks.md` with reflection status
   - Mark reflection phase as complete

## Usage

Type `/reflect` to start reflection on the completed task.

## Next Steps

After reflection complete, proceed to `/archive` command to finalize task documentation.
