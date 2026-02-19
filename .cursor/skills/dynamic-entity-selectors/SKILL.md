---
name: dynamic-entity-selectors
description: Pattern for targeting specific entity cards (properties, reports, etc.) using dynamic data-testid selectors
when_to_use: |
  Use when writing E2E tests that target specific entity cards in lists.
  Trigger phrases: "property card test", "report card selector", "entity list E2E", "dynamic testid"
evidence:
  first_observed: 2026-02-12
  last_confirmed: 2026-02-12
  session_count: 1
  validation: ORION-013 Phases C and D use this pattern
source_learnings:
  - "Dynamic Entity Selector Pattern"
---

# Dynamic Entity Selector Pattern

## Overview

When testing entity cards (properties, reports, users, etc.), use dynamic selectors that incorporate the entity ID rather than generic selectors. This enables targeting specific entities and avoids brittleness from list ordering.

**Evidence:** ORION-013 Phases C and D use `property-card-${id}` and `report-card-${id}` patterns.

## Prerequisites

- Entity cards with `data-testid` that includes entity ID
- Known entity ID (from test fixtures or creation)
- Component structure: `data-testid="entity-card-${entity.id}"`

## Steps

### Step 1: Verify Component Pattern
**Action:** Read the entity card component to confirm dynamic testid pattern.
**Success Criteria:** Pattern documented (e.g., `property-card-${property.id}`).
**Example:**
```tsx
// PropertyCard.tsx
<Card data-testid={`property-card-${property.id}`}>
```

### Step 2: Get Entity ID
**Action:** Obtain entity ID from test fixture, creation response, or seeded data.
**Success Criteria:** Entity ID available in test.
**Sources:**
- Test fixtures: `const propertyId = '00000000-0000-0000-0000-e2e000000001';`
- Creation response: `const { id } = await createProperty(...);`
- Seeded data: Import from seed file

### Step 3: Build Dynamic Selector
**Action:** Construct selector using template literal.
**Success Criteria:** Selector targets specific entity.
**Example:**
```typescript
const propertyCard = page.locator(`[data-testid="property-card-${propertyId}"]`);
```

### Step 4: Interact with Entity
**Action:** Use the dynamic selector for all interactions.
**Success Criteria:** Actions target correct entity.
**Example:**
```typescript
// Click actions within specific card
await propertyCard.getByTestId('property-card-edit').click();
await propertyCard.getByTestId('property-card-delete').click();
```

### Step 5: Assert Entity State
**Action:** Verify entity-specific content or state.
**Success Criteria:** Assertions pass for specific entity.
**Example:**
```typescript
await expect(propertyCard).toContainText('123 Main St');
await expect(propertyCard).toBeVisible();
```

## Complete Pattern

```typescript
// Known entity ID from fixtures
const propertyId = '00000000-0000-0000-0000-e2e000000001';

// Target specific entity
const propertyCard = page.locator(`[data-testid="property-card-${propertyId}"]`);

// Verify visibility
await expect(propertyCard).toBeVisible();

// Interact with entity actions
await propertyCard.getByTestId('property-card-edit').click();

// After edit dialog...
await expect(propertyCard).toContainText('Updated Address');
```

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| `page.locator('.property-card').first()` | `page.locator(\`[data-testid="property-card-${id}"]\`)` |
| `page.getByText('123 Main St').click()` | Target specific card, then find text within |
| `page.locator('.property-card:nth-child(2)')` | Use entity ID for deterministic targeting |

## Verification

- [ ] Component uses dynamic `data-testid` with entity ID
- [ ] Entity ID sourced from fixtures or creation
- [ ] Selector uses template literal with ID
- [ ] Actions scoped to specific entity card

## Common Entity Patterns

| Entity | Pattern |
|--------|---------|
| Property | `property-card-${property.id}` |
| Report | `report-card-${report.id}` |
| Appraisal | `appraisal-card-${appraisal.id}` |
| User | `user-card-${user.id}` |
| Lead | `lead-card-${lead.id}` |

## Related

- Learnings: `memory-bank/learnings.md` (Dynamic Entity Selector Pattern)
- Source: ORION-013 Phases C, D
