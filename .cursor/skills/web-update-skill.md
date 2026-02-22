---
name: web-page-update
description: Scan a website's design system, replace outdated content with new data, and create new pages that visually and structurally match the existing site. Enforces SEO and AEO content standards on every page touched.
when_to_use: When updating website content (copy, meta tags, schema, headings) or creating new pages that must match the existing site's UI/UX. Activates on any /web-update task — audit, update, create, or full.
evidence: User mentions updating website content, replacing old data, creating new pages, SEO changes to a site, AEO content updates, or running /web-update.
---

# Web Page Update Skill

## Overview

This skill governs the complete workflow for updating and extending a website — from scanning the current content and design system, to replacing outdated data, to scaffolding new pages that are indistinguishable from existing ones. Every update simultaneously satisfies SEO requirements (Google ranking signals) and AEO requirements (AI citation format), so content is optimized for both channels in a single pass.

**Two parallel tracks this skill manages:**
1. **Content track** — what the page says (copy, headings, meta, schema, FAQs)
2. **Design track** — how the page looks (layout, components, tokens, states)

Both tracks must complete before any file is written.

## Prerequisites

- Website codebase accessible (local project directory or cloned repo)
- `codebase-scanner-fast` agent available in `agents/`
- `ui-ux-engineer-fast` agent available in `agents/`
- `file-operations-fast` agent available in `agents/`
- New data to apply (provided by the user — headlines, copy, page descriptions, etc.)
- `SEO&AEO/seo-command.md` and `SEO&AEO/aeo-command.md` accessible for content standards reference
- For live audits: `web-scraper-fast` agent available in `agents/`

## Steps

### Step 1 — Extract the Design System

Before touching any file, build a complete picture of the site's visual language. Deploy `codebase-scanner-fast` to read:

**Component inventory:**
- Scan `src/components/`, `components/`, `app/components/`, or equivalent
- List every component by name and what it renders (card, hero, navbar, footer, button, badge, etc.)
- Note the component library (shadcn/ui, MUI, Radix, custom)

**Styling rules:**
- Read `tailwind.config.js` or `tailwind.config.ts` — extract all custom colors, spacing, and font definitions
- Read `globals.css`, `styles/`, or CSS variable definitions — extract design tokens
- Note if CSS Modules, styled-components, or SCSS is in use

**Layout pattern:**
- Read 2–3 existing page files to identify the layout shell (what wraps every page)
- Extract: container max-width, grid columns used, section padding convention, header height
- Note the nav pattern (sidebar vs. top nav, mobile hamburger behavior)

**Interactive conventions:**
- What hover classes are used on buttons and links?
- What focus ring style is applied? (`focus-visible:ring-2`, `focus:outline`, etc.)
- What loading pattern exists? (skeleton `animate-pulse`, spinner, or none)
- What transition duration and easing is used? (`transition-colors duration-200`, etc.)

**Design System Output (produce before Step 2):**
```
Component library: [value]
Styling: [Tailwind | CSS Modules | other]
Primary color class: [e.g. bg-blue-600 | bg-primary | var(--color-primary)]
Neutral color class: [e.g. text-zinc-900]
Body font: [e.g. font-sans | Inter | custom]
Heading size scale: [e.g. text-4xl for H1, text-2xl for H2, text-xl for H3]
Container: [e.g. max-w-7xl mx-auto px-4]
Section padding: [e.g. py-24 px-4]
Button primary: [exact classes]
Button hover: [exact classes]
Focus ring: [exact classes]
Loading pattern: [skeleton | spinner | none — exact classes]
Card pattern: [exact classes]
Layout shell: [file path and wrapper structure]
Page template to clone for new pages: [file path]
```

**Success Criteria:** Design System Output complete. A new page could be built using only these values and look native to the site.

---

### Step 2 — Audit Current Content State

Using `codebase-scanner-fast` (and `web-scraper-fast` if a live URL is provided), audit every page:

**Per page, check:**
- `<title>` tag: present? 50–60 chars? Primary keyword near the start?
- `<meta name="description">`: present? 150–160 chars?
- `<h1>`: single? Contains the primary keyword?
- `<h2>` / `<h3>`: are any question-format? (AEO signal)
- Content format: do sections open with a 40–60 word direct answer? (AEO signal)
- Supporting bullets after lead answer? (AEO signal)
- JSON-LD schema: present and valid?
- Old data: any outdated numbers, names, prices, or copy that needs replacing?

**Content Audit Output (produce before Step 3):**
```
Page: [route]
Title: [ok | issue — describe]
Meta description: [ok | issue]
H1: [ok | issue]
AEO content format: [ready | not ready — describe]
Schema: [present — type | missing]
Old data found: [list specific outdated content]
Action needed: [update copy | update meta | add schema | no changes]
```

**Success Criteria:** Every page assessed. Old data explicitly identified. Every page's action clearly stated.

---

### Step 3 — Content Replacement (Existing Pages)

For each page marked "update" in the Content Audit:

**Replacement rules:**
1. Replace only the text node content — never alter JSX/HTML structure, className, id, or aria attributes
2. For heading rewrites: convert to question-format where applicable ("About Us" → "What Does [Brand] Do?")
3. For body copy rewrites: open each section with a 40–60 word direct answer, follow with 3–5 bullets
4. For meta tag rewrites: title 50–60 chars (keyword first), description 150–160 chars (keyword + benefit + CTA)
5. For schema updates: maintain valid JSON, update only the changed fields (name, description, services, etc.)

**Before replacing any content, state:**
- File path
- Current content (exact string being replaced)
- New content (exact replacement)
- Why: SEO fix / AEO fix / data update / both

**Success Criteria:** All old data replaced. No structural changes to JSX/HTML. All replaced sections pass AEO format check (40–60 word lead + bullets).

---

### Step 4 — New Page Scaffolding

For each page that needs to be created:

**Pre-scaffold checklist (must pass before writing the file):**
- [ ] Page route confirmed (e.g., `/services`, `/about`)
- [ ] Layout shell identified — which file to clone the wrapper from
- [ ] All sections planned (hero, feature list, FAQ, CTA, etc.)
- [ ] Component for each section identified from the component inventory
- [ ] Primary keyword for the page defined
- [ ] Schema type identified (Service, FAQPage, AboutPage, etc.)

**Page structure (every new page must follow this):**

```tsx
// Layout: always matches existing page wrapper
export default function NewPage() {
  return (
    <main>
      {/* Hero — 40-60 word direct answer as lead paragraph */}
      <section className="[match existing hero classes]">
        <div className="[match existing container classes]">
          <h1 className="[match existing H1 classes]">[Keyword-rich, direct H1]</h1>
          <p className="[match existing lead paragraph classes]">
            [40-60 word direct answer — entity + category + location + differentiator]
          </p>
        </div>
      </section>

      {/* Content sections — question-format H2s, bullets after lead answer */}
      <section className="[match existing section classes]">
        <div className="[match existing container classes]">
          <h2 className="[match existing H2 classes]">[What is...? / How does...? / Why...?]</h2>
          <p>[40-60 word lead answer]</p>
          <ul>
            <li>[Specific supporting point]</li>
            <li>[Specific supporting point]</li>
            <li>[Specific supporting point]</li>
          </ul>
        </div>
      </section>

      {/* FAQ — always present, 5-8 Q&As */}
      <section className="[match existing section classes]">
        <h2 className="[match existing H2 classes]">Frequently Asked Questions</h2>
        {/* FAQ items using existing Accordion/Disclosure component if present */}
      </section>

      {/* CTA — matches existing CTA pattern */}
    </main>
  )
}
```

**SEO + AEO requirements baked into every new page at creation:**
- Meta title: 50–60 chars, keyword in first 30 chars, brand at end
- Meta description: 150–160 chars, keyword + benefit + CTA
- JSON-LD schema block for the page type, embedded in `<head>` or via metadata API
- H1 contains primary keyword
- First section: 40–60 word lead answer + bullets
- At least 2 question-format H2s
- FAQ section with 5–8 Q&As

**Interactive states on every new page:**
- All buttons: `hover:`, `focus-visible:`, `active:`, `disabled:` — matching existing button classes
- All links: `hover:`, `focus-visible:` — matching existing link styles
- All data-fetched sections: loading skeleton (matching existing `animate-pulse` pattern), empty state with CTA, error state with recovery message

**Success Criteria:** New page file created. All design system values match existing pages exactly. All SEO/AEO requirements met. All interactive states present.

---

### Step 5 — Validate All Changes

After all updates and new pages are written, validate:

**Content validation:**
- [ ] All old data replaced — no outdated strings remain
- [ ] All meta tags updated and within character limits
- [ ] All H1s are single and keyword-containing
- [ ] All new and updated sections open with 40–60 word lead answer
- [ ] JSON-LD present and syntactically valid on all pages

**Design validation:**
- [ ] New pages use the exact same layout shell as existing pages
- [ ] All components sourced from the existing component inventory
- [ ] No hardcoded color values — only design token classes or CSS variables
- [ ] No arbitrary spacing values — only the spacing scale
- [ ] Loading, empty, and error states present on all data-dependent sections
- [ ] All interactive states match the existing pattern

**Success Criteria:** All checklist items pass. No inconsistencies between new and existing pages.

## Verification

After applying this skill, verify:
- [ ] Design System Report produced and complete before any file was written
- [ ] Content Audit Report produced and complete before any file was written
- [ ] All old data replaced with no structural changes to existing files
- [ ] New pages match existing design system (layout, components, tokens, states)
- [ ] Every page (new and updated) meets SEO requirements (title, meta, H1, schema)
- [ ] Every page (new and updated) meets AEO requirements (40–60w leads, question H2s, bullets, FAQ)
- [ ] All interactive states present and matching existing conventions
- [ ] No hardcoded values, no new dependencies introduced without noting them

## Related

- Command: `UI/web-update-command.md` — the `/web-update` command that uses this skill
- Command: `SEO&AEO/search-command.md` — unified SEO+AEO optimization reference
- Command: `SEO&AEO/seo-command.md` — SEO content and technical standards
- Command: `SEO&AEO/aeo-command.md` — AEO content format and citation standards
- Command: `commands/scrape.md` — use to pull live page content for baseline audit
- Agent: `agents/ui-ux-engineer-fast.md` — creates new page files
- Agent: `agents/codebase-scanner-fast.md` — extracts design system and content state
- Agent: `agents/file-operations-fast.md` — replaces content in existing files
