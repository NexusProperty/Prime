# SETUP Command — Project Environment Bootstrap

> This command automates the setup of the Cursor AI development environment for a new project.
> It detects the cloned `cursor-memory-bank/`, merges it with the template configuration, and scaffolds all required directories.

## Prerequisites

Before running `/setup`, ensure:
1. You have a new project directory initialized with `git init`
2. The `cursor-project-template/` folder is accessible (either copied into the project or referenced from another location)
3. **Recommended:** Run `/integrate` first — it auto-detects your project and pre-populates memory bank files before setup runs
4. **Optional:** Clone the memory bank for progressive rule loading: `git clone https://github.com/vanzan/cursor-memory-bank.git cursor-memory-bank`

## What This Command Does

| Step | Action | Details |
|------|--------|---------|
| 1 | Verify cursor-memory-bank | Confirms the git clone exists and has expected structure |
| 2 | Set up .cursor/ directory | Creates agents/, commands/, rules/, skills/ |
| 3 | Merge commands | Copies template commands (van, plan, build, etc.) + adds this setup command |
| 4 | Merge rules | Copies template rules + links/copies cursor-memory-bank isolation rules |
| 5 | Copy agents | Copies all 22 agent definitions |
| 6 | Copy skills | Copies skill templates + README |
| 7 | Create memory-bank/ | Scaffolds from templates with placeholder content |
| 8 | Create Maunal/ | Scaffolds Orion analysis system |
| 9 | Copy root files | AGENTS.md, .cursorrules template |
| 10 | Verify & report | Checks all files exist, reports status |

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

### Phase 1: Discovery (MANDATORY Fast Subagent Delegation)

> **MANDATORY DELEGATION RULE:** The Main Agent MUST use the `Task` tool to spawn subagents for ALL discovery work.

The Main Agent spawns **2–3 parallel subagents** via the `Task` tool. ALL subagents MUST use `model: "fast"`.

**Subagent A — Memory Bank Scanner** (`codebase-scanner-fast`, `model: "fast"`)
- Verify `cursor-memory-bank/` directory exists
- Confirm expected structure:
  - `.cursor/commands/` — should contain van.md, plan.md, creative.md, build.md, reflect.md, archive.md
  - `.cursor/rules/isolation_rules/` — should contain Core/, Level1-4/, Phases/, visual-maps/
  - `README.md` — should exist
- Check for any custom modifications the user may have made
- Return: structure verification results, any anomalies

**Subagent B — Project State Scanner** (`codebase-scanner-fast`, `model: "fast"`)
- Scan the current project root for existing configuration:
  - Does `.cursor/` already exist? What's in it?
  - Does `memory-bank/` already exist? What's in it?
  - Does `Maunal/` already exist?
  - Does `AGENTS.md` exist?
  - Does `.cursorrules` exist?
  - Does `package.json` exist?
- Return: existing state, what needs to be created vs updated

**Subagent C — Template Scanner** (`codebase-scanner-fast`, `model: "fast"`)
- Locate the template files (check `cursor-project-template/` in project root or parent)
- Verify template integrity:
  - `cursor-config/agents/` — 22 agent files
  - `cursor-config/commands/` — 13 command files (including setup.md and integrate.md)
  - `cursor-config/rules/` — 9 rule files
  - `cursor-config/skills/` — skill entries + README
  - `memory-bank-templates/` — 10 template files
  - `maunal-templates/` — 2 template files
  - `AGENTS.md`, `cursorrules-template.md`
- Return: template verification, any missing files

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent reports and determines:

1. **Memory Bank Verification:**
   - Is `cursor-memory-bank/` present and complete?
   - If missing: STOP and instruct user to run `git clone`
   - If incomplete: WARN user about missing files

2. **Conflict Detection:**
   - If `.cursor/` already exists: determine merge strategy (backup existing → merge)
   - If `memory-bank/` already exists: skip scaffolding, warn user
   - If `AGENTS.md` already exists: ask user whether to overwrite

3. **Setup Plan:**
   - List every file that will be created or copied
   - List every directory that will be created
   - Identify any manual steps the user must complete after setup

4. **Present Setup Plan to User:**
   - Show what will be created/copied
   - Show what already exists and will be skipped
   - Confirm before proceeding (or auto-proceed if no conflicts)

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent MUST delegate ALL file operations to subagents.

The Main Agent spawns subagents to perform the setup:

**Subagent D — Directory Scaffolder** (`file-operations-fast`, `model: "fast"`)

Instructions for this subagent:

1. **Create .cursor/ structure:**
   ```
   .cursor/
   ├── agents/       ← Copy from cursor-project-template/cursor-config/agents/
   ├── commands/     ← Copy from cursor-project-template/cursor-config/commands/
   ├── rules/        ← Copy from cursor-project-template/cursor-config/rules/
   └── skills/       ← Copy from cursor-project-template/cursor-config/skills/
   ```

2. **Create memory-bank/ from templates:**
   ```
   memory-bank/
   ├── productContext.md      ← From memory-bank-templates/
   ├── techContext.md          ← From memory-bank-templates/
   ├── systemPatterns.md       ← From memory-bank-templates/
   ├── projectbrief.md         ← From memory-bank-templates/
   ├── activeContext.md        ← From memory-bank-templates/
   ├── tasks.md                ← From memory-bank-templates/
   ├── progress.md             ← From memory-bank-templates/
   ├── decisionLog.md          ← From memory-bank-templates/
   ├── learnings.md            ← From memory-bank-templates/
   ├── session-template.md     ← From memory-bank-templates/
   ├── archive/
   ├── build/
   ├── plan/
   ├── creative/
   ├── reflection/
   └── van/
   ```

3. **Create Maunal/ from templates:**
   ```
   Maunal/
   ├── CONTEXT.md    ← From maunal-templates/
   └── README.md     ← From maunal-templates/
   ```

4. **Copy root files:**
   - `AGENTS.md` ← From template
   - `.cursorrules` ← From `cursorrules-template.md` (rename, user customizes later)

**Subagent E — Verification** (`validation-specialist-fast`, `model: "fast"`)

After Subagent D completes, verify:
1. All expected files exist in `.cursor/agents/` (22 files)
2. All expected files exist in `.cursor/commands/` (11 files including setup.md)
3. All expected files exist in `.cursor/rules/` (9 files)
4. All expected skill files exist
5. All memory-bank template files exist
6. Maunal directory is set up
7. `AGENTS.md` exists at root
8. `.cursorrules` exists at root
9. `cursor-memory-bank/` is intact
10. No orphaned or conflicting files

---

## Post-Setup: What Needs Manual Customization

After `/setup` completes, the user must:

### Required (do these first)
1. **Edit `.cursorrules`** — Replace all `[PLACEHOLDER]` values with your project details
2. **Edit `memory-bank/productContext.md`** — Describe your product, personas, features
3. **Edit `memory-bank/techContext.md`** — List your tech stack, APIs, services
4. **Edit `memory-bank/systemPatterns.md`** — Document your architecture patterns
5. **Edit `memory-bank/projectbrief.md`** — Write a brief project overview

### Optional
6. **Customize glob-based rules** — Update `api-data-fetching.mdc`, `auth-patterns.mdc`, `e2e-testing.mdc`, `react-patterns.mdc`, `ui-styling.mdc` for your project
7. **Install user-level skills** — Copy `user-level-skills/` to `~/.cursor/skills-cursor/`
8. **Set up CI/CD** — Configure GitHub Actions if needed
9. **Configure Supabase/services** — Set up external services and `.env`

### Verification
10. **Run `/van`** — Verify the system initializes and reads memory bank
11. **Run `/plan`** — Verify planning workflow works

---

## Workflow

```
User: git init my-new-project
User: cd my-new-project
User: git clone https://github.com/vanzan/cursor-memory-bank.git cursor-memory-bank
User: (copy cursor-project-template/ into project)
User: /setup
       ↓
Phase 1: Scan cursor-memory-bank/ + project state + template
       ↓
Phase 2: Review & plan setup
       ↓
Phase 3: Create .cursor/, memory-bank/, Maunal/, root files
       ↓
Report: What was created, what needs manual customization
       ↓
User: Fill in memory-bank files, customize .cursorrules
       ↓
User: /van (verify setup works)
```

---

## Usage

```
/setup
```

No arguments needed. The command auto-detects the project state and template location.

---

## Recovery

If setup fails or produces unexpected results:
1. Delete the created directories (`.cursor/`, `memory-bank/`, `Maunal/`)
2. Fix the issue (usually missing cursor-memory-bank clone or template)
3. Re-run `/setup`

The command is idempotent for directories — it will skip files that already exist unless the user explicitly requests overwrite.

---

## Relationship to Other Commands

| Command | Relationship |
|---------|-------------|
| `/integrate` | Run BEFORE `/setup` — auto-detects project, generates cursor-integration.json |
| `/van` | Run AFTER `/setup` to verify and initialize |
| `/plan` | Run AFTER `/van` to start first task |
| `/orion` | Available after setup for ad-hoc analysis |
| `/qa` | Available after setup for quality checks |

---

## Notes

- The `cursor-memory-bank/` directory provides the isolation rules and workflow engine that commands depend on
- The template provides agents, enhanced commands, project-level rules, and skills that cursor-memory-bank does not include
- Together they form the complete AI development environment
- Commands in `.cursor/commands/` reference `cursor-memory-bank/.cursor/rules/isolation_rules/` for progressive rule loading
