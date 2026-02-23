---
name: n8n-workflow-patterns
description: Proven architectural patterns for n8n workflows. Covers the 5 core patterns, pattern selection guide, data flow types, workflow creation checklist, and quick-start examples.
when_to_use: |
  Use this skill when:
  - Starting to design a new n8n workflow and unsure which pattern to use
  - Building a webhook integration, API sync, database ETL, AI chatbot, or scheduled report
  - Following the workflow creation checklist for a production workflow
  - Choosing between branching, parallel, or loop data flow patterns
  - Getting "can't access webhook payload" or "wrong node execution order" errors
evidence: "f:\\Prime\\n8n\\MASTER_KNOWLEDGE.md §3"
---

# n8n Workflow Patterns

**Reference:** MASTER_KNOWLEDGE.md §3 (Core Workflow Patterns)

---

## Overview — 5 Core Patterns

| Pattern | Trigger | Use Case | % of Workflows |
|---------|---------|----------|---------------|
| Webhook Processing | Webhook | External events, integrations, form submissions | 35% |
| HTTP API Integration | Manual/Schedule | Fetch APIs, sync services, data pipelines | ~25% |
| Database Operations | Schedule | ETL, DB sync, batch writes | ~20% |
| AI Agent Workflow | Webhook/Chat | Conversational AI, multi-step reasoning | Growing |
| Scheduled Tasks | Schedule (cron) | Reports, maintenance, periodic fetch | 28% |

---

## Prerequisites

- Know the source of data (webhook, API, database, manual, schedule)
- Know the output destination (API, database, notification, file)
- `user-n8n-builder` MCP server available

---

## Steps

### Step 1 — Select Your Pattern
**Success Criteria:** Pattern chosen that matches data source and destination.

**Webhook Processing** — Use when:
- Receiving data from Stripe, GitHub, Slack slash commands, form submissions
- Need instant response to external events
- Node sequence: `Webhook → [IF/Validate] → Set/Code → [Action] → Webhook Response`

**HTTP API Integration** — Use when:
- Fetching data from REST APIs (GitHub, Jira, Salesforce)
- Syncing between third-party services
- Node sequence: `Trigger → HTTP Request → IF → Set/Code → Action → Error Handler`

**Database Operations** — Use when:
- ETL between Postgres/MySQL/MongoDB
- Running queries on a schedule
- Node sequence: `Schedule → DB Query → IF → Transform → DB Write → Verify`

**AI Agent Workflow** — Use when:
- Building a chatbot with tool access
- Multi-step reasoning with external data
- Node sequence: `Webhook → AI Agent (Model + Tools + Memory) → Response`
- → See n8n-ai-agent-builder skill for full detail

**Scheduled Tasks** — Use when:
- Daily/weekly reports
- Periodic data sync
- Node sequence: `Schedule → Fetch → Process → Deliver → Log → Error Trigger`

### Step 2 — Select Data Flow Type
**Success Criteria:** Workflow structure matches the data flow pattern.

```
Linear:   Trigger → Transform → Action
Branch:   Trigger → IF → [True Path] / [False Path]
Parallel: Trigger → [Branch A] + [Branch B] → Merge
Loop:     Trigger → Split in Batches → Process → Loop (back)
Error:    Main Flow + Error Trigger → Error Handler (separate workflow)
```

### Step 3 — Follow the Workflow Creation Checklist
**Success Criteria:** All checklist items complete before activation.

**Planning:**
- [ ] Pattern identified
- [ ] Required nodes listed (use search_nodes)
- [ ] Data flow mapped (input → transform → output)
- [ ] Error handling strategy defined

**Build:**
- [ ] Trigger node added and configured
- [ ] Data source nodes added
- [ ] Credentials configured (not hardcoded)
- [ ] Transform nodes added (Set/Code/IF)
- [ ] Output/action nodes added
- [ ] Error handling configured

**Validate:**
- [ ] validate_node run on each node (profile: "runtime")
- [ ] validate_workflow run on full workflow
- [ ] Tested with sample data
- [ ] Edge cases handled (empty data, API errors)

**Deploy:**
- [ ] Workflow settings reviewed
- [ ] activateWorkflow operation run
- [ ] First executions monitored

### Step 4 — Handle Common Gotchas
**Success Criteria:** No runtime surprises from known issues.

```javascript
// Gotcha 1: Webhook payload is nested
{{$json.body.email}}      // ✅ CORRECT
{{$json.email}}           // ❌ WRONG

// Gotcha 2: Multi-item processing — use Execute Once for single-item
{{$json[0].field}}        // First item only

// Gotcha 3: Node execution order
// Settings → Execution Order → v1 (connection-based) is recommended
```

---

## Verification

- [ ] Pattern matches the data source and output destination
- [ ] Data flow type matches the branching/looping requirements
- [ ] All checklist items completed
- [ ] validate_workflow returns no errors

---

## Related

- MASTER_KNOWLEDGE.md §3 — Full pattern reference with statistics
- n8n-mcp-tools-expert skill — calling the right MCP tools for each pattern step
- n8n-ai-agent-builder skill — full AI agent workflow guidance
- n8n-validation-expert skill — fixing validation errors
