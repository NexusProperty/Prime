---
name: ui-tailwind-ui-kit
description: Build production-ready UI components using the Tailwind Plus UI Kit (https://tailwindcss.com/plus/ui-kit) — covering application UI, overlays, navigation, data display, forms, and feedback components with Headless UI integration.
when_to_use: When /ui component is invoked, when /ui page needs interactive UI elements (modals, dropdowns, forms, tables), or when building application-level UI (not just marketing pages).
evidence: User mentions "component", "modal", "dropdown", "form", "table", "navigation", "tabs", "dialog", "combobox", or any specific UI Kit component category.
---

# Tailwind Plus UI Kit Skill

## Overview

The Tailwind Plus UI Kit provides production-ready React components built on Headless UI + Tailwind CSS. This skill implements the correct patterns for each component category — ensuring accessibility, keyboard navigation, and composability are built in from the start.

Reference: https://tailwindcss.com/plus/ui-kit

## Prerequisites

- `@headlessui/react` installed (or document that it's needed)
- `project-config.json` loaded — to know framework and TypeScript usage
- `UI_KNOWLEDGE.md` §1.2 loaded for component category reference

## Steps

### Step 1 — Identify Component Category

Map the user's request to a UI Kit category:

| User Request | UI Kit Category | Headless UI Component |
|-------------|-----------------|----------------------|
| "modal", "dialog", "popup" | Overlays | `Dialog` |
| "dropdown menu", "context menu" | Overlays | `Menu` |
| "select", "dropdown list" | Forms | `Listbox` |
| "search with autocomplete", "combobox" | Forms | `Combobox` |
| "tabs", "tab panels" | Navigation | `Tab` |
| "accordion", "collapsible" | Navigation | `Disclosure` |
| "notification", "toast" | Overlays | Custom with transition |
| "table with sort/filter" | Data Display | Custom (no Headless UI) |
| "sidebar navigation" | Application UI | `Disclosure` or custom |
| "toggle switch" | Forms | `Switch` |
| "radio group" | Forms | `RadioGroup` |

**Success Criteria:** Component category and Headless UI primitive identified.

---

### Step 2 — Generate Component Shell

Follow this structure for EVERY UI Kit component:

```tsx
/* Source: Tailwind Plus UI Kit — [Category] */

'use client' // Add for Next.js App Router interactive components

import { [HeadlessUIComponent] } from '@headlessui/react'
import { [Icons] } from '@heroicons/react/24/outline' // if needed

interface [ComponentName]Props {
  // props here
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  // state here (useState, useRef)
  
  return (
    // JSX here
  )
}
```

**Success Criteria:** Shell follows the exact structure above.

---

### Step 3 — Implement Headless UI Patterns

**Dialog (Modal) pattern:**
```tsx
<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </DialogTitle>
      {children}
    </DialogPanel>
  </div>
</Dialog>
```

**Menu (Dropdown) pattern:**
```tsx
<Menu as="div" className="relative">
  <MenuButton className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
    {label}
    <ChevronDownIcon className="h-4 w-4" />
  </MenuButton>
  <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
    {items.map(item => (
      <MenuItem key={item.label}>
        {({ active }) => (
          <button
            className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200`}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        )}
      </MenuItem>
    ))}
  </MenuItems>
</Menu>
```

**Success Criteria:** Correct Headless UI component used with all required child components.

---

### Step 4 — Add Transitions

All overlays (Dialog, Menu, Popover) MUST include transitions:

```tsx
import { Transition, TransitionChild } from '@headlessui/react'

<Transition show={isOpen}>
  <TransitionChild
    enter="transition ease-out duration-200"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="transition ease-in duration-150"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
  >
    {/* overlay content */}
  </TransitionChild>
</Transition>
```

**Success Criteria:** All interactive overlays have enter/leave transitions.

---

### Step 5 — Verify Accessibility

Check each component against this list:
- [ ] `aria-label` or `aria-labelledby` on all dialogs and menus
- [ ] `aria-expanded` on triggers that toggle content
- [ ] `aria-current="page"` on active navigation items
- [ ] `role="alert"` on toast/notification components
- [ ] `aria-live="polite"` on dynamically updated regions
- [ ] Focus trapped inside modals (Headless UI handles this automatically)
- [ ] Keyboard navigation: Enter/Space to open, Escape to close, Arrow keys for menu items

**Success Criteria:** All accessibility attributes present and correct.

---

### Step 6 — Output Component

Return the complete component with:
1. Rationale table (component type → UI Kit source)
2. Full component code
3. Usage example with realistic props
4. Any required package installations (`npm install @headlessui/react @heroicons/react`)

## Verification

- [ ] Component uses correct Headless UI primitive (not custom-rolled for Dialog, Menu, Listbox, etc.)
- [ ] Transitions implemented for all overlays
- [ ] Dark mode variants on all color classes
- [ ] TypeScript interface defined for props
- [ ] `'use client'` directive present for Next.js App Router interactive components
- [ ] Aria attributes complete

## Related

- `f:\PromptAI\UI_Command\UI_KNOWLEDGE.md` — §1.2 for full UI Kit component map
- `f:\PromptAI\UI_Command\skills\ui-accessibility\SKILL.md` — for deep accessibility requirements
- `f:\PromptAI\UI_Command\skills\ui-component-builder\SKILL.md` — for non-interactive component patterns
