---
name: headless-ui-patterns
description: Headless UI usage patterns (Dialog/Menu/Popover), accessibility checks, class composition
when_to_use: |
  Use when building modals, dropdowns, tabs, or mobile nav with Headless UI.
  Trigger phrases: "Headless UI", "Dialog", "Popover", "Menu", "Tab", "Disclosure", "accessibility"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  session_count: 1
  validation: .cursorrules, techContext.md, prime-electrical Header.tsx
source_learnings:
  - "Headless UI + clsx patterns"
---

# Headless UI Patterns

## Overview

United Trades uses `@headlessui/react` (v2) with `clsx` for conditional classes. No Radix UI — use Headless UI per `.cursor/rules/react-patterns.mdc`. Components: Dialog, Popover, Menu, Tab, Disclosure.

## Prerequisites

- Verify `@headlessui/react` and `clsx` in `package.json`
- Read existing component before adding similar (e.g., `Header.tsx` for Popover)
- Use Tailwind v4 — no tailwind.config.js; theme via `@theme {}` in CSS

## Component Patterns

### Dialog (Modal)
**Action:** Use `Dialog`, `DialogPanel`, `DialogTitle`; ensure `DialogTitle` for accessibility.
**Success Criteria:** Focus trapped; Escape closes; `aria-labelledby` via DialogTitle.
**Example:**
```tsx
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
<Dialog open={open} onClose={setOpen}>
  <DialogPanel className="...">
    <DialogTitle>Modal Title</DialogTitle>
    ...
  </DialogPanel>
</Dialog>
```

### Popover (Dropdown / Mobile Nav)
**Action:** Use `Popover`, `PopoverButton`, `PopoverPanel`, `PopoverBackdrop` (v2).
**Success Criteria:** `PopoverButton` has `aria-label`; panel uses `transition` + `data-closed` for animations.
**Verification:** Read `prime-electrical/src/components/Header.tsx` for live pattern.

### Menu (Action Menu)
**Action:** Use `Menu`, `MenuButton`, `MenuItems`, `MenuItem`.
**Success Criteria:** Keyboard navigable; `MenuItems` positioned correctly (absolute).

### Tab
**Action:** Use `TabGroup`, `TabList`, `Tab`, `TabPanel`, `TabPanels`.
**Success Criteria:** Tabs keyboard-navigable; panels show/hide by selected tab.

## Class Composition with clsx

**Action:** Use `clsx` for conditional classes; never string concatenation.
**Example:**
```tsx
className={clsx(
  'base-classes',
  open && 'open-state-classes',
  variant === 'primary' && 'variant-classes',
  className
)}
```

## Accessibility Checklist

- [ ] `DialogTitle` or `aria-label` on trigger
- [ ] Focus management (Headless handles by default)
- [ ] `data-closed` / `data-open` for transition states (v2)
- [ ] No `tabIndex` hacks unless verified needed

## Verification

- [ ] Import from `@headlessui/react` (verify package exists)
- [ ] Use clsx for conditional classes
- [ ] Match existing site patterns (read Header, PrimaryFeatures)
- [ ] No Radix UI imports

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Import from `@radix-ui/*` | Use Headless UI |
| `className={open ? 'a' : 'b'}` | `clsx('base', open && 'a')` |
| Skip DialogTitle | Add DialogTitle for screen readers |
| Assume v1 API | Headless v2 uses PopoverBackdrop, data-closed |

## Related

- `.cursor/rules/ui-styling.mdc` — Tailwind + clsx
- `.cursor/rules/react-patterns.mdc` — No Radix, use Headless
- `prime-electrical/src/components/Header.tsx` — Popover example
