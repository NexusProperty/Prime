# INTEGRATE Command — Project Auto-Detection & Integration Setup

> This command is the **recommended first step** when dropping `cursor-project-template` into a new project.
> It scans the host project, identifies its framework and conventions, generates a `cursor-integration.json` config, and pre-populates memory bank templates with detected information.
> Run `/integrate` BEFORE `/setup`.

---

## What This Command Does

| Step | Action | Output |
|------|--------|--------|
| 1 | Detect project framework, language, and stack | Framework identity |
| 2 | Scan directory structure and code patterns | Structure map |
| 3 | Detect existing Cursor AI configuration | Gap analysis |
| 4 | Synthesize findings | Integration config |
| 5 | Write `cursor-integration.json` | Config file at project root |
| 6 | Pre-populate memory bank templates | Partially filled md files |
| 7 | Generate project-specific `.cursorrules` draft | `.cursorrules` file |
| 8 | Report what was detected and what needs manual review | Summary to user |

---

## Output Files

After `/integrate` completes, you'll have:

```
[project root]/
├── cursor-integration.json          ← Auto-detected project config (review + edit this)
├── .cursorrules                     ← Draft rules file (customize this)
└── memory-bank/
    ├── productContext.md            ← Pre-populated with detected project info
    ├── techContext.md               ← Pre-populated with detected stack
    ├── systemPatterns.md            ← Pre-populated with detected patterns
    └── [other files]               ← Templates with [PLACEHOLDER] values
```

---

## cursor-integration.json Schema

```json
{
  "version": "1.0",
  "detected": {
    "projectName": "my-project",
    "framework": "react-vite",
    "language": "typescript",
    "packageManager": "npm",
    "uiLibrary": "shadcn-radix",
    "stateManagement": "tanstack-query",
    "auth": "supabase",
    "database": "supabase-postgres",
    "testing": {
      "unit": "vitest",
      "e2e": "playwright"
    },
    "styling": "tailwindcss",
    "routing": "react-router",
    "sourceDir": "src",
    "projectType": "spa"
  },
  "confidence": {
    "framework": "high",
    "auth": "medium",
    "styling": "high"
  },
  "manualReviewRequired": [
    "auth.provider — confirm which auth library is being used",
    "database.schema — could not detect from config files alone"
  ],
  "integration": {
    "cursorrules": {
      "generated": true,
      "path": ".cursorrules"
    },
    "memoryBankPrepopulated": true,
    "rulesCustomizationNeeded": [
      "cursor-config/rules/api-data-fetching.mdc",
      "cursor-config/rules/auth-patterns.mdc",
      "cursor-config/rules/ui-styling.mdc"
    ]
  }
}
```

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

### Phase 1: Discovery (MANDATORY Fast Subagent Delegation)

> **MANDATORY DELEGATION RULE:** The Main Agent MUST use the `Task` tool to spawn subagents for ALL discovery work. ALL subagents MUST use `model: "fast"`.

The Main Agent spawns **4 parallel subagents** via the `Task` tool:

**Subagent A — Project Root Scanner** (`codebase-scanner-fast`, `model: "fast"`)

Scan the project root and identify the project's identity:

1. Read `package.json` — extract name, description, dependencies, devDependencies, scripts
2. Read `tsconfig.json` / `jsconfig.json` if present — extract paths, target, module
3. Identify build tool from: `vite.config.*`, `next.config.*`, `webpack.config.*`, `astro.config.*`
4. Identify CSS framework from: `tailwind.config.*`, `postcss.config.*`
5. Note: `Dockerfile`, `docker-compose.*`, `.env.example`
6. Read `README.md` (first 50 lines) for project description
7. Detect package manager from lock files: `package-lock.json` (npm), `yarn.lock` (yarn), `pnpm-lock.yaml` (pnpm), `bun.lockb` (bun)
8. Run `Glob` on `*/` to get top-level directory list

Return: Project name, detected framework, language, package manager, key config files found.

**Subagent B — Stack & Dependency Classifier** (`codebase-scanner-fast`, `model: "fast"`)

Deep-classify the dependency stack from `package.json`:

1. **Framework:**
   - `next` → Next.js; check for `app/` (App Router) or `pages/` (Pages Router)
   - `react` + `vite` → React SPA
   - `vue` → Vue 3; `nuxt` → Nuxt
   - `@angular/core` → Angular
   - `svelte` → Svelte; `@sveltejs/kit` → SvelteKit
   - `express`/`fastify`/`hono` (no frontend) → Node API
   - `astro` → Astro

2. **UI Library:**
   - `@radix-ui/*` and `class-variance-authority` → shadcn/ui + Radix
   - `@mui/material` → Material UI
   - `@chakra-ui/react` → Chakra UI
   - `antd` → Ant Design
   - `@headlessui/react` → Headless UI

3. **State Management:**
   - `@tanstack/react-query` → TanStack Query
   - `zustand` → Zustand
   - `jotai` → Jotai
   - `recoil` → Recoil
   - `redux` / `@reduxjs/toolkit` → Redux Toolkit

4. **Auth:**
   - `@supabase/supabase-js` → Supabase Auth
   - `@clerk/nextjs` / `@clerk/clerk-react` → Clerk
   - `next-auth` → NextAuth.js
   - `@auth0/nextjs-auth0` → Auth0
   - `firebase` → Firebase Auth

5. **Database:**
   - `@supabase/supabase-js` → Supabase (PostgreSQL)
   - `@prisma/client` → Prisma
   - `drizzle-orm` → Drizzle
   - `mongoose` → MongoDB/Mongoose
   - `firebase` → Firestore

6. **Testing:**
   - `vitest` → Vitest (unit)
   - `jest` → Jest (unit)
   - `@playwright/test` → Playwright (E2E)
   - `cypress` → Cypress (E2E)
   - `@testing-library/react` → React Testing Library

7. **Styling:**
   - `tailwindcss` → Tailwind CSS
   - `styled-components` → Styled Components
   - `@emotion/react` → Emotion

Return: Categorized stack with confidence levels (high/medium/low based on evidence).

**Subagent C — Structure & Pattern Scanner** (`codebase-scanner-fast`, `model: "fast"`)

Analyze the actual directory structure and code patterns:

1. Scan `src/` or `app/` top level (one level deep only)
2. Read 2-3 sample component files to detect:
   - File naming convention (PascalCase, kebab-case, camelCase)
   - Import patterns (absolute `@/` vs relative `./`)
   - Component style (functional, class, etc.)
   - State management in components (useState, useQuery, store hooks)
3. Check for test directories: `__tests__/`, `*.test.*`, `*.spec.*`, `e2e/`
4. Check for typed database schemas: `src/types/database.ts`, `supabase/types.ts`, etc.
5. Check for API route patterns: `src/api/`, `src/lib/api.ts`, `src/services/`
6. Detect routing pattern: file-based or config-based

Return: Directory structure, naming conventions, import style, detected patterns.

**Subagent D — Cursor State Scanner** (`codebase-scanner-fast`, `model: "fast"`)

Scan for existing Cursor AI infrastructure and memory bank state:

1. Check `.cursor/` — what exists? (agents, commands, rules, skills)
2. Check `memory-bank/` — which files exist? Read first 5 lines of each.
3. Check `AGENTS.md` — exists? Read first 10 lines.
4. Check `.cursorrules` — exists? Read first 10 lines.
5. Check `cursor-memory-bank/` — exists? (external clone)
6. Check `cursor-project-template/` — where is it? Same dir, parent, or not found?

Return: Cursor infrastructure state, what's missing, what's already set up.

---

### Phase 2: Review (Main Agent)

The Main Agent receives all 4 subagent reports and:

1. **Synthesizes project identity** — Confirm the framework, language, and stack with confidence levels
2. **Identifies gaps** — What Cursor infrastructure is missing?
3. **Resolves conflicts** — If subagents disagree (e.g., both Next.js and React detected), determine actual setup
4. **Builds integration config** — Draft the `cursor-integration.json` structure
5. **Plans memory bank content** — Draft the content for each memory-bank file based on detected stack
6. **Plans .cursorrules content** — Generate project-specific rules based on detected stack
7. **Determines rules to customize** — Which rule files need project-specific content added?
8. **Identify manual review items** — What could not be auto-detected with confidence?

---

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent MUST delegate ALL file operations to subagents.

**Subagent E — Integration Config Writer** (`file-operations-fast`, `model: "fast"`)

Create the integration config and rules file:

1. **Write `cursor-integration.json`** at project root with all detected settings and confidence levels
2. **Write `.cursorrules`** draft based on detected stack. Use this template:

```
# [PROJECT_NAME] — Cursor Rules

## Project Identity
- Framework: [DETECTED_FRAMEWORK]
- Language: [DETECTED_LANGUAGE]
- Package Manager: [DETECTED_PM]

## Tech Stack
- UI: [DETECTED_UI]
- State: [DETECTED_STATE]
- Auth: [DETECTED_AUTH]
- Database: [DETECTED_DB]
- Testing: [DETECTED_TESTING]

## Critical Pre-Commit Checks
[Generate based on detected scripts in package.json]
- npm run typecheck (if typecheck script exists)
- npm run lint (if lint script exists)
- npm run test (if test script exists)

## Key Conventions
[Generate based on detected patterns]
- File naming: [DETECTED_NAMING]
- Import style: [DETECTED_IMPORT_STYLE]
- Component pattern: [DETECTED_COMPONENT_PATTERN]
```

**Subagent F — Memory Bank Pre-Populator** (`file-operations-fast`, `model: "fast"`)

Pre-populate memory bank template files with detected information. If `memory-bank/` doesn't exist yet, create it from `cursor-project-template/memory-bank-templates/`.

1. **`memory-bank/techContext.md`** — Fill in the detected stack:
   ```markdown
   # Tech Context

   ## Detected Stack (from /integrate scan — verify and expand)
   - Framework: [DETECTED_FRAMEWORK]
   - Language: [DETECTED_LANGUAGE]
   - UI Library: [DETECTED_UI]
   - State Management: [DETECTED_STATE]
   - Auth: [DETECTED_AUTH]
   - Database: [DETECTED_DB]
   - Testing (unit): [DETECTED_UNIT_TEST]
   - Testing (E2E): [DETECTED_E2E_TEST]
   - Styling: [DETECTED_STYLING]
   - Package Manager: [DETECTED_PM]
   
   ## TODO: Expand This Section
   - [ ] Add API endpoint patterns
   - [ ] Add database schema overview
   - [ ] Add environment variables reference (names only, not values)
   - [ ] Add deployment target
   ```

2. **`memory-bank/productContext.md`** — Add detected project name and description:
   ```markdown
   # Product Context

   ## Project
   - **Name:** [DETECTED_PROJECT_NAME]
   - **Description:** [DETECTED_FROM_README_OR_PACKAGE_JSON]

   ## TODO: Fill In This Section
   - [ ] Product goals
   - [ ] Target users / personas
   - [ ] Key features
   - [ ] Success metrics
   ```

3. **`memory-bank/systemPatterns.md`** — Add detected structure patterns:
   ```markdown
   # System Patterns

   ## Detected Conventions (from /integrate scan — verify)
   - Source directory: [DETECTED_SOURCE_DIR]
   - File naming: [DETECTED_NAMING]
   - Import style: [DETECTED_IMPORT_STYLE]
   - Routing: [DETECTED_ROUTING]
   - Component pattern: [DETECTED_COMPONENT_PATTERN]

   ## TODO: Fill In This Section
   - [ ] Architecture overview
   - [ ] Component hierarchy
   - [ ] Data flow patterns
   - [ ] State management approach
   - [ ] Auth flow
   ```

4. **`memory-bank/projectbrief.md`** — Pre-populate with detected info:
   ```markdown
   # Project Brief

   - **Project:** [DETECTED_PROJECT_NAME]
   - **Tech:** [DETECTED_FRAMEWORK] + [DETECTED_LANGUAGE]
   - **Status:** Setup in progress

   ## TODO: Write the full project brief here
   ```

**Subagent G — Verification** (`validation-specialist-fast`, `model: "fast"`)

After Subagents E and F complete:
1. Verify `cursor-integration.json` exists and is valid JSON
2. Verify `.cursorrules` was written
3. Verify memory bank files were created/updated
4. Verify no placeholder values were accidentally left as `[DETECTED_*]` without being filled
5. Report final status

---

## Post-Integration: Manual Review Required

After `/integrate` completes, review and complete:

### 1. Review `cursor-integration.json`
- Check confidence levels — items marked "low" need manual verification
- Review `manualReviewRequired` array for items that couldn't be auto-detected

### 2. Edit `.cursorrules`
- Add project-specific conventions that weren't detected
- Add critical rules specific to your domain

### 3. Complete Memory Bank Files
- `memory-bank/productContext.md` — Add product goals, personas, features
- `memory-bank/systemPatterns.md` — Add architecture details
- `memory-bank/projectbrief.md` — Write the full project brief

### 4. Customize Rules (Optional but Recommended)
Based on your detected stack, update these rules in `.cursor/rules/`:
- `api-data-fetching.mdc` — Add your actual API patterns
- `auth-patterns.mdc` — Add your actual auth component names
- `ui-styling.mdc` — Add your actual design system tokens

### 5. Run `/setup`
After reviewing and editing the integration config:
```
/setup
```

---

## Workflow

```
User: (drops cursor-project-template into new project)
User: /integrate
       ↓
Phase 1: 4 parallel subagents scan project
  - Framework/stack detection
  - Directory structure analysis
  - Cursor infrastructure check
       ↓
Phase 2: Review & synthesize
  - Resolve conflicts
  - Build integration config
  - Plan memory bank content
       ↓
Phase 3: Write files
  - cursor-integration.json
  - .cursorrules (draft)
  - memory-bank/ (pre-populated)
       ↓
Report: "Detected React+TypeScript+Supabase project. Confidence: high.
         Memory bank pre-populated. Review cursor-integration.json then run /setup."
       ↓
User: Review cursor-integration.json and .cursorrules
User: Fill in remaining memory-bank placeholders
User: /setup
```

---

## Usage

```
/integrate
```

No arguments needed. The command auto-detects everything from the project root.

### Optional Modifiers

```
/integrate                    — Full scan (recommended)
/integrate quick              — Skip code pattern analysis, just detect framework + stack
/integrate --update           — Re-run on existing project to refresh cursor-integration.json
```

---

## Relationship to Other Commands

| Command | Relationship |
|---------|-------------|
| `/setup` | Run AFTER `/integrate` — uses cursor-integration.json to customize setup |
| `/setup-scan` | Similar but produces audit report instead of integration config; use for read-only audit |
| `/van` | Run AFTER `/setup` to start first task |
| `/orion` | Available after setup for ongoing ad-hoc analysis |

---

## Recovery

If `/integrate` produces unexpected results:
1. Delete `cursor-integration.json` and `.cursorrules` (if they were overwritten unintentionally)
2. Check that you're running from the project root
3. Re-run `/integrate`

The command will only overwrite `.cursorrules` if it detects it was previously generated by `/integrate` (checks for the integration header comment). Manually-written rules files are preserved.
