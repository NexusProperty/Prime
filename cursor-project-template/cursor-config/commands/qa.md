# QA Command - Technical Validation & Quality Assurance

This command performs technical validation before BUILD mode, ensuring dependencies, configuration, environment, and build functionality are ready for implementation.

## Memory Bank Integration

**CRITICAL:** All Memory Bank files are located in `memory-bank/` directory:
- `memory-bank/tasks.md` - Source of truth for task tracking
- `memory-bank/activeContext.md` - Current focus
- `memory-bank/progress.md` - Implementation status
- `memory-bank/systemPatterns.md` - Technology choices from CREATIVE phase
- `memory-bank/.qa_validation_status` - QA validation result

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/qa` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `explore` with `model: fast` — for Memory Bank and configuration file scanning
> - `codebase-scanner-fast` — for project configuration and dependency analysis
> - `deployment-monitoring-engineer-fast` — for environment and build tool checks
> - `type-system-guardian-fast` — for TypeScript configuration validation

1. **Scan Memory Bank files** listed under "Memory Bank Integration" (above).
   - Read `memory-bank/tasks.md` for task tracking.
   - Read `memory-bank/activeContext.md` for current focus.
   - Read `memory-bank/progress.md` for implementation status.
   - Read `memory-bank/systemPatterns.md` for technology choices from CREATIVE phase.
   - Check if `memory-bank/.qa_validation_status` exists (previous QA result).
2. **Scan project configuration** — check for `package.json`, build config files, and environment setup.
3. **Collect file summaries** — each subagent returns a structured summary of what it found (file exists / missing, key content highlights, any anomalies).

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs a holistic review:

1. **Completeness check** — Verify that every file listed was successfully scanned. Note any missing or unreadable files.
2. **Context synthesis** — Combine the subagent findings into a single understanding of: technology stack, current task state, and environment readiness.
3. **Prerequisite validation** — Confirm the current workflow stage (e.g., after CREATIVE, before BUILD). If out of sequence, inform the user.
4. **Execution plan** — Outline the four-point validation process that will be delegated in Phase 3.

> **Review gate:** The Main Agent must NOT proceed to Phase 3 until it has explicitly confirmed that all discovery data is complete.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent is **forbidden** from directly performing any file operation (creation, editing, deletion) at any point during Phase 3 — including initial execution, corrections, and follow-up tasks. It **must** use the `Task` tool to spawn subagents for ALL file modifications. The Main Agent's sole role in Phase 3 is to orchestrate, delegate, and verify — never to execute.

Only after the Review phase passes does the Main Agent proceed as follows:

1. **Delegate via `Task` tool** — The Main Agent spawns subagent(s) using the `Task` tool. Each subagent prompt must include:
   - The full verified context gathered in Phase 2 (technology stack, dependencies, configuration).
   - The specific validation steps the subagent is responsible for (dependency verification, configuration validation, environment validation, build test).
   - The project's Primary Rule preamble (per `AGENTS.md` §4a) so the subagent inherits the Read-Verify-Edit protocol.
   
   **Recommended subagent types for `/qa`:**
   - `deployment-monitoring-engineer-fast` — for running the four-point validation process
   - `validation-specialist-fast` — for configuration and environment validation
   - `memory-bank-specialist-fast` — for creating/updating `.qa_validation_status` file
2. **Subagents execute** — The spawned subagents perform the four-point validation and create/update the `.qa_validation_status` file.
3. **Main Agent verifies** — After all subagents return, the Main Agent reads the validation results to confirm correctness and completeness.
4. **Follow-up delegation loop** — If verification reveals incomplete validation or issues:
   - The Main Agent identifies exactly what needs to be re-checked or fixed.
   - The Main Agent spawns a new subagent via the `Task` tool with specific instructions to perform the follow-up work.
   - The Main Agent **does NOT** perform the follow-up edits itself — this is a hard rule.
   - After the follow-up subagent returns, repeat step 3 (verify again).
   - Continue this loop until all validation is complete.

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
```

### Step 2: Load QA Validation Map
```
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/van_mode_split/van-qa-validation.md.old
Load: cursor-memory-bank/.cursor/rules/isolation_rules/visual-maps/van_mode_split/van-qa-main.mdc
```

## QA Command Precedence

**CRITICAL:** The QA command can be called at ANY point and takes **IMMEDIATE PRECEDENCE** over all other operations.

When user types `QA` or `VAN QA`:
1. **Pause current task/process** (including forced mode switches)
2. **Load QA validation maps**
3. **Execute full QA validation process**
4. **Address any failures before continuing**
5. **Resume previous process flow** after QA passes

```
⚠️ QA OVERRIDE ACTIVATED
All other processes paused
QA validation checks now running...
Any issues found MUST be remediated before continuing with normal process flow
```

## Workflow

### When to Use This Command

Use QA validation:
- **After CREATIVE mode** and before BUILD mode (recommended workflow)
- **Any time** you want to verify technical readiness
- **Before major implementation** to catch issues early
- **After fixing technical issues** to re-validate

### Four-Point Validation Process

The QA validation consists of four key checkpoints:

```
1️⃣ DEPENDENCY VERIFICATION
   - Check all required packages are installed
   - Verify version compatibility
   - Install missing dependencies

2️⃣ CONFIGURATION VALIDATION
   - Verify configuration file format
   - Check platform compatibility
   - Validate syntax (JSON, JS, TS configs)

3️⃣ ENVIRONMENT VALIDATION
   - Check build tools availability
   - Verify permissions and access
   - Ensure ports are available

4️⃣ MINIMAL BUILD TEST
   - Create minimal test project
   - Attempt build process
   - Run basic functionality test
```

## Integration with Design Decisions

QA validation reads technology choices from the CREATIVE phase:
- Reads `memory-bank/systemPatterns.md`
- Extracts framework, UI library, state management choices
- Builds validation plan based on technology stack

## Validation Report Formats

### Success Report
```
╔═════════════════ 🔍 QA VALIDATION STATUS ═════════════════╗
│ ✓ Design Decisions   │ Verified as implementable          │
│ ✓ Dependencies       │ All required packages installed    │
│ ✓ Configurations     │ Format verified for platform       │
│ ✓ Environment        │ Suitable for implementation        │
╚════════════════════════════════════════════════════════════╝
✅ VERIFIED - Clear to proceed to BUILD mode
```

### Failure Report
```
⚠️⚠️⚠️ QA VALIDATION FAILED ⚠️⚠️⚠️

The following issues must be resolved before proceeding to BUILD mode:

1️⃣ DEPENDENCY ISSUES:
- [Detailed description of dependency issues]
- [Recommended fix]

2️⃣ CONFIGURATION ISSUES:
- [Detailed description of configuration issues]
- [Recommended fix]

3️⃣ ENVIRONMENT ISSUES:
- [Detailed description of environment issues]
- [Recommended fix]

4️⃣ BUILD TEST ISSUES:
- [Detailed description of build test issues]
- [Recommended fix]

⚠️ BUILD MODE IS BLOCKED until these issues are resolved.
Type 'QA' or 'VAN QA' after fixing the issues to re-validate.
```

## Build Mode Prevention

**CRITICAL:** The system prevents moving to BUILD mode without passing QA validation.

When user attempts to enter BUILD mode:
1. Check if QA validation has been completed
2. Check if QA validation passed
3. If NO or FAILED: Block BUILD mode and display warning
4. If YES and PASSED: Allow BUILD mode to proceed

```
🚫 BUILD MODE BLOCKED: QA VALIDATION REQUIRED
⚠️ You must complete QA validation before proceeding to BUILD mode

Type 'QA' or 'VAN QA' to perform technical validation

🚫 NO IMPLEMENTATION CAN PROCEED WITHOUT VALIDATION 🚫
```

## Common QA Validation Fixes

### Dependency Issues:
- **Missing Node.js**: Install Node.js from https://nodejs.org/
- **Outdated npm**: Run `npm install -g npm@latest` to update
- **Missing packages**: Run `npm install` or `npm install [package-name]`

### Configuration Issues:
- **Invalid JSON**: Use a JSON validator to check syntax
- **Missing React plugin**: Add `import react from '@vitejs/plugin-react'` and `plugins: [react()]` to vite.config.js
- **Incompatible TypeScript config**: Update `tsconfig.json` with correct React settings

### Environment Issues:
- **Permission denied**: Run terminal as administrator (Windows) or use sudo (Mac/Linux)
- **Port already in use**: Kill process using the port or change the port in configuration
- **Missing build tools**: Install required command-line tools (git, etc.)

### Build Test Issues:
- **Build fails**: Check console for specific error messages
- **Test fails**: Verify minimal configuration is correct
- **Path issues**: Ensure paths use correct separators for the platform

## Usage

Type `QA` or `VAN QA` to start technical validation.

**After CREATIVE mode:**
```
User: VAN QA

Response: OK VAN QA - Beginning Technical Validation
Loading QA Validation map...
```

**As priority override (anytime):**
```
User: QA

Response: OK QA - Initiating Priority Validation Override
All other processes paused
Running four-point validation...
```

## Validation Status Storage

After QA validation completes, the result is stored in:
- `memory-bank/.qa_validation_status` - Quick status flag (PASS/FAIL)

For Level 3-4 tasks, detailed QA reports are stored in the task-specific folder:
- `memory-bank/plan/[task_id]/qa-[task_id].md` - Detailed QA validation report

Content of `.qa_validation_status`:
- `PASS` - All validations passed, BUILD mode allowed
- `FAIL` - One or more validations failed, BUILD mode blocked

## Checkpoint Template

```
✓ SECTION CHECKPOINT: QA VALIDATION
- Dependency Verification Passed? [YES/NO]
- Configuration Validation Passed? [YES/NO]
- Environment Validation Passed? [YES/NO]
- Minimal Build Test Passed? [YES/NO]

→ If all YES: Ready for BUILD mode
→ If any NO: Fix identified issues before proceeding
```

## Next Steps

- **On PASS:** Proceed to BUILD mode (`/build` command)
- **On FAIL:** Fix identified issues and re-run QA validation
- **After fixing:** Type `QA` or `VAN QA` to re-validate

## Process Flow

```
CREATIVE MODE → VAN QA MODE → BUILD MODE
                    ↓
            [Four-Point Validation]
                    ↓
               PASS/FAIL?
                ↓     ↓
              BUILD  FIX → Re-run QA
```
