---
name: n8n-code-node
description: Expert guide for writing JavaScript and Python inside n8n Code nodes. Covers $input/$output patterns, helper functions, return format, DateTime handling, HTTP requests from code, and Python restrictions.
when_to_use: |
  Use this skill when:
  - Writing JavaScript or Python inside an n8n Code node
  - Getting "return format is wrong" errors from a Code node
  - Accessing input items or previous node data inside a Code node
  - Making HTTP requests from a Code node using $helpers
  - Working with dates and times in Code node logic
  - Choosing between JavaScript and Python for a Code node task
  - Getting "module not found" errors in Python Code nodes
evidence: "f:\\Prime\\n8n\\MASTER_KNOWLEDGE.md §6, §7"
---

# n8n Code Node

**Reference:** MASTER_KNOWLEDGE.md §6 (Node Development) and §7 (Expression Syntax)

---

## Overview

n8n Code nodes run JavaScript or Python. They must return data in a specific format. JavaScript has access to n8n helpers; Python is limited to the standard library only.

**Return format (both languages):** `[{json: {...}}, {json: {...}}]`

---

## Prerequisites

- Know whether JavaScript or Python is needed
- Understand the input data structure (from previous node)

---

## Steps

### Step 1 — Access Input Data (JavaScript)
**Success Criteria:** Can read all items from the previous node.
```javascript
// Get all input items
const items = $input.all();

// Get first item only
const item = $input.first();
const data = item.json;

// Loop over all items
for (const item of $input.all()) {
  const name = item.json.name;
  const email = item.json.email;
  // Process...
}

// Access webhook body data
const email = $input.first().json.body.email;  // Note: .body for webhooks
```

### Step 2 — Return Data (JavaScript)
**Success Criteria:** Code node output is in the correct format.
```javascript
// ✅ CORRECT return format
return items.map(item => ({
  json: {
    name: item.json.name,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));

// ✅ Single item return
return [{json: {result: "success", count: 42}}];

// ❌ WRONG — missing json wrapper
return [{name: "John"}];

// ❌ WRONG — returning plain object
return {name: "John"};
```

### Step 3 — Make HTTP Requests (JavaScript only)
**Success Criteria:** HTTP request made without importing node-fetch or axios.
```javascript
// Use $helpers.httpRequest (built-in, no imports needed)
const response = await $helpers.httpRequest({
  method: "GET",
  url: "https://api.example.com/data",
  headers: {"Authorization": "Bearer token"},
});

return [{json: {data: response}}];
```

### Step 4 — Handle Dates and Times (JavaScript)
**Success Criteria:** Dates formatted and manipulated correctly.
```javascript
// n8n uses Luxon for dates
const now = DateTime.now();
const formatted = now.toISO();
const tomorrow = now.plus({days: 1}).toFormat("yyyy-MM-dd");
const parsed = DateTime.fromISO("2026-02-23");
```

### Step 5 — Python Code Node
**Success Criteria:** Python code runs without import errors.
```python
# Access input — use _input (not $input)
items = _input.all()
first = _input.first()
data = first.json

# Return format — same structure as JS
return [{"json": {"result": "processed", "count": len(items)}}]

# Access nested data
email = first.json["body"]["email"]   # Webhook data
name = first.json["name"]             # Standard node data

# ✅ Standard library is available
import json
import re
import datetime
import math

# ❌ External packages NOT available
import requests    # ❌ Not available
import pandas      # ❌ Not available
# For HTTP in Python — use JavaScript Code node instead
```

---

## JavaScript vs Python — When to Use Which

| Use JavaScript when... | Use Python when... |
|----------------------|-------------------|
| Need HTTP requests (`$helpers.httpRequest`) | Comfortable with Python syntax |
| Need DateTime manipulation (Luxon built-in) | Simple data transformation |
| Need n8n helper functions | String processing with regex |
| Complex array/object operations | Basic math/statistics |
| — | Standard library is sufficient |

**Python limitation:** No external packages. For HTTP calls, use JavaScript Code node.

---

## Verification

- [ ] Return value is `[{json: {...}}, ...]` format (array of objects with `json` key)
- [ ] `$input.all()` or `$input.first()` used to access input (not `$json` directly)
- [ ] Python code uses `_input` (not `$input`) and `_json` (not `$json`)
- [ ] HTTP requests in JavaScript use `$helpers.httpRequest` (not fetch/axios)
- [ ] No external Python imports (requests, pandas, numpy, etc.)
- [ ] Dates use Luxon `DateTime` (JavaScript) or `datetime` module (Python)

---

## Related

- MASTER_KNOWLEDGE.md §7 — Expression syntax and webhook data nesting
- n8n-expression-syntax skill — writing expressions in parameter fields
- n8n-validation-expert skill — fixing Code node validation errors
