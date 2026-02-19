---
name: e2e-selector-verification
description: Protocol for verifying E2E test selectors against source components before implementation
when_to_use: |
  Use when writing E2E tests or reviewing E2E test plans.
  Trigger phrases: "write E2E tests", "create Playwright tests", "verify selectors", "E2E implementation"
evidence:
  first_observed: 2026-02-12
  last_confirmed: 2026-02-12
  session_count: 1
  validation: ~22 selector corrections across ORION-013 phases B-F
source_learnings:
  - "E2E Selector Verification Protocol"
---

# E2E Selector Verification Protocol

## Overview

Before writing any E2E test, verify all selectors against the actual source components. Plans and documentation can contain assumed or outdated selector names. This protocol prevents test brittleness and reduces debugging time.

**Evidence:** ORION-013 required ~22 selector corrections because phase plans used inferred `data-testid` values that differed from actual component implementations.

## Prerequisites

- Access to source component files
- Understanding of the feature being tested
- Plan or specification with expected selectors

## Steps

### Step 1: Identify Target Components
**Action:** List all components that will be tested.
**Success Criteria:** Complete list of component file paths.
**Artifacts:** Component file list.

### Step 2: Read Source Components
**Action:** Use the Read tool to examine each component file.
**Success Criteria:** All `data-testid` attributes are identified and documented.
**Artifacts:** Selector mapping table.

### Step 3: Compare Plan vs. Source
**Action:** Compare planned selectors against actual source selectors.
**Success Criteria:** All mismatches identified and documented.
**Artifacts:** Correction list.

### Step 4: Update Test Implementation
**Action:** Use verified selectors in test code.
**Success Criteria:** All tests use source-verified selectors.
**Artifacts:** Test file with correct selectors.

### Step 5: Handle Missing Selectors
**Action:** For elements without `data-testid`, use Playwright's accessible selectors.
**Success Criteria:** Fallback selectors documented.
**Examples:**
- `getByLabel("Relationship")` for form fields
- `getByRole("button", { name: /Add Property/i })` for buttons
- `getByText("Submit")` for text-based elements

## Verification

- [ ] All planned selectors compared against source
- [ ] Correction list created for mismatches
- [ ] Test uses only verified selectors
- [ ] Missing testids documented with accessible alternatives

## Common Corrections (from ORION-013)

| Planned | Actual | Notes |
|---------|--------|-------|
| `consumer-welcome-header` | `consumer-dashboard-welcome` | Different naming convention |
| `nav-secondary-dashboard` | `nav-secondary-home` | Consumer vs agent dashboard |
| `properties-list` | `my-properties-grid` | Component renamed |
| `property-card` | `property-card-${id}` | Dynamic ID pattern |

## Related

- Learnings: `memory-bank/learnings.md` (E2E Selector Verification Protocol)
- Source: ORION-013 Reflection
