---
name: ui-tailwind-blocks
description: Generate self-contained marketing section blocks using Tailwind Plus UI Blocks (https://tailwindcss.com/plus/ui-blocks/marketing). Covers all 13 block categories — hero, features, pricing, CTA, testimonials, team, logos, stats, FAQ, newsletter, contact, header, and footer.
when_to_use: When /ui block [type] is invoked, when /ui page needs specific marketing sections, or when the user asks for any named marketing section (hero, pricing section, testimonials, etc.).
evidence: User mentions a specific marketing section by name (hero, features, pricing, CTA, testimonials, footer, etc.), invokes /ui block, or /ui page requests a marketing layout.
---

# Tailwind Plus UI Blocks Skill

## Overview

Tailwind Plus UI Blocks are pre-designed, self-contained HTML/JSX sections for marketing pages. This skill implements each block category with full responsive design, dark mode support, and proper Tailwind CSS class conventions.

Reference: https://tailwindcss.com/plus/ui-blocks/marketing

## Prerequisites

- `project-config.json` loaded — for color tokens and framework
- `UI_KNOWLEDGE.md` §1.3 loaded for block category reference

## Steps

### Step 1 — Identify Block Type and Variant

Map the user's request to a block type and choose the appropriate variant:

| Block Type | Variants | Best For |
|------------|----------|---------|
| `hero` | full-width, split, app-screenshot, gradient | Primary landing page opener |
| `features` | 3-col icons, screenshot left/right, alternating | Product feature showcase |
| `pricing` | 2-tier, 3-tier, comparison table | SaaS/product pricing |
| `cta` | simple, image background, newsletter | Conversion section |
| `testimonials` | grid, carousel, large quote | Social proof |
| `team` | card grid, list, avatar row | About/team page |
| `logos` | simple grid, scrolling strip, with heading | Trust signals |
| `stats` | numbers grid, with description, banner | Impact metrics |
| `faq` | two-column accordion, simple list | Common questions |
| `newsletter` | inline, centered, split | Email capture |
| `contact` | split with map, simple form, contact info | Contact page |
| `header` | simple centered, flyout menus, dark | Site header/navbar |
| `footer` | simple, multi-column, with newsletter | Site footer |

**Success Criteria:** Block type and variant identified.

---

### Step 2 — Apply Block Structure Standards

All blocks follow this structure:

```tsx
/* Source: Tailwind Plus UI Blocks — [Block Type] */

interface [BlockName]Props {
  // props for the block content
}

export function [BlockName]({ ... }: [BlockName]Props) {
  return (
    <section className="[background] py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* block content */}
      </div>
    </section>
  )
}
```

Background by alternating sections:
- Odd sections: `bg-white dark:bg-gray-900`
- Even sections: `bg-gray-50 dark:bg-gray-800`
- Accent/CTA: `bg-[primaryColor]-600` or gradient

**Success Criteria:** Block uses `<section>` wrapper with correct padding and container.

---

### Step 3 — Block-Specific Implementation Patterns

**Hero Block (full-width with CTA):**
```tsx
<section className="bg-white dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        {headline}
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {subheadline}
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a href={primaryCtaHref} className="rounded-md bg-[primary]-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[primary]-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[primary]-600">
          {primaryCtaLabel}
        </a>
        <a href={secondaryCtaHref} className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
          {secondaryCtaLabel} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </div>
</section>
```

**Features Block (3-column with icons):**
```tsx
<section className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-2xl lg:text-center">
      <h2 className="text-base font-semibold leading-7 text-[primary]-600">{eyebrow}</h2>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{headline}</p>
      <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.name} className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
              <feature.icon className="h-5 w-5 flex-none text-[primary]-600" aria-hidden="true" />
              {feature.name}
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
              <p className="flex-auto">{feature.description}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
</section>
```

**Pricing Block (3-tier):**
```tsx
<section className="bg-white dark:bg-gray-900 py-24 sm:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl text-center">
      <h2 className="text-base font-semibold leading-7 text-[primary]-600">{eyebrow}</h2>
      <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{headline}</p>
    </div>
    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {tiers.map((tier, tierIdx) => (
        <div key={tier.id} className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-8 ring-1 ring-gray-200 dark:ring-gray-700 xl:p-10 ${tier.featured ? 'bg-gray-900 dark:bg-gray-700 ring-gray-900 dark:ring-gray-500' : ''}`}>
          {/* tier content */}
        </div>
      ))}
    </div>
  </div>
</section>
```

**Success Criteria:** Block-specific pattern applied with correct structure.

---

### Step 4 — Wire Up Content Props

Every block must accept props for ALL text content — never hardcode marketing copy:

```tsx
interface HeroSectionProps {
  headline: string
  subheadline: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  backgroundImage?: string
}
```

**Success Criteria:** All text content is configurable via props.

---

### Step 5 — Verify Block Quality

- [ ] Uses `<section>` as outermost element
- [ ] Responsive padding: `py-16 sm:py-24 lg:py-32`
- [ ] Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Dark mode: all background and text colors have `dark:` variants
- [ ] Mobile-first: layout starts single-column, expands via `sm:` / `lg:` / `xl:`
- [ ] All text content is driven by props (no hardcoded copy)
- [ ] Source comment at top of file

## Verification

- [ ] Block type and variant identified before code generation
- [ ] Correct block pattern applied from Step 3
- [ ] All props defined in interface
- [ ] Dark mode variants on all colors
- [ ] Responsive classes at all breakpoints
- [ ] `/* Source: Tailwind Plus UI Blocks — [type] */` comment in file

## Related

- `f:\Prime\UI_Command\UI_KNOWLEDGE.md` — §1.3 for full block category reference
- `f:\Prime\.cursor\skills\ui-tailwind-templates\SKILL.md` — for assembling blocks into pages
- `f:\Prime\.cursor\skills\ui-responsive-design\SKILL.md` — for responsive verification
