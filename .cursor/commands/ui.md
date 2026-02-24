# UI Command — Tailwind Plus UI Builder

This command orchestrates the full UI development lifecycle — from project setup and design system detection through production-ready component, page, and block generation. It uses Tailwind CSS Plus resources (Templates, UI Kit, UI Blocks) as the primary reference library.

All files produced by this command live in `f:\Prime\UI_Command\`.

---

## Skills — Auto-Invoked on Every Run

> **MANDATORY:** Before any other step, read ALL skill files listed below in order. These are not optional — they encode expert UI knowledge required to use this command correctly. Read each SKILL.md in full before proceeding.

| Skill | Path | When critical |
|-------|------|---------------|
| UI Setup | `f:\Prime\.cursor\skills\ui-setup\SKILL.md` | Always — project context detection |
| Tailwind Templates | `f:\Prime\.cursor\skills\ui-tailwind-templates\SKILL.md` | Always — template reference |
| Tailwind UI Kit | `f:\Prime\.cursor\skills\ui-tailwind-ui-kit\SKILL.md` | `/ui component`, `/ui page` |
| Tailwind Blocks | `f:\Prime\.cursor\skills\ui-tailwind-blocks\SKILL.md` | `/ui block`, `/ui page` |
| Component Builder | `f:\Prime\.cursor\skills\ui-component-builder\SKILL.md` | All generation modes |
| Responsive Design | `f:\Prime\.cursor\skills\ui-responsive-design\SKILL.md` | All modes |
| Accessibility | `f:\Prime\.cursor\skills\ui-accessibility\SKILL.md` | All modes |

**Skill load order:** Setup → Templates → UI Kit → Blocks → Component Builder → Responsive → Accessibility. All 7 must be loaded before Phase 1 begins.

---

## Sub-Commands

| Command | Description |
|---------|-------------|
| `/ui setup` | Scan project, detect framework/stack, configure this command for the project |
| `/ui component [description]` | Generate a single reusable component |
| `/ui page [description]` | Generate a full page using blocks and components |
| `/ui block [type]` | Generate a specific Tailwind Plus marketing block |
| `/ui template [name]` | Scaffold from a Tailwind Plus template category |
| `/ui audit` | Audit existing UI for responsive and accessibility issues |
| `/ui help` | Show all sub-commands and examples |

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> This protocol runs on EVERY invocation. No phase may be skipped.

### Phase 1: Discovery

1. **Load all 7 skills** from `f:\Prime\.cursor\skills\` — mandatory Step 0
2. **Read `f:\Prime\UI_Command\UI_KNOWLEDGE.md`** — load the full Tailwind Plus resource map
3. **Check for `f:\Prime\UI_Command\project-config.json`** — if it exists, load the detected project configuration
   - If it does NOT exist: automatically trigger `/ui setup` first, then continue
4. **Identify the sub-command** from the user's invocation
5. **Return a Discovery Summary:**
   ```
   ## UI Discovery Summary
   Sub-command: [setup | component | page | block | template | audit]
   Project framework: [next | react | vue | html | unknown]
   Tailwind version: [3 | 4 | unknown]
   Config file: [found | not found — running setup first]
   Skills loaded: [all 7 | list any not loaded]
   Tailwind Plus resource: [Templates | UI Kit | Blocks | all]
   ```

### Phase 2: Review

1. **Confirm sub-command mode** — verify which mode is active
2. **Map to Tailwind Plus resource** — identify which resource(s) apply (Templates, UI Kit, Blocks)
3. **Design system check** — confirm color tokens, font, spacing align with detected project config
4. **Output plan** — state exactly what will be generated: file names, component names, block types

### Phase 3: Execute

Generate output following the sub-command specification below. Always produce:
- A **Rationale table** before code (mapping each section to its Tailwind Plus source)
- **Production-ready code** (no placeholder comments, no TODOs)
- **Inline prop types** (TypeScript) or **JSDoc** (JavaScript)
- **Accessibility** attributes on all interactive elements
- **Dark mode variants** on all color utilities

---

## Sub-Command Specifications

### `/ui setup`
**Skill:** Load `ui-setup/SKILL.md` — follow ALL steps in that skill.

The setup sub-command:
1. Uses `explore` subagent to scan the project for: `package.json`, `tailwind.config.*`, `tsconfig.json`, `next.config.*`, component directories, existing design tokens
2. Detects: framework, Tailwind version, component library, primary colors, font family, dark mode setting
3. Infers the best Tailwind Plus template category match
4. Writes `f:\Prime\UI_Command\project-config.json` with all detected values
5. Outputs a **Project Configuration Report** summarizing all detected settings

---

### `/ui component [description]`
**Skills:** `ui-tailwind-ui-kit`, `ui-component-builder`, `ui-responsive-design`, `ui-accessibility`

1. Parse the component description — identify: component type, purpose, state variants
2. Find the closest match in Tailwind Plus UI Kit categories
3. Generate the component following UI_KNOWLEDGE §5 file conventions
4. Include: hover states, focus states, disabled states, loading state if applicable
5. Include: dark mode variants, responsive behavior, full aria attributes

**Output format:**
```
## Component: [Name]
**Source:** Tailwind Plus UI Kit — [Category]
**File:** [ComponentName.tsx]

### Rationale
| Part | Decision | Source |
| :--- | :--- | :--- |

### Code
[full component code block]

### Usage Example
[usage snippet showing props]
```

---

### `/ui page [description]`
**Skills:** All 7 skills

1. Parse the page description — identify: page type, sections needed, user flow
2. Select appropriate Tailwind Plus template as the base structure
3. Compose the page from Tailwind Plus UI Blocks for each section
4. Assemble into a single page component or directory of sub-components
5. Each section must reference its Tailwind Plus block source

**Output format:**
```
## Page: [Name]
**Template Base:** Tailwind Plus Templates — [Category]
**Sections:** [list of blocks used]

### Page Architecture
[section → block mapping table]

### Code
[full page code, sectioned with comments for each block]
```

---

### `/ui block [type]`
**Skills:** `ui-tailwind-blocks`, `ui-responsive-design`, `ui-accessibility`

Valid block types: `hero`, `features`, `pricing`, `cta`, `testimonials`, `team`, `logos`, `stats`, `faq`, `newsletter`, `contact`, `header`, `footer`

1. Look up the block type in UI_KNOWLEDGE §1.3
2. Select the most appropriate variant for the project type (from project-config.json)
3. Generate the block as a standalone JSX/HTML section
4. Apply project color tokens from config

---

### `/ui template [name]`
**Skills:** `ui-tailwind-templates`, `ui-responsive-design`, `ui-component-builder`

1. Map `[name]` to a Tailwind Plus template category (saas, marketing, ecommerce, blog, docs, dashboard)
2. Scaffold the full template structure: page files, layout components, shared components
3. Output a file tree showing every file to be created
4. Generate each file in sequence

---

### `/ui audit`
**Skills:** `ui-responsive-design`, `ui-accessibility`

1. Use `explore` subagent to read all component/page files in the project's component directory
2. Check each file against UI_KNOWLEDGE §4 (Common Mistakes)
3. Run responsive audit: verify all `sm:`, `md:`, `lg:` breakpoints are used correctly
4. Run a11y audit: check for missing `aria-*`, non-semantic HTML, missing focus states
5. Output an **Audit Report** with: severity level, file, line reference, and fix recommendation

---

## Usage Examples

```
/ui setup
/ui component "primary call-to-action button with loading state"
/ui component "responsive navigation header with mobile menu"
/ui page "SaaS landing page with hero, features, pricing, and CTA"
/ui block hero
/ui block pricing
/ui template saas
/ui audit
```

---

## Next Steps After First Run

1. Run `/ui setup` first — always. The command requires `project-config.json` to produce project-accurate output.
2. After setup, run `/ui page` to scaffold your first full page
3. Use `/ui block` to add individual sections incrementally
4. Run `/ui audit` after completing a page to catch responsive and a11y issues before shipping
