---
name: radix-ui-e2e
description: Patterns for testing Radix UI components (especially Select) in Playwright E2E tests
when_to_use: |
  Use when testing Radix UI Select, Dropdown, or Dialog components in E2E.
  Trigger phrases: "Radix Select", "dropdown test", "select component E2E", "Radix UI testing"
evidence:
  first_observed: 2026-02-12
  last_confirmed: 2026-02-12
  session_count: 1
  validation: ORION-013 Phases C, D, E all required this pattern
source_learnings:
  - "Radix UI E2E Handling"
---

# Radix UI E2E Handling

## Overview

Radix UI components (especially Select, Dropdown, Dialog) have overlay behavior that can block normal Playwright interactions. This skill documents the patterns needed to reliably test these components.

**Evidence:** ORION-013 Phases C, D, and E all encountered Radix Select behavior requiring special handling.

## Prerequisites

- Radix UI components in the application
- Playwright test environment
- Understanding of component's `data-testid` structure

## Steps

### Step 1: Identify Radix Components
**Action:** Check if the component uses Radix UI primitives.
**Success Criteria:** Component type identified (Select, Dialog, Dropdown, etc.).
**Indicators:**
- Import from `@radix-ui/*`
- Uses `SelectTrigger`, `SelectContent`, `SelectItem`
- Has overlay/portal behavior

### Step 2: Click with Force
**Action:** Use `force: true` when clicking Radix triggers.
**Success Criteria:** Click registers despite overlay.
**Example:**
```typescript
await page.getByTestId('property-select-trigger').click({ force: true });
```

### Step 3: Wait for Dropdown Animation
**Action:** Add ~300ms wait after opening dropdowns.
**Success Criteria:** Options are visible and clickable.
**Example:**
```typescript
await page.waitForTimeout(300);
```

### Step 4: Select Option
**Action:** Click the desired option, also with force if needed.
**Success Criteria:** Option selected, dropdown closes.
**Example:**
```typescript
await page.getByRole('option', { name: 'Property Type' }).click({ force: true });
```

### Step 5: Verify Selection
**Action:** Assert the selected value is displayed.
**Success Criteria:** Trigger shows selected value.
**Example:**
```typescript
await expect(page.getByTestId('property-select-trigger')).toContainText('Property Type');
```

## Complete Pattern

```typescript
// Open Radix Select
await page.getByTestId('generate-report-property-select').click({ force: true });
await page.waitForTimeout(300);

// Select option
await page.getByRole('option', { name: /123 Main St/i }).click({ force: true });

// Verify selection
await expect(page.getByTestId('generate-report-property-select')).toContainText('123 Main St');
```

## Verification

- [ ] Click uses `force: true`
- [ ] Wait added after opening (300ms)
- [ ] Option selection uses force if needed
- [ ] Selection verified after closing

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Click doesn't register | Add `force: true` |
| Options not visible | Increase wait time to 500ms |
| Wrong option selected | Use more specific selector (role + name) |
| Dropdown doesn't close | Click outside or press Escape |

## Related

- Learnings: `memory-bank/learnings.md` (Radix UI E2E Handling)
- Source: ORION-013 Phases C, D, E
