---
name: ui-tailwind-templates
description: Use Tailwind Plus premium templates (https://tailwindcss.com/plus/templates) as the structural baseline for scaffolding full sites and application shells. Covers template category selection, file structure generation, and adaptation to the detected project design system.
when_to_use: When /ui template is invoked, when /ui setup recommends a template, or when /ui page needs a full-site structural baseline.
evidence: User mentions "template", "scaffold site", "starting point", "full app shell", or invokes /ui template [name].
---

# Tailwind Plus Templates Skill

## Overview

Tailwind Plus Templates are premium, full-site starting points built on Tailwind CSS. This skill guides the selection, adaptation, and scaffolding of these templates — producing a complete file structure and starter code that matches the detected project stack.

Reference: https://tailwindcss.com/plus/templates

## Prerequisites

- `project-config.json` must exist — run `/ui setup` first if missing
- `UI_KNOWLEDGE.md` must be loaded (§1.1 Templates section)
- Target framework detected (Next.js, React, Vue, or HTML)

## Steps

### Step 1 — Select Template Category

Map the user's request or `projectType` from config to a template category:

| User Request / Project Type | Template Category | Key Sections |
|----------------------------|-------------------|-------------|
| `saas` / "SaaS app" | **SaaS Application** | App shell, Dashboard, Settings, Auth |
| `marketing` / "landing page" | **Marketing Site** | Hero, Features, Pricing, CTA, Footer |
| `ecommerce` / "shop" | **E-Commerce** | Product grid, Product detail, Cart, Checkout |
| `blog` / "content site" | **Blog** | Index, Article, Author, Tag archive |
| `docs` / "documentation" | **Documentation** | Sidebar nav, Content, Code blocks, API ref |
| `dashboard` / "admin" | **Admin Dashboard** | Sidebar, Stat cards, Tables, Charts |

**Success Criteria:** Template category selected and justified.

---

### Step 2 — Generate File Structure

Produce the complete file tree for the selected template. Example for **Marketing Site**:

```
[srcDir]/
├── app/                          # or pages/ for Next.js Pages Router
│   ├── page.tsx                  # Home / Landing page
│   ├── pricing/page.tsx          # Pricing page
│   ├── about/page.tsx            # About page
│   └── layout.tsx                # Root layout with nav + footer
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Site footer
│   ├── marketing/
│   │   ├── HeroSection.tsx       # Hero block
│   │   ├── FeaturesSection.tsx   # Feature grid
│   │   ├── PricingSection.tsx    # Pricing tiers
│   │   ├── TestimonialsSection.tsx
│   │   ├── CtaSection.tsx        # Call to action
│   │   └── LogoCloud.tsx         # Logo strip
│   └── ui/
│       ├── Button.tsx            # Primary/secondary button variants
│       ├── Badge.tsx             # Status badge
│       └── Container.tsx         # Max-width container wrapper
└── styles/
    └── globals.css               # Tailwind directives
```

**Success Criteria:** File tree output before any code generation.

---

### Step 3 — Generate Layout Components First

Always generate shared layout components before page components:

1. **Container.tsx** — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
2. **Header.tsx** — responsive navigation using UI Kit navbar pattern
3. **Footer.tsx** — footer block from UI Blocks

**Success Criteria:** Layout components generated and self-contained.

---

### Step 4 — Generate Page Components

Generate each page component, composing from the marketing blocks. Each page:
- Imports layout components
- Imports marketing section components
- Returns a single JSX tree: `<Header /> + <main> [sections] </main> + <Footer />`

**Success Criteria:** Each page file is complete, importable, and renders without errors.

---

### Step 5 — Apply Project Design Tokens

Replace template defaults with the project's detected tokens from `project-config.json`:

| Template Default | Project Token |
|-----------------|--------------|
| `blue-600` (primary) | `[primaryColor]-600` |
| `Inter` font | `[fontFamily]` |
| `rounded-md` | `rounded-[borderRadius]` |

**Success Criteria:** All color, font, and border-radius classes updated to match project config.

---

### Step 6 — Output Scaffold Summary

```
## Template Scaffold: [Category Name]
**Source:** https://tailwindcss.com/plus/templates
**Files generated:** [N] files

### File Tree
[output tree]

### Next Steps
1. Add your content to each section component
2. Update color tokens in tailwind.config.js if adjustments needed
3. Run `/ui audit` to verify responsive and accessibility compliance
```

## Verification

- [ ] Template category selected and matches project type
- [ ] Full file tree output before code generation
- [ ] Layout components generated before page components
- [ ] Project design tokens applied (no default blue-600 remaining unless project uses blue)
- [ ] All files include `/* Source: Tailwind Plus Templates — [Category] */` comment

## Related

- `f:\Prime\UI_Command\UI_KNOWLEDGE.md` — §1.1 for template characteristics
- `f:\Prime\.cursor\skills\ui-tailwind-blocks\SKILL.md` — for block-level detail
- `f:\Prime\.cursor\skills\ui-component-builder\SKILL.md` — for shared UI components
