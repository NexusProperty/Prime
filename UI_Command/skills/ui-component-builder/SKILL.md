---
name: ui-component-builder
description: Build any reusable UI component — buttons, cards, badges, inputs, avatars, loading states, empty states, and more — following Tailwind Plus design system conventions, with TypeScript props, dark mode, responsive design, and accessibility built in.
when_to_use: When building non-interactive or lightly-interactive components (buttons, cards, badges, inputs without Headless UI), or when composing UI elements that don't require complex state management.
evidence: User asks to "build", "create", or "generate" a component — especially buttons, cards, badges, inputs, avatars, tags, labels, or any "primitive" UI element.
---

# UI Component Builder Skill

## Overview

This skill handles the generation of reusable UI components that form the atomic and molecular layer of a design system. These are the building blocks that compose into blocks (handled by `ui-tailwind-blocks`) and pages. All components follow the Tailwind Plus design system conventions.

## Prerequisites

- `project-config.json` loaded (for framework, TypeScript, primary color)
- `UI_KNOWLEDGE.md` §5 loaded (file conventions)

## Steps

### Step 1 — Classify the Component

Determine the component tier:

| Tier | Examples | Complexity |
|------|---------|-----------|
| **Atom** | Button, Badge, Avatar, Icon, Spinner | Single element, minimal state |
| **Molecule** | Input group, Card, Alert, Toast, Tag list | 2-5 elements, one interaction |
| **Organism** | Form, Data table, Navigation, Sidebar | Multiple molecules, complex state |

**Success Criteria:** Tier determined — this governs complexity and state management approach.

---

### Step 2 — Define the Props Interface

Map every visual variation to a prop:

```tsx
// Atom example — Button
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
}
```

**Success Criteria:** ALL visual and behavioral variations expressible via props.

---

### Step 3 — Build the Variant System

Use a `variants` object (or `cva` if installed) for class mapping:

```tsx
const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600',
  secondary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-700',
  ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}
```

**Success Criteria:** Every variant produces distinct, correct Tailwind classes.

---

### Step 4 — Implement State Classes

All interactive components MUST implement ALL states:

| State | Class pattern |
|-------|--------------|
| Default | Base classes |
| Hover | `hover:` prefix |
| Focus | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color]` |
| Active | `active:scale-95` or color shift |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Loading | Replace content with spinner, prevent clicks |

**Success Criteria:** All 5 states implemented.

---

### Step 5 — Build the Loading State

For buttons and other interactive elements, always include a loading variant:

```tsx
{loading ? (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
) : children}
```

**Success Criteria:** Loading state implemented for all interactive components.

---

### Step 6 — Apply Dark Mode

Replace ALL color utilities with dark mode pairs:

| Light | Dark |
|-------|------|
| `bg-white` | `dark:bg-gray-800` |
| `bg-gray-50` | `dark:bg-gray-900` |
| `text-gray-900` | `dark:text-white` |
| `text-gray-600` | `dark:text-gray-400` |
| `border-gray-200` | `dark:border-gray-700` |
| `ring-gray-300` | `dark:ring-gray-600` |

**Success Criteria:** Zero color classes without a `dark:` counterpart.

---

### Step 7 — Output Component

Return:
1. Rationale table
2. Full component code
3. All variant examples in a usage snippet:

```tsx
// Usage examples
<Button variant="primary" size="md">Save changes</Button>
<Button variant="secondary" size="md" leftIcon={<PlusIcon />}>Add item</Button>
<Button variant="danger" size="sm" loading={isDeleting}>Delete</Button>
<Button variant="ghost" disabled>Unavailable</Button>
```

## Verification

- [ ] Props interface covers all visual and behavioral variants
- [ ] Variant system maps all props to Tailwind classes (no if/else soup)
- [ ] All 5 interactive states implemented (default, hover, focus, disabled, loading)
- [ ] Dark mode on every color class
- [ ] Source comment at top: `/* Source: Tailwind Plus UI Kit — [category] */`
- [ ] Named export matching PascalCase file name
- [ ] Usage example includes all variant combinations

## Related

- `f:\PromptAI\UI_Command\skills\ui-tailwind-ui-kit\SKILL.md` — for interactive components requiring Headless UI
- `f:\PromptAI\UI_Command\skills\ui-accessibility\SKILL.md` — for accessibility requirements
- `f:\PromptAI\UI_Command\UI_KNOWLEDGE.md` — §4 common mistakes, §5 file conventions
