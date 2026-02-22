# WEB UPDATE Command - SEO/AEO Content Update & New Page Creation

Reviews a website codebase for SEO and AEO improvements, replaces old content with updated data, and creates new pages where they don't exist. When creating new pages, the command first extracts the existing design system — components, layout patterns, color tokens, typography, spacing — and matches the new pages exactly to the established UI/UX.

**Related commands:**
- `SEO&AEO/seo-command.md` — SEO methodology reference
- `SEO&AEO/aeo-command.md` — AEO methodology reference
- `SEO&AEO/search-command.md` — unified search optimization

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before any task begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Two discovery streams run in parallel — one for content/SEO state, one for UI/design state. Both are required before any changes can be made.

> **Recommended subagent types:**
> - `codebase-scanner-fast` — scans pages, components, routes, and design tokens
> - `web-scraper-fast` — audits live page content, meta tags, headings, and schema (if live URL provided)

#### Stream A — Content & SEO/AEO Audit

Scan the following for current content state:
- All pages/routes in `src/app/`, `src/pages/`, `pages/`, or equivalent framework directory
- Meta tags (`<title>`, `<meta name="description">`) on all pages
- Heading structure (H1–H3) on all pages
- Existing schema.org JSON-LD markup
- Content format: are sections using 40–60 word lead answers + bullets, or dense paragraphs?
- Any existing SEO/AEO audit files in `SEO&AEO/` folder

**Return Content Report:**
```
## Content Audit Report

Pages found: [list all page routes]
Missing pages (requested but not present): [list | none]
SEO status per page:
  - [page]: title [ok | missing | too long], meta [ok | missing], H1 [ok | multiple | missing]
AEO status per page:
  - [page]: content format [AEO-ready | dense], schema [present | missing]
Old data identified: [list specific outdated text, numbers, or content blocks]
New data provided by user: [summarize what the user has given to replace]
```

#### Stream B — UI/Design System Extraction

Before any new page is created, extract the full design system in use:

1. **Component library:** What UI library is used? (shadcn/ui, MUI, Radix, custom, or none)
2. **Styling approach:** Tailwind CSS, CSS Modules, styled-components, SCSS?
3. **Layout patterns:** How are existing pages structured? (container widths, grid systems, sidebar patterns)
4. **Color tokens:** What are the primary, secondary, neutral, and semantic colors? (from Tailwind config, CSS variables, or design tokens file)
5. **Typography:** What font families, size scale, and weight conventions are used?
6. **Spacing system:** What is the base spacing unit? (8px grid via Tailwind, or custom?)
7. **Component inventory:** List all reusable components found in `src/components/`, `components/`, or equivalent
8. **Page template:** What does the layout shell look like? (header, nav, main, footer structure)
9. **Interactive states:** What hover, focus, active, and loading patterns are used?
10. **Animation/transition patterns:** Any motion patterns in use?

**Return Design Extraction Report:**
```
## Design System Report

Component library: [shadcn/ui | MUI | Radix | custom | none]
Styling: [Tailwind | CSS Modules | styled-components | SCSS]
Color tokens:
  Primary: [value]
  Neutral: [value]
  Semantic (error/success/warning): [values]
Typography:
  Font family: [value]
  Size scale: [sm/base/lg/xl/2xl — or exact values]
  Body line-height: [value]
Spacing system: [8px Tailwind | custom — describe]
Layout shell: [describe header/nav/main/footer structure]
Key components available: [list]
Page template pattern: [describe the typical page layout]
Interactive state conventions: [hover style, focus ring style, loading pattern]
Animation patterns: [none | describe]
New pages needed: [list each page name + route]
```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

Using both discovery reports, the Main Agent:

1. **Maps new data to pages** — which exact content blocks on which pages get replaced
2. **Identifies missing pages** — confirms the list of pages to create
3. **Validates design extraction** — confirms the design system is fully understood before any new page is scaffolded
4. **Creates the execution plan:**
   - Page-by-page update list (file path, what changes, what the new content is)
   - New page list (route, layout template to use, sections to include, SEO + AEO requirements)
   - Schema.org blocks to add or update
   - Meta tag rewrites

> **Gate:** Do not proceed to Phase 3 until:
> - The Design System Report is complete and confirmed
> - Every new page has a named layout template from the existing codebase to match
> - Every content replacement is mapped to a specific file and line range

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly writes or edits files. It uses the `Task` tool to spawn subagents for all file operations.

**Delegation map:**

| Task | Subagent |
|------|---------|
| Replace content on existing pages | `file-operations-fast` |
| Create new page files matching design system | `ui-ux-engineer-fast` |
| Update or add meta tags and schema markup | `file-operations-fast` |
| Update heading structure for SEO/AEO | `file-operations-fast` |
| Validate created/updated files | `validation-specialist-fast` |
| Document changes | `documentation-manager-fast` |

---

## Agentic Skills — Applied Automatically

| Skill | Trigger | Mandate |
|-------|---------|---------|
| `web-page-update` | Always | UI scan, design extraction, content replacement, and new page creation protocol |

---

## Workflow — Task Types

### `audit` — Review Current State (No Changes)

```
/web-update audit
/web-update audit https://example.com
```

Runs Phase 1 and Phase 2 only. Returns the Content Audit Report and Design System Report. No files are created or modified. Use this first to understand the current state before running `update` or `create`.

**Output:** Inline report — no file writes.

---

### `update` — Replace Old Data With New Data

```
/web-update update [describe what changed or provide the new data]
/web-update update "Hero headline changed to: X. Services section updated with 3 new offerings. Pricing updated."
```

Replaces outdated content on existing pages with the new data provided. Does not create new pages — for that, use `create` or `full`.

**What gets updated:**
- Page copy (headlines, body text, CTAs, feature descriptions)
- Meta title and description tags
- Heading structure (H1/H2/H3) to match AEO format (question-format headings, 40–60 word lead answers)
- Schema.org JSON-LD (if business details, services, or FAQs changed)
- Alt text on updated images
- Internal link anchor text if page titles changed

**Rules for replacement:**
1. Never change layout, component structure, or styling — only content
2. Preserve all className, id, data-*, and aria-* attributes on edited elements
3. Maintain the exact same JSX/HTML structure — only swap the text content
4. If a content block doesn't exist yet (e.g., FAQ section missing), flag it for `create` mode instead of adding it inline

**Output:** All modified files listed with a diff summary per file.

---

### `create` — Create New Pages

```
/web-update create [page name and description]
/web-update create "Services page — lists all 6 services with pricing, FAQ section, and contact CTA"
/web-update create "About page — team section, company history, certifications"
```

Creates new pages that do not yet exist. **Must run after `audit`** — the design system must be extracted before any new page is scaffolded.

**New page creation protocol:**

1. **Match the layout shell:** Use the exact same `<header>`, `<nav>`, `<main>`, `<footer>` structure as existing pages
2. **Reuse existing components:** Pull from the component inventory extracted in Phase 1. Do not create new components unless the section type genuinely doesn't exist
3. **Match visual conventions:** Use the same color tokens, spacing scale, typography sizes, and component variants as existing pages
4. **SEO/AEO from the start:** Every new page is built with AEO content format (40–60 word lead answers + bullets, question H2s, FAQ section, entity signals in first 100 words)
5. **Schema markup included:** Generate and embed appropriate JSON-LD for the page type on creation
6. **All states accounted for:** Every data-dependent section must have a loading state (skeleton preferred over spinner), empty state, and error state

**New page checklist (validated before delivery):**
- [ ] Uses the same layout shell as existing pages
- [ ] All components sourced from existing component library
- [ ] Same color tokens and spacing system — no hardcoded values
- [ ] H1 contains primary keyword for the page
- [ ] First section opens with 40–60 word direct answer + bullets (AEO format)
- [ ] At least one question-format H2
- [ ] FAQ section with 5–8 Q&As
- [ ] JSON-LD schema block for the page type
- [ ] Meta title (50–60 chars) and meta description (150–160 chars) included
- [ ] Loading, empty, and error states on all data sections
- [ ] Responsive — tested at sm/md/lg breakpoints
- [ ] Accessible focus states on all interactive elements

---

### `full` — Update Existing + Create New (Full Run)

```
/web-update full [description of all changes and new pages needed]
```

Runs `update` and `create` in a single pass. Use when you have both content changes to existing pages AND new pages to add.

**Execution order:**
1. Run `audit` (Phase 1 + 2) — understand current state
2. Run `update` — replace content on existing pages
3. Run `create` — scaffold new pages using the now-updated design system

---

## Design Matching Rules — Non-Negotiable

These rules apply every time a new page is created. Violation means the page looks inconsistent with the rest of the site.

| Rule | What to do |
|------|-----------|
| Same component library | Use shadcn/ui, MUI, or whatever the project uses — not a mix |
| Same Tailwind config | Use only the colors and spacing values defined in `tailwind.config.*` |
| Same layout shell | Copy the header/footer/nav wrapper from an existing page — do not invent new structure |
| Same section patterns | If hero sections use a two-column layout, new pages use two-column |
| Same interaction style | If hover uses `transition-colors duration-200`, new pages use the same |
| Same loading pattern | Skeleton screens if the project uses them, spinner if that's the standard |
| Accessibility parity | If existing pages use `focus-visible:ring-2 ring-offset-2`, match that exactly |

---

## Usage

```
/web-update audit
/web-update audit https://example.com
/web-update update "Homepage hero updated — new headline, new subheading, removed old pricing section"
/web-update create "Services page with 6 services, pricing table, FAQ, and contact CTA"
/web-update create "About page — team bios, company history timeline, certifications grid"
/web-update full "Update all meta tags site-wide + create 3 new pages: Services, About, Contact"
```

## Next Steps

After any `/web-update` task:
- Run `/search-optimize audit [url]` to verify SEO and AEO improvements are reflected on the live site
- Validate schema markup: search.google.com/test/rich-results
- Check responsive layout at mobile/tablet/desktop breakpoints
- Test all new pages for accessibility: keyboard navigation, focus states, color contrast
- Run `/scrape [url]` to pull the live updated page and verify changes are correct
- Update `UI/design-system.md` if any new components or patterns were introduced
