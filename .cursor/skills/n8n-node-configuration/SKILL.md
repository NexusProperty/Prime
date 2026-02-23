---
name: n8n-node-configuration
description: Expert guide for configuring n8n nodes correctly. Covers operation-aware configuration, property dependencies, get_node detail levels, resource/operation patterns, and credential setup.
when_to_use: |
  Use this skill when:
  - Unsure what parameters a specific n8n node requires
  - Configuring a node with resource/operation structure (Slack, GitHub, Google Sheets, etc.)
  - Getting "required field missing" validation errors after providing what seems correct
  - Need to find the allowed values for an operation's parameters
  - Setting up credentials for a new node type
  - Choosing between get_node detail levels (minimal/standard/full)
evidence: "f:\\Prime\\n8n\\MASTER_KNOWLEDGE.md §1, §2"
---

# n8n Node Configuration

**Reference:** MASTER_KNOWLEDGE.md §1 (MCP Tools) and §2 (nodeType Formats)

---

## Overview

Most n8n nodes use a resource/operation pattern. The required parameters depend on which resource AND operation you select. Always use `get_node` to discover what a specific operation requires before configuring.

---

## Prerequisites

- Node name or keyword to search for
- `search_nodes` and `get_node` MCP tools available

---

## Steps

### Step 1 — Find the Node
**Success Criteria:** nodeType in `nodes-base.*` format obtained.
```javascript
search_nodes({query: "slack"})
// Returns: {nodeType: "nodes-base.slack", workflowNodeType: "n8n-nodes-base.slack"}
```

### Step 2 — Understand the Node
**Success Criteria:** Know what operations are available and which fields they require.
```javascript
// Standard detail — covers 95% of cases (~1-2K tokens)
get_node({nodeType: "nodes-base.slack"})

// If you need readable docs
get_node({nodeType: "nodes-base.slack", mode: "docs"})

// If you need a specific property
get_node({nodeType: "nodes-base.slack", mode: "search_properties", propertyQuery: "channel"})

// Only use "full" when debugging complex config issues (~3-8K tokens)
get_node({nodeType: "nodes-base.slack", detail: "full"})
```

### Step 3 — Build Config for Specific Operation
**Success Criteria:** Config object has all required fields for the chosen resource + operation.

Most nodes follow this pattern:
```javascript
// Always set resource first, then operation, then operation-specific fields
const config = {
  resource: "channel",       // What you're working with
  operation: "create",       // What you want to do
  name: "general",           // Required for channel.create
  // Optional fields as needed
}
```

### Step 4 — Validate Before Using in Workflow
**Success Criteria:** validate_node returns `valid: true`.
```javascript
validate_node({
  nodeType: "nodes-base.slack",
  config: config,
  profile: "runtime"
})
// Fix any errors, then proceed to add to workflow
```

### Step 5 — Add to Workflow with Correct nodeType Format
**Success Criteria:** Node added using `n8n-nodes-base.*` prefix (not `nodes-base.*`).
```javascript
n8n_update_partial_workflow({
  id: workflowId,
  intent: "Add Slack channel creator node",
  operations: [{
    type: "addNode",
    node: {
      type: "n8n-nodes-base.slack",   // n8n-nodes-base.* for workflow tools
      name: "Create Channel",
      parameters: config
    }
  }]
})
```

---

## Credential Setup Pattern

```javascript
// Most nodes require credentials
// 1. Check what credential type the node needs
get_node({nodeType: "nodes-base.slack", mode: "docs"})  // Look for "credentials" section

// 2. Add credential reference in node config
{
  type: "n8n-nodes-base.slack",
  credentials: {
    slackApi: {id: "cred-id", name: "Slack Account"}
  }
}
```

---

## Verification

- [ ] `get_node` called with `detail: "standard"` (not full) to find required fields
- [ ] Config has `resource` and `operation` set before other fields
- [ ] `validate_node({profile: "runtime"})` returns `valid: true`
- [ ] Workflow node uses `n8n-nodes-base.*` prefix (not `nodes-base.*`)
- [ ] Credentials referenced (not hardcoded)

---

## Related

- MASTER_KNOWLEDGE.md §1 — get_node detail levels and modes
- MASTER_KNOWLEDGE.md §2 — nodeType format rules
- n8n-validation-expert skill — interpreting configuration errors
- n8n-mcp-tools-expert skill — tool selection guide
