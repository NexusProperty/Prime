---
name: n8n-mcp-tools-expert
description: Expert guide for selecting and using the 22 user-n8n-builder MCP tools correctly. Covers tool selection logic, nodeType format rules, parameter formats, and performance characteristics.
when_to_use: |
  Use this skill when:
  - Choosing which MCP tool to call for a specific n8n task
  - Getting a "Node not found" error from get_node or validate_node
  - Deciding between get_node detail levels (minimal/standard/full)
  - Using search_nodes, get_template, or n8n_deploy_template for the first time
  - Unsure whether to use validate_node vs validate_workflow
evidence: "f:\\Prime\\n8n\\MASTER_KNOWLEDGE.md §1, §2"
---

# n8n MCP Tools Expert

**Reference:** MASTER_KNOWLEDGE.md §1 (Tool Registry) and §2 (nodeType Formats)

---

## Overview

The `user-n8n-builder` MCP server provides 22 tools in two tiers:

**Always Available (9 tools — no API credentials needed):**
search_nodes | get_node | validate_node | validate_workflow | search_templates | get_template | tools_documentation | ai_agents_guide | n8n_health_check

**Requires API (13 tools — needs N8N_API_URL + N8N_API_KEY):**
n8n_create_workflow | n8n_get_workflow | n8n_list_workflows | n8n_update_partial_workflow | n8n_update_full_workflow | n8n_delete_workflow | n8n_validate_workflow | n8n_test_workflow | n8n_executions | n8n_deploy_template | n8n_workflow_versions | n8n_autofix_workflow | (+ n8n_health_check in diagnostic mode)

---

## Prerequisites

- MCP server `user-n8n-builder` enabled in Cursor
- For API tools: `N8N_API_URL` and `N8N_API_KEY` set in environment

---

## Steps

### Step 1 — Check API Availability
**Success Criteria:** Know which tool tier is available before proceeding.
```javascript
n8n_health_check()
// or detailed:
n8n_health_check({mode: "diagnostic"})
```

### Step 2 — Find a Node
**Success Criteria:** Have the correct nodeType in `nodes-base.*` format.
```javascript
// 1. Search (fast, <20ms)
search_nodes({query: "slack", limit: 20})
// Returns: {nodeType: "nodes-base.slack", workflowNodeType: "n8n-nodes-base.slack"}

// 2. Get details (standard = 95% of use cases, <10ms)
get_node({nodeType: "nodes-base.slack"})                          // detail: "standard" default
get_node({nodeType: "nodes-base.slack", mode: "docs"})            // human-readable docs
get_node({nodeType: "nodes-base.slack", detail: "full"})          // full schema (use sparingly — 3–8K tokens)
get_node({nodeType: "nodes-base.slack", mode: "search_properties", propertyQuery: "auth"}) // find specific property
```

### Step 3 — Validate a Node Config
**Success Criteria:** Validation returns `valid: true` or clear error messages to fix.
```javascript
validate_node({
  nodeType: "nodes-base.slack",
  config: {resource: "channel", operation: "create", name: "general"},
  profile: "runtime"     // always specify: minimal | runtime | ai-friendly | strict
})
```

### Step 4 — Work with Templates
**Success Criteria:** Found a relevant template or deployed one to n8n instance.
```javascript
// Search templates
search_templates({query: "webhook slack", limit: 20})
search_templates({searchMode: "by_nodes", nodeTypes: ["n8n-nodes-base.httpRequest"]})
search_templates({searchMode: "by_metadata", complexity: "simple", maxSetupMinutes: 15})

// Get template
get_template({templateId: 2947, mode: "structure"})  // nodes+connections only
get_template({templateId: 2947, mode: "full"})        // complete workflow JSON

// Deploy template
n8n_deploy_template({templateId: 2947, name: "My Workflow", autoFix: true})
```

### Step 5 — Manage Workflows
**Success Criteria:** Workflow created, updated iteratively, validated, and activated.
```javascript
// Create
n8n_create_workflow({name: "My Workflow", nodes: [...], connections: {...}})

// Update (MOST USED — 99% success rate)
n8n_update_partial_workflow({
  id: "workflow-id",
  intent: "Add Slack notification node",
  operations: [{type: "addNode", node: {...}}]
})

// Validate by ID
n8n_validate_workflow({id: "workflow-id"})

// Activate
n8n_update_partial_workflow({id, intent: "Activate", operations: [{type: "activateWorkflow"}]})
```

---

## Verification

- [ ] `n8n_health_check()` returns healthy status
- [ ] `search_nodes` returns results in `nodes-base.*` format
- [ ] `get_node` called with `detail: "standard"` (not full)
- [ ] `validate_node` has explicit `profile` parameter
- [ ] nodeType format is `n8n-nodes-base.*` when used in workflow tools

---

## Related

- MASTER_KNOWLEDGE.md §1 — Full tool registry with performance characteristics
- MASTER_KNOWLEDGE.md §2 — nodeType format conversion table
- n8n-validation-expert skill — interpreting validation results
- n8n-workflow-patterns skill — choosing the right workflow architecture
