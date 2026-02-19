# ARCHIVE Command - Task Archiving

This command creates comprehensive archive documentation by discovering, consolidating, and summarizing all task-related files, then updates the Memory Bank for future reference.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/archive` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context. **This phase is critical for `/archive`** as it must discover ALL files related to the completed task.

> **Recommended subagent types:**
> - `explore` with `model: fast` — for broad Memory Bank file scanning and task-related file discovery
> - `codebase-scanner-fast` — for structured discovery across the entire project
> - `memory-bank-specialist-fast` — for Memory Bank file analysis and task folder scanning

#### 1.1 Scan Task-Specific Folders

Using the task ID from `memory-bank/tasks.md`, scan all task-specific folders:

- `memory-bank/plan/[task_id]/` — All planning documents
- `memory-bank/creative/[task_id]/` — All creative phase documents
- `memory-bank/build/[task_id]/` — All build/implementation documents
- `memory-bank/reflection/[task_id]/` — All reflection documents

#### 1.2 Search for Related Files

Deploy fast subagents to search for ANY other files related to the task:

- **Pattern search:** Files matching `*[task_id]*` anywhere in the project
- **Root-level files:** Check project root for task-related reports (e.g., `[TASK_ID]-COMPLETION-REPORT.md`)
- **Docs folder:** Scan `docs/` for task-related documentation
- **Progress files:** Scan `memory-bank/progress/` for task-specific progress logs
- **Legacy locations:** Check for files that may have been created before folder organization was implemented

#### 1.3 Collect File Inventory

Each subagent returns a structured inventory:
```
Task ID: [task_id]
Files Found:
  - path/to/file1.md (size, last modified)
  - path/to/file2.md (size, last modified)
  ...
Recommended Action:
  - CONSOLIDATE: Files that should be merged into archive
  - MOVE: Files that should be moved to archive folder
  - SUMMARIZE: Large files that should be summarized
  - DELETE: Redundant files after consolidation
```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify that all task-specific folders were scanned:
   - `memory-bank/plan/[task_id]/` scanned? 
   - `memory-bank/creative/[task_id]/` scanned?
   - `memory-bank/build/[task_id]/` scanned?
   - `memory-bank/reflection/[task_id]/` scanned?
   - Pattern search for `*[task_id]*` completed?

2. **File inventory review** — Review the complete list of discovered files:
   - Count total files found
   - Identify files to CONSOLIDATE vs MOVE vs SUMMARIZE vs DELETE
   - Flag any unexpected files or locations

3. **Context synthesis** — Combine the subagent findings into:
   - Complete task overview (ID, complexity, status)
   - List of all source files with recommended actions
   - Consolidation strategy (what goes into main archive vs separate reports)

4. **Prerequisite validation** — Confirm:
   - Reflection is complete (reflection folder/files exist)
   - No active work in progress on this task
   - Archive folder doesn't already exist (or confirm overwrite)

5. **Consolidation plan** — Create explicit plan for Phase 3:
   - Which files will be consolidated into `archive-[task_id].md`
   - Which files need a separate `CONSOLIDATED-REPORT.md`
   - Which files will be moved as-is
   - Which files/folders will be deleted after archiving

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has a complete file inventory and consolidation plan.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (task ID, complexity level, file inventory, consolidation plan).
   - The specific Workflow steps the subagent is responsible for.
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Recommended subagent types for `/archive`:**
   - `explore` with `model: fast` — for discovering additional related files during execution
   - `memory-bank-specialist-fast` — for creating archive documents and consolidating content
   - `file-operations-fast` — for:
     - Creating archive folder structure
     - Moving files to archive folder
     - Deleting source folders after consolidation
     - Batch updates to Memory Bank files
   - `documentation-manager-fast` — for summarizing large documents into consolidated reports
   - `validation-specialist-fast` — for pre-verification and confirming cleanup is complete
2. **Subagents execute** — The spawned subagents perform all file creation and file editing operations (creating the archive document, updating `tasks.md`, `progress.md`, `activeContext.md`, etc.).
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
- `memory-bank/tasks.md` - Complete task details, checklists, and task ID
- `memory-bank/learnings.md` - Check for skill candidates before archive
- `memory-bank/plan/[task_id]/` - All planning documents in task folder
- `memory-bank/creative/[task_id]/` - All creative phase documents in task folder
- `memory-bank/build/[task_id]/` - All build documents in task folder
- `memory-bank/reflection/[task_id]/` - All reflection documents in task folder
- `memory-bank/progress.md` - Implementation status
- Any other files matching `*[task_id]*` pattern across the project

Creates:
- `memory-bank/archive/[task_id]/` - Task-specific archive folder
- `memory-bank/archive/[task_id]/archive-[task_id].md` - Main archive document
- `memory-bank/archive/[task_id]/CONSOLIDATED-REPORT.md` - (Optional) Consolidated report from multiple source files

Moves/Consolidates:
- All files from `memory-bank/plan/[task_id]/` → archived or consolidated
- All files from `memory-bank/creative/[task_id]/` → archived or consolidated
- All files from `memory-bank/build/[task_id]/` → archived or consolidated
- All files from `memory-bank/reflection/[task_id]/` → archived or consolidated
- Any root-level task reports → moved to archive folder

Updates:
- `memory-bank/tasks.md` - Mark task as COMPLETE, remove task details
- `memory-bank/progress.md` - Add archive reference
- `memory-bank/activeContext.md` - Reset for next task

## Progressive Rule Loading

### Step 1: Load Core Rules
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/main.mdc
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Core/memory-bank-paths.mdc
```

### Step 2: Load ARCHIVE Mode Map
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/archive-mode-map.mdc
```

### Step 3: Load Complexity-Specific Archive Rules
Based on complexity level from `memory-bank/tasks.md`:

**Level 1:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level1/quick-documentation.mdc
```

**Level 2:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level2/archive-basic.mdc
```

**Level 3:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level3/archive-intermediate.mdc
```

**Level 4:**
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/Level4/archive-comprehensive.mdc
```

## Workflow

1. **Verify Reflection Complete**
   - Check that `memory-bank/reflection/[task_id]/reflection-[task_id].md` exists
   - Verify reflection is complete
   - If not complete, return to `/reflect` command

2. **Create Archive Folder Structure**
   - Create folder: `memory-bank/archive/[task_id]/`
   - This folder will contain all archived materials for this task

3. **Discover All Related Files**
   
   Deploy fast subagents to search for ALL task-related files:
   
   ```
   Search Locations:
   ├── memory-bank/plan/[task_id]/        → All planning docs
   ├── memory-bank/creative/[task_id]/    → All creative docs
   ├── memory-bank/build/[task_id]/       → All build docs
   ├── memory-bank/reflection/[task_id]/  → All reflection docs
   ├── memory-bank/progress/              → Task-specific progress logs
   ├── docs/                              → Task-related documentation
   ├── project root                       → Task reports (e.g., [TASK_ID]-*.md)
   └── anywhere matching *[task_id]*      → Any other related files
   ```
   
   For each file found, determine action:
   - **CONSOLIDATE**: Merge content into archive document
   - **MOVE**: Move file to archive folder as-is
   - **SUMMARIZE**: Extract key points for large files
   - **DELETE**: Remove after consolidation (redundant copies)

4. **Consolidate and Summarize**

   **Level 1:**
   - Create quick summary from available files
   - Move any related files to archive folder
   
   **Level 2:**
   - Create basic archive document consolidating:
     - Planning notes
     - Implementation details
     - Reflection summary
   - Move source files to archive folder or delete after consolidation
   
   **Level 3-4:**
   - Create comprehensive archive document consolidating ALL sources:
     - Planning documents → summarized into "Planning" section
     - Creative phase documents → summarized into "Design Decisions" section
     - Build phase documents → summarized into "Implementation" section
     - Reflection documents → summarized into "Lessons Learned" section
     - Progress logs → summarized into "Timeline" section
   - For large files: create `CONSOLIDATED-REPORT.md` with full details
   - Move or delete source files after consolidation
   - Keep archive folder clean and organized

5. **Skill Extraction Prompt**

   > **Integration:** CC-018 Skill Extraction System

   Before finalizing the archive, check for skill candidates:

   1. **Read `memory-bank/learnings.md`** — Look for entries with Skill Status = `candidate`
   2. **Prompt User** — If candidates exist:
      ```markdown
      ## Skill Candidates Available
      
      You have [N] pattern(s) ready for skill extraction:
      
      | Pattern | Sessions | First Observed |
      |---------|----------|----------------|
      | [Name] | [N] | [Date] |
      
      **Options:**
      - Run `/skillify` now to extract these patterns
      - Type "skip" to archive without extraction
      - Candidates will remain available for future extraction
      ```
   3. **Handle Response:**
      - If user runs `/skillify` — pause archive, complete skill extraction, then resume
      - If user skips — continue with archive, candidates remain in `learnings.md`

6. **Archive Document Structure**
   ```
   # TASK ARCHIVE: [Task Name]
   
   ## METADATA
   - Task ID, dates, complexity level
   - Files consolidated: [count]
   - Source locations: [list]
   
   ## SUMMARY
   Brief overview of the task
   
   ## PLANNING
   Consolidated planning decisions (from plan/[task_id]/)
   
   ## DESIGN DECISIONS
   Consolidated creative phase decisions (from creative/[task_id]/)
   
   ## IMPLEMENTATION
   Consolidated build details (from build/[task_id]/)
   
   ## TESTING
   How the solution was verified
   
   ## LESSONS LEARNED
   Key takeaways (from reflection/[task_id]/)
   
   ## ARCHIVED FILES
   List of files that were consolidated or moved:
   - [filename] → consolidated/moved/deleted
   ```

7. **Cleanup Task Folders**
   - After consolidation, clean up source folders:
     - `memory-bank/plan/[task_id]/` → delete folder after archiving
     - `memory-bank/creative/[task_id]/` → delete folder after archiving
     - `memory-bank/build/[task_id]/` → delete folder after archiving
     - `memory-bank/reflection/[task_id]/` → delete folder after archiving
   - Delete any root-level task files that were consolidated

8. **Update Memory Bank**
   - Create `memory-bank/archive/[task_id]/archive-[task_id].md`
   - Mark task as COMPLETE in `memory-bank/tasks.md`
   - Update `memory-bank/progress.md` with archive reference
   - Reset `memory-bank/activeContext.md` for next task
   - Clear completed task details from `memory-bank/tasks.md` (keep structure)

## Usage

Type `/archive` to archive the completed task after reflection is done.

## Next Steps

After archiving complete, use `/van` command to start the next task.