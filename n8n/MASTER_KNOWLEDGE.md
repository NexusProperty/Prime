# n8n Master Knowledge Document
**Version:** 1.0 | **Source:** f:\Prime\n8n\ | **Generated:** February 2026

This is the single ground truth for all n8n artifacts in this project. All skills, rules, commands, and context documents reference this file by section number (§1–§8). No artifact may introduce n8n facts not traceable here.

---

## §1. MCP Tool Registry

The `user-n8n-builder` MCP server provides 22 tools in two availability tiers.

### Always Available (no API credentials needed)
| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `search_nodes` | Find nodes by keyword | `query`, `mode` (OR/AND), `limit` |
| `get_node` | Get node schema and docs | `nodeType` (nodes-base.*), `detail` (minimal/standard/full), `mode` (info/docs/search_properties/versions) |
| `validate_node` | Validate a node config | `nodeType`, `config`, `profile` (minimal/runtime/ai-friendly/strict), `mode` (minimal/full) |
| `validate_workflow` | Validate full workflow JSON | `workflow` (nodes+connections), `options` |
| `search_templates` | Search 2,700+ templates | `query`, `searchMode` (by_nodes/by_task/by_metadata), `nodeTypes`, `task`, `complexity` |
| `get_template` | Get template details | `templateId`, `mode` (structure/full) |
| `tools_documentation` | Get tool docs | `topic`, `depth` (full) |
| `ai_agents_guide` | AI workflow architecture guide | (no params) |
| `n8n_health_check` | Check n8n connectivity | `mode` (diagnostic) |

### Requires API (needs N8N_API_URL + N8N_API_KEY)
| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `n8n_create_workflow` | Create new workflow | `name`, `nodes`, `connections` |
| `n8n_get_workflow` | Get workflow by ID | `id` |
| `n8n_list_workflows` | List all workflows | (optional filters) |
| `n8n_update_partial_workflow` | Edit workflow (MOST USED, 99% success) | `id`, `intent`, `operations[]` |
| `n8n_update_full_workflow` | Replace entire workflow | `id`, `workflow` |
| `n8n_delete_workflow` | Delete workflow | `id` |
| `n8n_validate_workflow` | Validate workflow by ID | `id` |
| `n8n_test_workflow` | Run test execution | `id` |
| `n8n_executions` | Manage executions | `id`, `action` |
| `n8n_deploy_template` | Deploy template to instance | `templateId`, `name`, `autoFix`, `autoUpgradeVersions` |
| `n8n_workflow_versions` | Manage versions | `id`, `action` (list/get/rollback/delete/prune) |
| `n8n_autofix_workflow` | Auto-fix workflow issues | `id`, `applyFixes` (bool) |

**Performance reference:**
- `search_nodes` < 20ms | `get_node` (standard) < 10ms | `validate_node` < 100ms
- `n8n_create_workflow` 100–500ms | `n8n_update_partial_workflow` 50–200ms (avg 56s between edits)

---

## §2. nodeType Format Rules

**Critical:** Two different prefixes are used depending on the tool. Using the wrong one causes "Node not found" errors.

| Context | Format | Example |
|---------|--------|---------|
| Search/Validate tools | `nodes-base.*` | `nodes-base.slack` |
| Workflow tools (create/update) | `n8n-nodes-base.*` | `n8n-nodes-base.slack` |
| LangChain/AI nodes (workflow tools) | `@n8n/n8n-nodes-langchain.*` | `@n8n/n8n-nodes-langchain.agent` |

**Conversion:** `search_nodes` returns BOTH formats in its response:
```json
{
  "nodeType": "nodes-base.slack",
  "workflowNodeType": "n8n-nodes-base.slack"
}
```

**Tools using `nodes-base.*`:** search_nodes, get_node, validate_node, validate_workflow
**Tools using `n8n-nodes-base.*`:** n8n_create_workflow, n8n_update_partial_workflow

---

## §3. Core Workflow Patterns (5)

### Pattern 1: Webhook Processing (Most Common — 35% of workflows)
**Use when:** Receiving data from external systems, building integrations, instant event response
**Node sequence:** `Webhook → [Validate/IF] → Transform (Set/Code) → [Action/Response]`
**Data gotcha:** Payload is at `$json.body.field` NOT `$json.field`
**Anti-patterns:** Responding before processing; no input validation; missing error handler

### Pattern 2: HTTP API Integration
**Use when:** Fetching from REST APIs, syncing third-party services, data pipelines
**Node sequence:** `Trigger → HTTP Request → Transform (Set/Code) → Action → Error Handler`
**Key nodes:** httpRequest (n8n-nodes-base.httpRequest)
**Anti-patterns:** No pagination handling; hardcoded credentials; no retry logic

### Pattern 3: Database Operations
**Use when:** ETL workflows, DB sync, scheduled queries, read/write/upsert
**Node sequence:** `Schedule → Query (Postgres/MySQL/MongoDB) → Transform → Write → Verify`
**Anti-patterns:** Unbounded queries; no upsert logic; missing transaction handling

### Pattern 4: AI Agent Workflow (see §4 for full detail)
**Use when:** Conversational AI, multi-step reasoning, AI with tool access
**Node sequence:** `Trigger → AI Agent (Model + Tools + Memory) → Output`
**Anti-patterns:** No memory for multi-turn; missing error handling on tool calls

### Pattern 5: Scheduled Tasks
**Use when:** Recurring reports, periodic data fetch, maintenance tasks
**Node sequence:** `Schedule → Fetch → Process → Deliver → Log → Error Trigger → Notify`
**Anti-patterns:** No idempotency; no failure notification; overlapping executions

### Workflow Creation Checklist (all patterns)
**Planning:** ☐ Identify pattern ☐ List required nodes ☐ Map data flow ☐ Plan error handling
**Build:** ☐ Trigger ☐ Data sources ☐ Auth/credentials ☐ Transforms ☐ Outputs ☐ Error handling
**Validate:** ☐ validate_node each node ☐ validate_workflow ☐ Test with sample data ☐ Edge cases
**Deploy:** ☐ Review settings ☐ activateWorkflow ☐ Monitor first executions

### Data Flow Types
- **Linear:** Trigger → Transform → Action
- **Branching:** Trigger → IF → [True Path] / [False Path]
- **Parallel:** Trigger → [Branch A] + [Branch B] → Merge
- **Loop:** Trigger → Split in Batches → Process → Loop

---

## §4. AI Agent Architecture

### Core Pattern
```
[Trigger: Webhook/Chat/Schedule]
        │
        ▼
[@n8n/n8n-nodes-langchain.agent]  ← Main Agent Node
        │
        ├── ai_languageModel → [OpenAI / Anthropic / Gemini model node]
        ├── ai_tool          → [HTTP Request Tool, Database Tool, Code Tool, etc.]
        ├── ai_tool          → [Multiple tools can be attached]
        ├── ai_memory        → [Window Buffer Memory / Postgres Chat Memory]
        └── ai_outputParser  → [Optional: Structured output parser]
        │
        ▼
[Output: Webhook Response / Slack / Email / DB Write]
```

### AI Connection Types
| Connection Type | Purpose | Example Nodes |
|----------------|---------|---------------|
| `ai_languageModel` | The LLM brain of the agent | openAi, anthropicClaude, googleGemini |
| `ai_tool` | Tools the agent can call | httpRequest, postgres, code, calculator |
| `ai_memory` | Conversation history | windowBufferMemory, postgresChatMemory |
| `ai_outputParser` | Parse structured responses | structuredOutputParser, itemListOutputParser |

### LangChain Node Prefixes
```
@n8n/n8n-nodes-langchain.agent              ← Main agent
@n8n/n8n-nodes-langchain.lmOpenAi           ← OpenAI model
@n8n/n8n-nodes-langchain.lmChatAnthropic    ← Anthropic Claude
@n8n/n8n-nodes-langchain.memoryWindowBuffer ← Window buffer memory
@n8n/n8n-nodes-langchain.toolHttpRequest    ← HTTP tool
@n8n/n8n-nodes-langchain.toolCode          ← Code execution tool
```

### Full Example (Webhook → AI Agent → Response)
```json
{
  "nodes": [
    {"type": "n8n-nodes-base.webhook", "name": "Chat Trigger"},
    {"type": "@n8n/n8n-nodes-langchain.agent", "name": "AI Agent"},
    {"type": "@n8n/n8n-nodes-langchain.lmOpenAi", "name": "OpenAI"},
    {"type": "@n8n/n8n-nodes-langchain.memoryWindowBuffer", "name": "Memory"},
    {"type": "n8n-nodes-base.webhookResponse", "name": "Respond"}
  ],
  "connections": {
    "Chat Trigger": {"main": [["AI Agent"]]},
    "OpenAI": {"ai_languageModel": [["AI Agent"]]},
    "Memory": {"ai_memory": [["AI Agent"]]},
    "AI Agent": {"main": [["Respond"]]}
  }
}
```

---

## §5. Validation System

### 4 Validation Profiles
| Profile | When to Use | Strictness | False Positives |
|---------|-------------|------------|-----------------|
| `minimal` | Quick checks during editing | Very lenient | Lowest |
| `runtime` | Pre-deployment (RECOMMENDED) | Balanced | Low |
| `ai-friendly` | AI-generated configurations | Balanced | Reduced |
| `strict` | Production-critical workflows | Maximum | Highest |

**Default recommendation:** Always use `profile: "runtime"` — catches real errors, minimal noise.

### Iterative Validation Loop
```
1. validate_node({nodeType, config, profile: "runtime"})
   → Error: "Missing required field: channel"        ← 23s thinking avg
2. Fix: config.channel = "#general"                  ← 58s fixing avg
3. validate_node({...updated config...})
   → Error: "Missing required field: text"
4. Fix: config.text = "Hello"
5. validate_node({...})
   → valid: true ✅
```
**Expect 2–3 cycles. This is normal, not a failure.**

### Auto-Sanitization (runs on every workflow update)
**Automatically fixes:**
- Binary operators (equals/contains/etc.) → removes `singleValue`
- Unary operators (isEmpty/isNotEmpty) → adds `singleValue: true`
- IF/Switch v2.2+/v3.2+ → adds missing conditions.options metadata

**Cannot fix:**
- Broken connections (use `cleanStaleConnections` operation)
- Branch count mismatches
- Paradoxical corrupt states (requires manual DB intervention)

### Validation Result Structure
```json
{
  "valid": false,
  "errors": [{"type": "missing_required", "property": "channel", "fix": "Provide channel name"}],
  "warnings": [{"type": "best_practice", "message": "Add retry logic"}],
  "suggestions": [{"type": "optimization", "message": "Use batch operations"}]
}
```

---

## §6. Node Development Rules (Custom Nodes)

### Declarative vs Programmatic Decision Tree
```
REST API with standard CRUD?        → DECLARATIVE
Has official SDK/client library?    → PROGRAMMATIC
GraphQL, WebSocket, non-REST?       → PROGRAMMATIC
Complex auth (signing, multi-step)? → PROGRAMMATIC
```

### File Structure — Declarative Node
```
nodes/MyService/
├── MyService.node.ts          # Main entry with requestDefaults
├── MyService.node.json        # Metadata (displayName, icon, etc.)
├── myservice.svg              # SVG icon
├── resources/
│   └── user/
│       ├── index.ts           # Resource description
│       ├── create.ts, get.ts, getAll.ts, update.ts, delete.ts
└── shared/
    ├── descriptions.ts        # Reusable UI (resourceLocator)
    ├── transport.ts           # apiRequest wrapper
    └── utils.ts               # Helpers
```

### File Structure — Programmatic Node
```
nodes/MyService/
├── MyService.node.ts          # Main entry with execute() method
├── MyService.node.json        # Metadata
└── myservice.svg              # SVG icon
```

### Critical Patterns
1. **Initialize credentials ONCE** before the item loop — not inside it
2. **Always include `pairedItem: { item: i }`** for data lineage
3. **Use `this.continueOnFail()`** for per-item error handling
4. **Use `this.getCredentials()`** — never hardcode credentials
5. **Register in package.json** under `n8n.nodes` and `n8n.credentials`

### Routing Types (Declarative)
| Type | Purpose | Example |
|------|---------|---------|
| `routing.send.type: 'body'` | Send as request body | `{send: {type: 'body', property: 'name'}}` |
| `routing.send.type: 'query'` | Send as URL query param | `{send: {type: 'query', property: 'limit'}}` |
| `routing.send.type: 'header'` | Send as HTTP header | `{send: {type: 'header', property: 'X-Key'}}` |

### Commands
```bash
npm run dev      # Development with hot reload (http://localhost:5678)
npm run build    # Compile TypeScript → dist/
npm run lint     # Check code quality
npm run lint:fix # Auto-fix lint issues
npm run release  # Create new release
```

---

## §7. Expression Syntax

### Core Expressions
```javascript
{{$json}}                           // Current node's full JSON output
{{$json.fieldName}}                 // Access specific field
{{$json.body.fieldName}}            // Webhook payload field (CRITICAL — see below)
{{$node["Node Name"].json.field}}   // Reference another node's output
{{$items("Node Name")[0].json}}     // First item from another node
{{$runIndex}}                       // Current run index (0-based)
{{$now}}                            // Current timestamp
{{$today}}                          // Today's date
```

### CRITICAL: Webhook Data Nesting
```javascript
// ❌ WRONG — most common n8n expression mistake
{{$json.email}}

// ✅ CORRECT — webhook data is nested under .body
{{$json.body.email}}
{{$json.body.user.name}}
```

### Python Code Node Equivalents
```python
# JavaScript         →  Python
# $json.field        →  _json["field"]
# $json.body.field   →  _json["body"]["field"]
# $input.all()       →  _input.all()
# $input.first()     →  _input.first()
```

### Common Expression Mistakes
| ❌ Wrong | ✅ Correct | Issue |
|---------|-----------|-------|
| `$json.email` | `$json.body.email` | Missing `.body` for webhooks |
| `$json.name` | `{{$json.name}}` | Missing `{{}}` wrapper |
| `"n8n-nodes-base.slack"` in get_node | `"nodes-base.slack"` | Wrong prefix for search/validate |
| `detail: "full"` by default | `detail: "standard"` | Wastes 3–8K tokens unnecessarily |

---

## §8. Common Mistakes Registry (6 Canonical)

### Mistake 1: Wrong nodeType Format
**Symptom:** "Node not found" error
**Fix:** Use `nodes-base.*` for search/validate tools; `n8n-nodes-base.*` for workflow tools

### Mistake 2: Using `detail: "full"` by Default
**Symptom:** Huge payload (3–8K tokens), slow response, token waste
**Fix:** Use `detail: "standard"` (default, ~1–2K tokens, covers 95% of cases)

### Mistake 3: Not Specifying Validation Profile
**Symptom:** Too many false positives OR missing real errors
**Fix:** Always use `profile: "runtime"` explicitly

### Mistake 4: Ignoring Auto-Sanitization
**Symptom:** Confusion when operator structures change after updates
**Fix:** Trust auto-sanitization — it runs on ALL nodes during ANY update

### Mistake 5: Not Using Smart Parameters
**Symptom:** Hard-to-read `sourceIndex` calculations for IF/Switch nodes
**Fix:** Use `branch: "true"` / `branch: "false"` for IF; `case: 0` / `case: 1` for Switch

### Mistake 6: Not Including `intent` Parameter
**Symptom:** Less helpful MCP tool responses
**Fix:** Always include `intent: "what you are doing"` in `n8n_update_partial_workflow`

---

## §9. Environment Variables

| Variable | Purpose | Unlocks |
|----------|---------|---------|
| `N8N_API_URL` | n8n instance URL (e.g. `http://localhost:5678`) | All workflow management tools |
| `N8N_API_KEY` | n8n API key from Settings → API | All workflow management tools |

Without these, only node discovery, validation (offline), template search, and documentation tools are available.
