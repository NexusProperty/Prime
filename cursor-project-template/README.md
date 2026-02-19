# Cursor AI Development Environment — Project Template

> A reusable project template containing a complete AI-assisted development environment. Drop this folder into any project to bootstrap Cursor AI with agents, commands, rules, memory bank, and governance.

## What's Included

### 1. `.cursor/` — AI Agent Configuration
- **22 Subagents** — Specialized AI agents for different tasks (scanning, testing, building, etc.)
- **13 Slash Commands** — `/integrate`, `/setup`, `/setup-scan`, `/van`, `/plan`, `/creative`, `/build`, `/reflect`, `/archive`, `/orion`, `/qa`, `/security`, `/skillify`
- **9 Rule Files** — Coding conventions, anti-hallucination, patterns (generic templates — customize per project)
- **Skills** — Reusable patterns (create your own for new projects)
- **RULES_ANALYSIS.md** — Analysis of rule coverage

### 2. `AGENTS.md` — Composer Constitution
The supreme governance layer for AI agents. Defines:
- Identity binding (prevents hallucination)
- Verification layer (read-before-edit protocol)
- Prohibited behaviors
- Error recovery protocol
- Sub-agent governance

### 3. `memory-bank/` — AI Long-Term Memory
Template files for the memory bank system. The AI uses these to understand your project:
- `productContext.md` — What your product does
- `techContext.md` — Your technology stack
- `systemPatterns.md` — Architecture patterns
- `projectbrief.md` — Project overview
- `activeContext.md` — Current work focus
- `tasks.md` — Task tracking
- `progress.md` — Implementation progress
- `decisionLog.md` — Architecture decisions
- `learnings.md` — Learned patterns
- `session-template.md` — Session summary template

### 4. `Maunal/` — Ad-hoc Analysis System
Template files for the Orion analysis system:
- `CONTEXT.md` — Cross-session tracking
- `README.md` — System documentation

## Quick Setup

### Recommended: Use `/integrate` then `/setup`

```bash
# 1. Drop cursor-project-template/ into your project root
cp -r /path/to/cursor-project-template/* /path/to/your-project/

# 2. Open your project in Cursor, then run:
/integrate
# This auto-detects your framework, stack, and conventions.
# Outputs: cursor-integration.json, .cursorrules draft, pre-populated memory-bank/

# 3. Review and edit:
#    - cursor-integration.json (verify auto-detected settings)
#    - .cursorrules (customize to your project)
#    - memory-bank/*.md (complete the placeholders)

# 4. Run setup to finalize:
/setup
```

### Manual Setup (5 Steps)

#### Step 1: Copy to New Project
```bash
mkdir my-project && cd my-project
git init

# Copy template contents
cp -r /path/to/cursor-project-template/* .
```

#### Step 2: Scaffold the Structure
The template provides `cursor-config/` (becomes `.cursor/`) and template directories. The `/setup` command installs them.

#### Step 3: Fill Memory Bank
Edit these files with YOUR project details:
1. `memory-bank/productContext.md` — Product goals, personas, features
2. `memory-bank/techContext.md` — Tech stack, APIs, database
3. `memory-bank/systemPatterns.md` — Architecture, conventions
4. `memory-bank/projectbrief.md` — Brief overview

#### Step 4: Customize Rules
Edit `.cursorrules` to reference YOUR project's:
- Technology stack
- File structure conventions
- Critical rules
- Pre-commit checklist

#### Step 5: Test the Setup
Open Cursor and type `/van` — the system should initialize and read your memory bank files.

---

## File Customization Guide

### Files to Keep As-Is (Generic — work for any project)
- `AGENTS.md`
- `.cursor/agents/*` (all 22 agents)
- `.cursor/commands/*` (all 13 commands)
- `.cursor/rules/000-composer-primary.mdc`
- `.cursor/rules/anti-hallucination.mdc`
- `.cursor/rules/context-compaction.mdc`
- `.cursor/rules/team-coordination.mdc`
- `.cursor/skills/README.md`
- `memory-bank/session-template.md`

### Files to Customize (Project-Specific)
- `.cursorrules` — Update with your tech stack, conventions, pre-commit checks
- `.cursor/rules/api-data-fetching.mdc` — Update with your data fetching patterns
- `.cursor/rules/auth-patterns.mdc` — Update with your auth approach and component names
- `.cursor/rules/e2e-testing.mdc` — Update with your test conventions and helper functions
- `.cursor/rules/react-patterns.mdc` — Update with your component patterns (or replace entirely for non-React)
- `.cursor/rules/ui-styling.mdc` — Update with your design system tokens and conventions
- All `memory-bank/*.md` files — Fill with project content

### Files to Create Fresh
- `.cursor/skills/[your-skills]/` — Project-specific skills you discover
- `memory-bank/archive/` subdirectories (created by /archive command)
- `Maunal/ORION-*/` folders (created by /orion command)
- `cursor-integration.json` (created by /integrate command)

---

## Development Workflow

```
/integrate → /setup → /van → /plan → /creative → /build → /reflect → /archive
```

1. **`/integrate`** — Auto-detect project framework and stack. Generates `cursor-integration.json` and pre-populates memory bank. **Run this first on new projects.**
2. **`/setup`** — Automated project bootstrapping. Installs agents, commands, rules, skills.
3. **`/van`** — Start task. Detects complexity (1-4), routes to workflow.
4. **`/plan`** — Plan implementation (Level 2+). Creates phased approach.
5. **`/creative`** — Design exploration (Level 3+). UI/UX decisions.
6. **`/build`** — Implement solution. Test-driven, delegated to subagents.
7. **`/reflect`** — Post-implementation. Capture lessons learned.
8. **`/archive`** — Archive completed work. Update memory bank.

### Additional Commands
- **`/setup-scan`** — Audit existing project state (read-only)
- **`/orion`** — Ad-hoc analysis of files/folders → Maunal/ reports
- **`/qa`** — QA validation (deps, config, env, build)
- **`/security`** — OWASP security review
- **`/skillify`** — Extract reusable patterns into skills

---

## User-Level Skills (Install Once Per Machine)

Copy these to `C:\Users\[USERNAME]\.cursor\skills-cursor\` (Windows) or `~/.cursor/skills-cursor/` (Mac/Linux):

| Skill | Purpose |
|-------|---------|
| `create-rule/` | Create new Cursor rules |
| `create-skill/` | Create new Agent Skills |
| `create-subagent/` | Create custom subagents |
| `migrate-to-skills/` | Convert rules/commands to skills |
| `update-cursor-settings/` | Update Cursor IDE settings |

---

## Architecture Overview

```
.cursor/
├── agents/          # 22 specialized AI subagents
├── commands/        # 13 slash commands (workflow orchestration)
├── rules/           # 9 coding convention rules (generic — customize per project)
└── skills/          # Reusable AI patterns

memory-bank/         # AI long-term memory
├── productContext.md
├── techContext.md
├── systemPatterns.md
├── projectbrief.md
├── activeContext.md
├── tasks.md
├── progress.md
├── decisionLog.md
├── learnings.md
├── session-template.md
├── archive/         # Completed work
├── build/           # Build reports
├── plan/            # Implementation plans
├── creative/        # Design documents
├── reflection/      # Post-implementation
└── van/             # VAN outputs

Maunal/              # Ad-hoc analysis (Orion system)
├── CONTEXT.md       # Cross-session tracking
└── ORION-NNN/       # Per-session folders

cursor-integration.json  # Auto-generated by /integrate (project-specific config)
AGENTS.md            # Composer constitution
.cursorrules         # Project-level rules (generated by /integrate, customized by you)
```

---

## Framework Support

This template works with any project. The rules and agents auto-adapt:

| Framework | Notes |
|-----------|-------|
| React + Vite | Full support — react-patterns.mdc applies |
| Next.js (App Router) | Full support — adjust routing patterns in systemPatterns.md |
| Next.js (Pages Router) | Full support |
| Vue 3 / Nuxt | Replace react-patterns.mdc with vue-patterns.mdc (create your own) |
| Angular | Replace react-patterns.mdc with angular-patterns.mdc (create your own) |
| Node.js API | Skip react-patterns.mdc; customize api-data-fetching.mdc for your patterns |
| Python / Other | All framework-agnostic rules still apply; skip React-specific ones |

---

## Governance

The `AGENTS.md` constitution enforces:
- **Read before edit** — AI must read every file before modifying it
- **No hallucination** — AI cannot assume file contents or invent import paths
- **Sub-agent delegation** — Discovery runs in parallel fast subagents
- **Lint check after every edit** — No silent error accumulation
- **Verification layer** — Scope → Existence → Content → Dependencies → Conflict before code
