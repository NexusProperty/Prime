# SETUP-SCAN Command — Existing Codebase Discovery & Audit

> This command scans an existing codebase to produce a comprehensive inventory of what is already in place.
> Unlike `/setup` (which bootstraps from scratch), `/setup-scan` is for joining or auditing a project that already has code, configuration, and structure.

## When to Use This Command

| Scenario | Use This? |
|----------|-----------|
| Joining an existing project for the first time | Yes |
| Auditing a project before adding Cursor AI configuration | Yes |
| Understanding what a codebase already has before running `/setup` | Yes |
| Starting a brand-new empty project | No — use `/setup` instead |
| Re-scanning after major refactor | Yes |

---

## What This Command Produces

A structured **Codebase Audit Report** covering:

| Section | What It Detects |
|---------|----------------|
| Project Identity | Name, description, repository info |
| Tech Stack | Languages, frameworks, runtimes, package managers |
| Project Structure | Directory tree, key directories, file counts |
| Dependencies | Production deps, dev deps, notable libraries |
| Configuration Files | tsconfig, vite/webpack, eslint, prettier, etc. |
| Cursor AI State | .cursor/ directory, agents, commands, rules, skills |
| Memory Bank State | memory-bank/ directory, which files exist vs missing |
| Testing Setup | Test framework, test directories, coverage config |
| CI/CD | GitHub Actions, deployment config |
| Environment | .env files, environment variable patterns |
| Code Patterns | Component structure, hooks, API patterns, state management |
| Git State | Branch info, remote, recent activity |

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the Audit Report is generated. No phase may be skipped or reordered.

### Phase 1: Discovery (MANDATORY Fast Subagent Delegation)

> **MANDATORY DELEGATION RULE:** The Main Agent MUST use the `Task` tool to spawn subagents for ALL discovery work. ALL subagents MUST use `model: "fast"`.

The Main Agent spawns **4 parallel subagents** via the `Task` tool:

**Subagent A — Project Root Scanner** (`codebase-scanner-fast`, `model: "fast"`)

Scan the project root and top-level structure:

1. **Root files inventory:**
   - `package.json` — read and extract: name, version, scripts, dependencies, devDependencies
   - `tsconfig.json` / `jsconfig.json` — read and extract: target, module, paths, baseUrl
   - `vite.config.*` / `next.config.*` / `webpack.config.*` — identify build tool
   - `.eslintrc.*` / `eslint.config.*` — identify linting setup
   - `.prettierrc*` — identify formatting setup
   - `tailwind.config.*` / `postcss.config.*` — identify CSS framework
   - `Dockerfile` / `docker-compose.*` — identify containerization
   - `.env` / `.env.example` / `.env.local` — identify env var patterns (DO NOT read .env contents, only note existence)
   - `AGENTS.md` / `.cursorrules` — identify existing Cursor governance
   - `README.md` — read for project description

2. **Directory tree:**
   - Run `Glob` on `*/` to get top-level directories
   - For each significant directory (`src/`, `app/`, `pages/`, `components/`, `lib/`, `hooks/`, `tests/`, `e2e/`, `public/`, `scripts/`), count files and note structure
   - Identify the project's organizational pattern (feature-based, type-based, hybrid)

3. **Return:** Structured JSON-like summary of root files, directory tree, and detected patterns

**Subagent B — Cursor & Memory Bank Scanner** (`codebase-scanner-fast`, `model: "fast"`)

Scan for existing Cursor AI infrastructure:

1. **`.cursor/` directory:**
   - Does it exist?
   - `.cursor/agents/` — list all agent files, count
   - `.cursor/commands/` — list all command files, count
   - `.cursor/rules/` — list all rule files, count, note any `alwaysApply` rules
   - `.cursor/skills/` — list all skill directories, count

2. **`cursor-memory-bank/` directory:**
   - Does it exist? (the upstream memory bank clone)
   - If yes: verify `.cursor/rules/isolation_rules/` structure

3. **`memory-bank/` directory:**
   - Does it exist?
   - For each expected file, report: EXISTS / MISSING / EMPTY
     - `productContext.md`
     - `techContext.md`
     - `systemPatterns.md`
     - `projectbrief.md`
     - `activeContext.md`
     - `tasks.md`
     - `progress.md`
     - `decisionLog.md`
     - `learnings.md`
   - Check for task subdirectories: `archive/`, `build/`, `plan/`, `creative/`, `reflection/`, `van/`
   - If files exist, read first 5 lines of each to summarize content state (populated vs placeholder)

4. **`Maunal/` directory:**
   - Does it exist?
   - What files are in it?

5. **Return:** Cursor AI infrastructure state — what exists, what's missing, what's populated vs empty

**Subagent C — Dependencies & Framework Scanner** (`codebase-scanner-fast`, `model: "fast"`)

Deep-scan the dependency graph and framework usage:

1. **Package manager detection:**
   - `package-lock.json` → npm
   - `yarn.lock` → yarn
   - `pnpm-lock.yaml` → pnpm
   - `bun.lockb` → bun

2. **Framework detection** (from `package.json` dependencies):
   - React / Next.js / Remix / Vite+React
   - Vue / Nuxt
   - Angular
   - Svelte / SvelteKit
   - Node.js / Express / Fastify
   - Other

3. **Key library categorization** (from `package.json`):
   - **UI:** shadcn/ui, radix-ui, headless-ui, material-ui, chakra-ui, ant-design
   - **State:** zustand, redux, jotai, recoil, tanstack-query
   - **Routing:** react-router, tanstack-router, next/navigation
   - **Forms:** react-hook-form, formik, zod
   - **Auth:** supabase, clerk, auth0, next-auth
   - **Database:** supabase, prisma, drizzle, typeorm
   - **Testing:** vitest, jest, playwright, cypress, testing-library
   - **Styling:** tailwindcss, styled-components, emotion, css-modules

4. **Script analysis** (from `package.json` scripts):
   - Dev server command
   - Build command
   - Test command(s)
   - Lint command
   - Type check command

5. **Return:** Categorized dependency map, framework identification, script inventory

**Subagent D — Code Pattern Scanner** (`codebase-scanner-fast`, `model: "fast"`)

Analyze the actual code for patterns and conventions:

1. **Component patterns** (scan `src/components/` or equivalent):
   - Functional vs class components
   - File naming convention (PascalCase, kebab-case, camelCase)
   - Co-located tests? (`__tests__/`, `.test.ts` alongside)
   - Co-located styles? (`.module.css`, `.styles.ts`)
   - Index barrel files? (`index.ts` re-exports)

2. **API/Data patterns** (scan `src/lib/`, `src/api/`, `src/services/`):
   - Supabase client usage
   - REST API patterns
   - GraphQL usage
   - RPC patterns
   - Data fetching hooks

3. **Routing patterns** (scan `src/pages/`, `src/app/`, `src/routes/`):
   - File-based routing vs config-based
   - Layout patterns
   - Protected route patterns
   - Route count estimate

4. **Type patterns** (scan `src/types/`):
   - Centralized types vs co-located
   - Interface vs type alias preference
   - Generated types (database types, API types)

5. **Testing patterns** (scan `__tests__/`, `*.test.*`, `*.spec.*`, `e2e/`):
   - Unit test framework and patterns
   - Integration test patterns
   - E2E test framework and patterns
   - Test file count estimate
   - Fixture/mock patterns

6. **CI/CD** (scan `.github/`, `.gitlab-ci.yml`, `Jenkinsfile`):
   - CI pipeline detected?
   - What jobs/steps are configured?
   - Deployment targets?

7. **Return:** Code pattern summary, naming conventions, architecture style

---

### Phase 2: Review (Main Agent)

The Main Agent receives all 4 subagent reports and synthesizes the **Codebase Audit Report**.

#### Synthesis Steps:

1. **Cross-reference findings** — Ensure subagent reports are consistent (e.g., if Subagent C found React, Subagent D should see React components)

2. **Identify gaps** — Compare what exists against a "healthy project" baseline:
   - Has a README? Has it been customized?
   - Has proper TypeScript config?
   - Has linting/formatting?
   - Has testing setup?
   - Has CI/CD?
   - Has Cursor AI configuration?
   - Has Memory Bank?

3. **Generate recommendations** — Based on gaps, produce actionable next steps:
   - "Missing: `.cursor/rules/` — Run `/setup` to add Cursor AI rules"
   - "Missing: `memory-bank/techContext.md` — Create and populate with detected tech stack"
   - "Found: Vitest + Playwright — Testing is well-configured"

4. **Compile the Audit Report** — Structured document with all findings

---

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent MUST delegate ALL file operations to subagents.

**Subagent E — Report Writer** (`file-operations-fast`, `model: "fast"`)

Create the audit report file:

1. **Write the Codebase Audit Report** to `memory-bank/van/setup-scan-report.md` (if `memory-bank/` exists) or to `setup-scan-report.md` at project root (if it does not).

2. **Report format:**

```markdown
# Codebase Audit Report
> Generated by `/setup-scan` on [DATE]

## Project Identity
- **Name:** [from package.json]
- **Description:** [from README or package.json]
- **Repository:** [from git remote]

## Tech Stack Summary
| Category | Technology | Version |
|----------|-----------|---------|
| Runtime | Node.js | x.x |
| Framework | React + Vite | x.x |
| Language | TypeScript | x.x |
| ... | ... | ... |

## Project Structure
[Directory tree with file counts]

## Dependencies
### Production (X total)
[Categorized list]
### Development (X total)
[Categorized list]

## Configuration Files
| File | Status | Notes |
|------|--------|-------|
| tsconfig.json | Found | Strict mode enabled |
| ... | ... | ... |

## Cursor AI Infrastructure
### .cursor/ Directory
[Status of agents, commands, rules, skills]
### Memory Bank
[Status of each memory bank file]
### Maunal/
[Status]

## Code Patterns
### Components: [pattern description]
### Data Fetching: [pattern description]
### Routing: [pattern description]
### Testing: [pattern description]

## Health Assessment
| Area | Status | Notes |
|------|--------|-------|
| TypeScript | Good | Strict mode, path aliases |
| Testing | Partial | Unit tests present, no E2E |
| CI/CD | Missing | No GitHub Actions detected |
| Cursor AI | Not configured | Run /setup |
| ... | ... | ... |

## Recommended Next Steps
1. [Ordered list of recommendations]
2. ...
```

3. **Update Memory Bank** (if it exists):
   - Update `memory-bank/activeContext.md` to note the scan was performed
   - Update `memory-bank/techContext.md` with detected tech stack (if file exists but is empty/placeholder)

**Subagent F — Verification** (`validation-specialist-fast`, `model: "fast"`)

After Subagent E completes:
1. Verify the audit report was written successfully
2. Verify any Memory Bank updates are well-formed
3. Report final status

---

## Output

After execution, the Main Agent presents a **summary** to the user:

```
Setup Scan Complete

Project: [name]
Framework: [detected framework]
Files scanned: [count]

Cursor AI Status: [Configured / Partially Configured / Not Configured]
Memory Bank Status: [Populated / Empty / Missing]

Report saved to: [path]

Recommended next steps:
1. [first recommendation]
2. [second recommendation]
3. [third recommendation]
```

---

## Usage

```
/setup-scan
```

No arguments needed. The command auto-detects everything from the project root.

### Optional Modifiers

If the user provides context, adjust the scan:

```
/setup-scan                    — Full codebase scan
/setup-scan quick              — Skip code pattern analysis, just inventory files and config
/setup-scan @src/components/   — Focused scan on a specific directory
```

---

## Relationship to Other Commands

| Command | Relationship |
|---------|-------------|
| `/setup` | Run `/setup-scan` BEFORE `/setup` to understand what exists, so `/setup` knows what to skip vs create |
| `/van` | Run AFTER `/setup-scan` and `/setup` to initialize for a task |
| `/security` | `/setup-scan` identifies the tech stack; `/security` audits it for vulnerabilities |
| `/orion` | `/setup-scan` produces the baseline; `/orion` performs deeper ad-hoc analysis |

---

## Differences from `/setup`

| Aspect | `/setup` | `/setup-scan` |
|--------|----------|---------------|
| Purpose | Bootstrap new project from templates | Audit existing project state |
| Writes files? | Yes — creates directories, copies templates | Minimal — only writes the audit report |
| Requires templates? | Yes — needs `cursor-project-template/` | No — works on any codebase |
| Requires memory bank clone? | Yes — needs `cursor-memory-bank/` | No — detects if present |
| Destructive? | Can overwrite if not careful | Read-only scan + single report file |
| When to use | Setting up AI dev environment from scratch | Understanding what already exists |

---

## Recovery

If the scan produces unexpected results:
1. Delete the generated report file
2. Check that the project root is correct (the command scans from the workspace root)
3. Re-run `/setup-scan`

The command is non-destructive — it reads everything and writes only the audit report.

---

## Notes

- This command respects the Verification Layer (Article II of `AGENTS.md`). All file reads are performed via the Read tool. No assumptions are made about file contents.
- The scan adapts to any framework or language — it is not limited to React/TypeScript projects.
- Environment files (`.env`, `.env.local`) are detected but **never read** for security. Only their existence is noted.
- The audit report is a point-in-time snapshot. Re-run `/setup-scan` after major changes to refresh it.
