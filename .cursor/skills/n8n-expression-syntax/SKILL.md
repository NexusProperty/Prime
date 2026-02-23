---
name: n8n-expression-syntax
description: Expert guide for writing n8n expressions correctly. Covers {{}} syntax, $json access, webhook data nesting, node references, Python equivalents, and common expression mistakes.
when_to_use: |
  Use this skill when:
  - Writing expressions in n8n node parameter fields
  - Getting "can't access webhook data" or expression evaluates to undefined
  - Referencing data from a previous node in an expression
  - Writing Code node JavaScript or Python that accesses input data
  - Getting "invalid_expression" validation errors
  - Expressions showing as literal text instead of evaluating
evidence: "f:\\Prime\\n8n\\MASTER_KNOWLEDGE.md §7"
---

# n8n Expression Syntax

**Reference:** MASTER_KNOWLEDGE.md §7 (Expression Syntax)

---

## Overview

n8n expressions use `{{}}` wrappers in parameter fields. The most common mistake is missing the `.body` prefix when accessing webhook data. Expressions without `{{}}` are treated as literal strings.

---

## Prerequisites

- Know which node's output you want to access
- Know whether data came from a webhook trigger or a standard node

---

## Steps

### Step 1 — Basic Expression Structure
**Success Criteria:** Expression evaluates correctly, not shown as literal text.
```javascript
// Always wrap expressions in {{}}
"{{$json.name}}"       // ✅ evaluates to the name field
"$json.name"           // ❌ treated as literal string "$json.name"
```

### Step 2 — Access Current Node Data
**Success Criteria:** Can read fields from the current node's output.
```javascript
{{$json}}                    // Entire JSON object
{{$json.fieldName}}          // Specific field
{{$json.nested.deep.value}}  // Nested field
{{$json[0].field}}           // First item in array
```

### Step 3 — Access Webhook Data (CRITICAL)
**Success Criteria:** Webhook payload fields accessible without undefined errors.
```javascript
// ❌ WRONG — most common mistake — returns undefined
{{$json.email}}
{{$json.user.name}}

// ✅ CORRECT — webhook payload is nested under .body
{{$json.body.email}}
{{$json.body.user.name}}
{{$json.body.items[0].id}}
```

### Step 4 — Reference Other Nodes
**Success Criteria:** Can access data from any previous node by name.
```javascript
{{$node["Node Name"].json.field}}        // Another node's output
{{$node["HTTP Request"].json.data.id}}   // Specific nested field
{{$items("Node Name")[0].json.field}}    // First item from another node
{{$items("Node Name").length}}           // Count of items
```

### Step 5 — Built-in Variables
**Success Criteria:** Can use n8n built-in context variables.
```javascript
{{$now}}                    // Current ISO timestamp
{{$today}}                  // Today's date (YYYY-MM-DD)
{{$runIndex}}               // Current run index (0-based)
{{$workflow.id}}            // Current workflow ID
{{$workflow.name}}          // Current workflow name
{{$execution.id}}           // Current execution ID
```

### Step 6 — Python Code Node Equivalents
**Success Criteria:** Know the Python equivalent for each JavaScript expression.
```python
# JavaScript → Python
# {{$json.field}}          → _json["field"]
# {{$json.body.field}}     → _json["body"]["field"]
# $input.all()             → _input.all()
# $input.first()           → _input.first()
# $input.first().json      → _input.first().json
```

---

## Common Expression Mistakes

| ❌ Wrong | ✅ Correct | Problem |
|---------|-----------|---------|
| `{{$json.email}}` (webhook) | `{{$json.body.email}}` | Missing `.body` for webhook data |
| `$json.name` | `{{$json.name}}` | Missing `{{}}` wrapper |
| `{{$node.NodeName.json}}` | `{{$node["Node Name"].json}}` | Missing quotes around node name |
| `{{$json.items.0.id}}` | `{{$json.items[0].id}}` | Wrong array index syntax |

---

## Verification

- [ ] All expressions wrapped in `{{}}`
- [ ] Webhook data accessed via `$json.body.field` (not `$json.field`)
- [ ] Node names in expressions use quotes: `$node["Name"]` (not `$node.Name`)
- [ ] Expression validated with validate_node (profile: "runtime") — no `invalid_expression` errors
- [ ] Python code uses `_json` and `_input` (not `$json` / `$input`)

---

## Related

- MASTER_KNOWLEDGE.md §7 — Full expression syntax reference
- n8n-validation-expert skill — fixing invalid_expression errors
- n8n-code-node skill — writing Code node logic
