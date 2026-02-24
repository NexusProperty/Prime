---
name: ui-responsive-design
description: Implement and audit mobile-first responsive design using Tailwind CSS breakpoints. Enforces the Tailwind Plus responsive conventions across all layouts, grids, typography, and spacing.
when_to_use: For ALL /ui command modes — every component and page generated must pass the responsive design checklist. Also invoked standalone during /ui audit for responsive-only verification.
evidence: User mentions responsive, mobile, breakpoints, layout issues, small screen, or requests audit of existing code.
---

# Responsive Design Skill

## Overview

This skill enforces mobile-first responsive design across all UI output from the `/ui` command. It covers the Tailwind CSS breakpoint system, Tailwind Plus responsive conventions, layout patterns, grid systems, and typography scaling.

## Prerequisites

- `UI_KNOWLEDGE.md` §1 loaded for Tailwind Plus responsive patterns
- `project-config.json` loaded for framework context

## Steps

### Step 1 — Confirm Mobile-First Baseline

The mobile layout (no prefix) must be complete and usable on its own. Check:

- [ ] Is the layout functional at 320px width? (minimum supported)
- [ ] Does all content remain readable without horizontal scrolling?
- [ ] Are touch targets at least 44×44px (minimum tap target)?
- [ ] Is font size at least `text-base` (16px) for body content?

**Success Criteria:** Mobile layout is complete and usable without any responsive prefix.

---

### Step 2 — Apply Tailwind Breakpoint System

| Prefix | Min-width | Device target |
|--------|-----------|--------------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Large mobile / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Extra large desktop |

**Standard responsive patterns from Tailwind Plus:**

```
Container:    px-4 sm:px-6 lg:px-8
Section:      py-16 sm:py-24 lg:py-32
Grid 1→2→3:  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8
Grid 1→2:    grid-cols-1 md:grid-cols-2 gap-6
Flex wrap:   flex flex-col sm:flex-row gap-4
Text scale:  text-3xl sm:text-4xl lg:text-5xl xl:text-6xl (for headlines)
```

**Success Criteria:** At least `sm:` and `lg:` breakpoints applied to all layout and spacing classes.

---

### Step 3 — Responsive Navigation Pattern

Navigation MUST implement:

```tsx
// Mobile: hidden, shown via hamburger button
<nav>
  {/* Desktop nav — hidden on mobile */}
  <div className="hidden lg:flex items-center gap-8">
    {navLinks}
  </div>
  
  {/* Mobile hamburger — hidden on desktop */}
  <button className="lg:hidden" aria-label="Open menu" aria-expanded={isMenuOpen}>
    <Bars3Icon className="h-6 w-6" />
  </button>
  
  {/* Mobile menu — slides in or drops down */}
  {isMenuOpen && (
    <div className="lg:hidden absolute inset-x-0 top-full bg-white dark:bg-gray-900 shadow-lg">
      {navLinks}
    </div>
  )}
</nav>
```

**Success Criteria:** Navigation fully functional on mobile and desktop.

---

### Step 4 — Responsive Typography Scale

Apply these scales for all headings (from Tailwind Plus templates):

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| H1 (hero) | `text-4xl` | `sm:text-5xl` | `lg:text-6xl` |
| H1 (page) | `text-3xl` | `sm:text-4xl` | — |
| H2 (section) | `text-2xl` | `sm:text-3xl` | `lg:text-4xl` |
| H3 (card) | `text-xl` | — | — |
| Body | `text-base` | — | — |
| Caption | `text-sm` | — | — |

**Success Criteria:** All headings use responsive text size classes.

---

### Step 5 — Image Responsiveness

All images must be responsive:

```tsx
// Next.js Image component (preferred)
<Image
  src={src}
  alt={alt}
  width={1200}
  height={630}
  className="w-full h-auto rounded-lg object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// Standard img (fallback)
<img
  src={src}
  alt={alt}
  className="w-full h-auto max-w-full object-cover"
  loading="lazy"
/>
```

**Success Criteria:** All images use `w-full h-auto` and appropriate `sizes` attribute.

---

### Step 6 — Responsive Audit Checklist

When running `/ui audit` responsive check, verify each file for:

| Check | Pass Condition |
|-------|---------------|
| Container padding | `px-4 sm:px-6 lg:px-8` pattern used |
| Section padding | `py-16 sm:py-24` or similar responsive vertical |
| Grid columns | Always starts at `grid-cols-1` |
| Flex direction | Starts `flex-col`, adds `sm:flex-row` as needed |
| Hidden/show | `hidden lg:flex` (not `display: none` in CSS) |
| Font sizes | Headings have `sm:` or `lg:` size steps |
| Touch targets | Interactive elements min 44px height |
| Images | `w-full h-auto` present |

Report format:
```
## Responsive Audit: [filename]
| Issue | Severity | Line | Fix |
| :--- | :--- | :--- | :--- |
| Missing sm: breakpoint on grid | Medium | 42 | Add sm:grid-cols-2 |
```

## Verification

- [ ] Mobile baseline complete (no prefix layout works standalone)
- [ ] `sm:` and `lg:` breakpoints applied to all layout, grid, padding, and font classes
- [ ] Navigation has mobile hamburger + desktop horizontal layout
- [ ] All images use `w-full h-auto`
- [ ] No hardcoded pixel widths that break on mobile

## Related

- `f:\PromptAI\UI_Command\UI_KNOWLEDGE.md` — §1 for Tailwind Plus responsive patterns
- `f:\PromptAI\UI_Command\skills\ui-accessibility\SKILL.md` — touch target requirements
- `f:\PromptAI\UI_Command\rules\ui-builder.mdc` — §2 responsive rules
