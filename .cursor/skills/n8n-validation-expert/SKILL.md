---
name: n8n-validation-expert
description: Expert guide for interpreting and fixing n8n validation errors. Covers 4 validation profiles, error types, auto-sanitization, false positives, recovery strategies, and the iterative validation loop.
when_to_use: |
  Use this skill when:
  - validate_node returns errors or warnings
  - validate_workflow returns broken connection or expression errors
  - Seeing unexpected changes to operator structures after workflow updates
  - Deciding which validation profile to use (minimal/runtime/ai-friendly/strict)
  - A workflow fails to activate due to validation errors
  - Encountering "paradoxical corrupt state" or "broken connection" errors
evidence: "f:\\Prime\\n8n\\MASTER_KNOWLEDGE.md §5"
---

# n8n Validation Expert

**Reference:** MASTER_KNOWLEDGE.md §5 (Validation System)

---

## Overview

Validation is iterative — expect 2–3 cycles. Average timing: 23s thinking about errors, 58s fixing. This is normal.

**4 Profiles:** minimal (quick) | runtime (RECOMMENDED) | ai-friendly (AI workflows) | strict (production)

---

## Prerequisites

- Node configuration to validate
- `validate_node` or `validate_workflow` MCP tool available

---

## Steps

### Step 1 — Choose the Right Profile
**Success Criteria:** Profile selected that matches your stage and use case.

| Profile | When | Catches |
|---------|------|---------|
| `minimal` | During editing, fast checks | Required fields only |
| `runtime` | Pre-deployment **(USE THIS)** | Types, values, dependencies |
| `ai-friendly` | AI agent workflows | Same as runtime, fewer false positives |
| `strict` | Production release | Everything including best practices |

### Step 2 — Run Validation
**Success Criteria:** Validation result received and parsed.
```javascript
// Node validation
const result = validate_node({
  nodeType: "nodes-base.slack",
  config: {resource: "channel", operation: "create"},
  profile: "runtime"
})

// Check result
if (result.valid) { /* proceed */ }
else { /* fix errors in result.errors[] */ }
```

### Step 3 — Fix Errors (Iterative Loop)
**Success Criteria:** All `errors[]` resolved. `valid: true` returned.

**Error types:**
- `missing_required` → add the missing field
- `invalid_value` → use `get_node` to find allowed values
- `type_mismatch` → convert type (e.g., `"100"` → `100`)
- `invalid_expression` → add `{{}}` wrapper; check node reference spelling
- `invalid_reference` → fix node name typo in expression

```javascript
// Typical cycle:
// Iteration 1: config = {resource: "channel", operation: "create"}
// → Error: missing "name"
// Fix: config.name = "general"

// Iteration 2: validate again
// → Error: missing "text"
// Fix: config.text = "Hello"

// Iteration 3: validate again → valid: true ✅
```

### Step 4 — Understand Auto-Sanitization
**Success Criteria:** No confusion when operator structures change after updates.

Auto-sanitization runs on ALL nodes during ANY workflow update:
- Binary operators (equals/contains/greaterThan) → removes `singleValue` automatically
- Unary operators (isEmpty/isNotEmpty) → adds `singleValue: true` automatically
- IF/Switch → adds missing `conditions.options` metadata

**Cannot auto-fix:**
- Broken connections → use `cleanStaleConnections` operation
- Branch count mismatches → manually add connections or remove rules
- Paradoxical corrupt states → use `n8n_autofix_workflow` or manual DB fix

### Step 5 — Recovery Strategies
**Success Criteria:** Blocked workflow is unblocked.

```javascript
// Strategy 1: Clean stale connections
n8n_update_partial_workflow({id, operations: [{type: "cleanStaleConnections"}]})

// Strategy 2: Auto-fix operator issues
n8n_autofix_workflow({id, applyFixes: false})  // Preview first
n8n_autofix_workflow({id, applyFixes: true})   // Apply fixes

// Strategy 3: Start fresh from minimal valid config
// Use get_node to find required fields, build up incrementally
```

---

## Verification

- [ ] Validation profile explicitly specified (not default)
- [ ] All items in `result.errors[]` are resolved
- [ ] `result.valid === true` returned
- [ ] Warnings reviewed and consciously accepted or fixed
- [ ] Auto-sanitization changes accepted (not manually reverted)

---

## Related

- MASTER_KNOWLEDGE.md §5 — Full validation reference with error catalog
- n8n-mcp-tools-expert skill — calling validate_node and validate_workflow correctly
- n8n-expression-syntax skill — fixing invalid_expression errors
