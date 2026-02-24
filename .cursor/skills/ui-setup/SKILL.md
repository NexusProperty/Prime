---
name: ui-setup
description: Scan a project codebase to detect its framework, Tailwind CSS version, design tokens, component library, and project type — then write a project-config.json that configures the /ui command for this specific project.
when_to_use: When /ui setup is invoked, or when no project-config.json exists in UI_Command/. Also use when the project's tech stack has changed and the config needs refreshing.
evidence: User runs /ui setup, mentions "configure UI for this project", "scan project for UI settings", or no project-config.json exists.
---

# UI Setup Skill

## Overview

This skill performs a full project scan to detect the technology stack, design system, and project type — then produces a `project-config.json` that the entire `/ui` command system reads as its source of truth. Without this config, the `/ui` command generates generic code that may not match the project's conventions.

## Prerequisites

- Access to the project's file system via `explore` subagent or direct file reads
- Write access to `f:\Prime\UI_Command\` for saving `project-config.json`
- The `cursor-ide-browser` MCP is available (optional — for inspecting live Tailwind config via browser)

## Steps

### Step 1 — Detect Package Manager and Framework

Scan the project root for these files in order:

1. `package.json` → read `dependencies` and `devDependencies`:
   - `next` → framework: `next`
   - `react` (without next) → framework: `react`
   - `vue` → framework: `vue`
   - `svelte` → framework: `svelte`
   - `astro` → framework: `astro`
   - None of the above → framework: `html`
2. Read `package.json` → extract the `version` of the detected framework

**Success Criteria:** `framework` and `version` values determined.

---

### Step 2 — Detect Tailwind CSS

1. Check `package.json` for `tailwindcss` in devDependencies:
   - Version `^3.*` → `tailwindVersion: "3"`
   - Version `^4.*` → `tailwindVersion: "4"`
   - Not found → `tailwindVersion: null`, `styling: detect from other signals`
2. Locate `tailwind.config.js`, `tailwind.config.ts`, or `tailwind.config.mjs`:
   - Read `content` array — extract component directories
   - Read `theme.extend` — extract any custom colors, fonts, spacing
   - Check for `darkMode: 'class'` setting

**Success Criteria:** `tailwindVersion`, primary color tokens, and dark mode setting extracted.

---

### Step 3 — Detect Component Library

Search `package.json` dependencies for:
- `@headlessui/react` → `componentLibrary: "headlessui"`
- `@radix-ui/react-*` → `componentLibrary: "radix"`
- `@mui/material` → `componentLibrary: "mui"`
- `shadcn` or `@shadcn/ui` → `componentLibrary: "shadcn"`
- None → `componentLibrary: "none"`

**Success Criteria:** `componentLibrary` value determined.

---

### Step 4 — Detect Directory Structure

1. Check for `src/` directory → if exists: `srcDir: "src"`
2. Look for component directory: `src/components`, `components`, `app/components`
3. Look for page directory: `src/pages`, `pages`, `app/`, `src/app`
4. Check for TypeScript: `tsconfig.json` → set `typescript: true`

**Success Criteria:** `srcDir`, `componentDir`, `pageDir` values determined.

---

### Step 5 — Detect Design Tokens

From the Tailwind config or CSS custom properties:
1. Find the primary color — look for `primary`, `brand`, `accent` in `theme.extend.colors`
   - If not found → default: `"blue"`
2. Find the font family — look for `theme.extend.fontFamily`
   - If not found → default: `"system"`
3. Detect border radius preference from `theme.extend.borderRadius`
   - Many rounded values → `"lg"`
   - Minimal → `"sm"` or `"none"`

**Success Criteria:** `designTokens.primaryColor`, `designTokens.fontFamily`, `designTokens.borderRadius` extracted.

---

### Step 6 — Infer Project Type

Based on the package.json name, directory names, and detected pages:
- Has `/dashboard`, `/admin`, `/analytics` routes → `projectType: "dashboard"`
- Has `/shop`, `/products`, `/cart` routes → `projectType: "ecommerce"`
- Has `/blog`, `/posts`, `/articles` routes → `projectType: "blog"`
- Has `/docs`, `/documentation` routes → `projectType: "docs"`
- Has `/pricing`, `/features`, `/landing` → `projectType: "marketing"`
- Has both dashboard + marketing pages → `projectType: "saas"`
- Cannot determine → `projectType: "other"`

**Success Criteria:** `projectType` determined.

---

### Step 7 — Match to Tailwind Plus Template

Based on `projectType`, recommend the most appropriate Tailwind Plus template category:

| Project Type | Recommended Template |
|-------------|---------------------|
| `saas` | Application shell + Marketing landing |
| `marketing` | Marketing landing page |
| `ecommerce` | E-commerce storefront |
| `blog` | Blog / content site |
| `docs` | Documentation site |
| `dashboard` | Admin dashboard |
| `other` | Marketing landing page (default) |

**Success Criteria:** `tailwindPlusTemplate` value set.

---

### Step 8 — Write project-config.json

Write the following file to `f:\Prime\UI_Command\project-config.json`:

```json
{
  "framework": "[detected]",
  "version": "[detected]",
  "styling": "tailwind",
  "tailwindVersion": "[3|4|null]",
  "typescript": true,
  "componentLibrary": "[detected]",
  "designTokens": {
    "primaryColor": "[detected]",
    "fontFamily": "[detected]",
    "borderRadius": "[detected]",
    "darkMode": true
  },
  "projectType": "[detected]",
  "tailwindPlusTemplate": "[matched]",
  "srcDir": "[detected]",
  "componentDir": "[detected]",
  "pageDir": "[detected]",
  "detectedAt": "[current ISO timestamp]"
}
```

**Success Criteria:** File written and readable by the `/ui` command system.

---

### Step 9 — Output Project Configuration Report

Display to the user:

```
## UI Project Configuration Report

| Setting | Detected Value |
| :--- | :--- |
| Framework | [framework] [version] |
| Tailwind CSS | v[tailwindVersion] |
| TypeScript | [yes/no] |
| Component Library | [library] |
| Project Type | [type] |
| Primary Color | [color] |
| Font Family | [font] |
| Dark Mode | [enabled/disabled] |
| Recommended Template | [template] |
| Component Directory | [dir] |

**Config saved to:** `f:\Prime\UI_Command\project-config.json`

**Recommended first command:**
- For a new page: `/ui page "[project type] main landing page"`
- For a component: `/ui component "[your component description]"`
- For a template scaffold: `/ui template [recommended template]`
```

## Verification

- [ ] `project-config.json` exists at `f:\Prime\UI_Command\project-config.json`
- [ ] All 9 top-level fields are populated (no nulls except `tailwindPlusTemplate` for `other` type)
- [ ] `detectedAt` is a valid ISO 8601 timestamp
- [ ] Project Configuration Report displayed to user

## Related

- `f:\Prime\UI_Command\UI_KNOWLEDGE.md` — §2 for the full config schema
- `f:\Prime\.cursor\skills\ui-tailwind-templates\SKILL.md` — for template selection detail
