# N8N Command — Workflow & AI Agent Builder

This command orchestrates the full n8n workflow building lifecycle — from pattern selection and node discovery through validated, activated workflow deployment. It uses the `user-n8n-builder` MCP server and the n8n knowledge system in `f:\Prime\n8n\`.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before the Main Agent acts, fast subagents are dispatched to scan and gather context:

> **Recommended subagent types:**
> - `explore` with `model: fast` — scan `f:\Prime\n8n\MASTER_KNOWLEDGE.md` and identify relevant sections
> - `codebase-scanner-fast` — for supplemental project context gathering

1. **Read `f:\Prime\n8n\MASTER_KNOWLEDGE.md`** — identify relevant sections for the user's goal
2. **Run `n8n_health_check()`** via MCP — confirm API connectivity and which tool tier is available
3. **Identify the workflow pattern** from MASTER_KNOWLEDGE §3 that best fits the user's goal
4. **Identify required nodes** — note the MCP tools from §1 needed for this task
5. **Return a Discovery Summary:**
   ```
   ## N8N Discovery Summary
   Sub-command: [build | agent | validate | template | node]
   Pattern selected: [webhook | API | database | AI agent | scheduled]
   API available: [yes — workflow management unlocked | no — discovery/validation only]
   Relevant MASTER_KNOWLEDGE sections: [§N, §N, ...]
   Required MCP tools: [list from §1]
   Output plan file: plans/n8n-[workflow-name]-[YYYY-MM-DD].md
   ```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

1. **Confirm sub-command** — identify which mode is active (build/agent/validate/template/node)
2. **Pattern validation** — verify the selected pattern matches the user's use case
3. **Node inventory** — confirm which nodes are needed and that their nodeType formats are correct (§2)
4. **Risk identification** — flag missing credentials, schema gaps, or complexity concerns
5. **Execution plan** — outline exact steps for Phase 3 delegation

> **Gate:** Do not proceed until pattern, nodes, and API availability are confirmed.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly writes or edits files. It uses the `Task` tool to spawn subagents for ALL file operations.

**Delegation map by sub-command:**

| Sub-command | Subagent | What it does |
|-------------|----------|-------------|
| `build` | `file-operations-fast` | Creates workflow plan document + MCP tool calls |
| `agent` | `file-operations-fast` | Creates AI agent workflow plan using §4 architecture |
| `validate` | `explore` fast | Runs validation loop against existing workflow ID |
| `template` | `file-operations-fast` | Searches templates, deploys selected one |
| `node` | `explore` fast | Runs search → get_node → validate cycle |

Output plan saved to: `plans/n8n-[workflow-name]-[YYYY-MM-DD].md`

---

## Workflow

### Step 1 — Health Check & Context Load
Run `n8n_health_check()` via MCP. Read `f:\Prime\n8n\MASTER_KNOWLEDGE.md` relevant sections. Identify which tools are available (§1 availability tiers).

### Step 2 — Pattern & Node Selection (for `build` and `agent`)
Using MASTER_KNOWLEDGE §3 (patterns) and §1 (MCP tools):
1. Select workflow pattern (webhook / API / database / AI agent / scheduled)
2. `search_nodes({query: "keyword"})` → get nodeType in `nodes-base.*` format
3. `get_node({nodeType: "nodes-base.name", detail: "standard"})` → understand config
4. Note: convert to `n8n-nodes-base.*` format before using in workflow tools (§2)

### Step 3 — Build (Iterative, NOT One-Shot)
Read the n8n skills before building — they contain critical patterns that prevent common mistakes:
- `f:\Prime\.cursor\skills\n8n-workflow-patterns\SKILL.md` — pattern selection and build checklist
- `f:\Prime\.cursor\skills\n8n-mcp-tools-expert\SKILL.md` — which MCP tool to use when
- `f:\Prime\.cursor\skills\n8n-node-configuration\SKILL.md` — operation-aware node configuration
- `f:\Prime\.cursor\skills\n8n-expression-syntax\SKILL.md` — correct expression syntax
- `f:\Prime\.cursor\skills\n8n-code-node\SKILL.md` — Code node JavaScript/Python patterns

Follow the workflow creation checklist from MASTER_KNOWLEDGE §3:
```
1. n8n_create_workflow({name, nodes: [trigger], connections: {}})
2. n8n_validate_workflow({id})
3. n8n_update_partial_workflow({id, intent: "add X node", operations: [...]})
4. n8n_validate_workflow({id})
5. Repeat steps 3–4 for each addition
6. n8n_update_partial_workflow({id, intent: "activate", operations: [{type: "activateWorkflow"}]})
```
**Average 56 seconds between edits. This is normal — do not rush to one-shot.**

### Step 4 — AI Agent Build (sub-command: `agent`)
Read `f:\Prime\.cursor\skills\n8n-ai-agent-builder\SKILL.md` FIRST — it contains the complete AI agent build sequence with code examples.

Reference MASTER_KNOWLEDGE §4 for the complete AI agent architecture:
- Attach LangChain model via `ai_languageModel` connection type
- Attach tools via `ai_tool` connection type
- Attach memory via `ai_memory` connection type
- Use `@n8n/n8n-nodes-langchain.*` prefix for all LangChain nodes (§2)
- Validate using `profile: "ai-friendly"` (§5)

### Step 5 — Validate & Fix Loop
Read `f:\Prime\.cursor\skills\n8n-validation-expert\SKILL.md` for the complete validation loop and error fix patterns.

Reference MASTER_KNOWLEDGE §5:
- Always use `profile: "runtime"` unless building AI agents (use `ai-friendly`)
- Expect 2–3 validate → fix cycles
- Trust auto-sanitization — do not fight it
- For "Node not found" errors: run `cleanStaleConnections` operation

### Step 6 — Output Plan Document
Delegate to subagent to write `plans/n8n-[workflow-name]-[date].md` with:
- Workflow architecture diagram
- Node list with types and config
- Connection map
- Credentials required
- Testing checklist

---

## Usage

```
/n8n build      — Build a new workflow from scratch
/n8n agent      — Build an AI agent workflow with LangChain
/n8n validate   — Validate and fix an existing workflow by ID
/n8n template   — Search and deploy a template from the library
/n8n node       — Research a specific node (search → docs → validate)
```

Invoke with no extra arguments to be guided through pattern selection interactively.

---

## Output

| Output | Location | Description |
|--------|----------|-------------|
| Workflow plan | `plans/n8n-[name]-[YYYY-MM-DD].md` | Architecture, nodes, connections, testing checklist |
| Activated workflow | n8n instance | Live workflow via MCP API tools |
| Architecture summary | Chat | Quick-reference ASCII diagram |

---

## Next Steps

After workflow is built and activated:
1. Run `/qa` to verify the workflow executes correctly with test data
2. Use `/integrate` to connect the workflow to other project systems
3. Run `n8n_workflow_versions` to create a version snapshot before further edits
4. Monitor first executions in the n8n UI

**Related skills (in `f:\Prime\.cursor\skills\`):**
- `n8n-mcp-tools-expert\SKILL.md` — which MCP tool to use when
- `n8n-workflow-patterns\SKILL.md` — pattern selection and checklists
- `n8n-ai-agent-builder\SKILL.md` — AI agent architecture
- `n8n-validation-expert\SKILL.md` — fixing validation errors
- `n8n-node-configuration\SKILL.md` — configuring complex nodes
- `n8n-expression-syntax\SKILL.md` — writing correct expressions
- `n8n-code-node\SKILL.md` — JavaScript and Python Code nodes
