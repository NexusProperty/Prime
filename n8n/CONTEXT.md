# n8n System Context
**Entry point for all n8n AI assistance in this project**
*For full detail on any topic, see `MASTER_KNOWLEDGE.md` by section number.*

---

## What Is This?

This folder contains a complete n8n knowledge and tooling system for the Prime project. It enables any AI agent to build, validate, and deploy n8n workflows and AI agents with expert accuracy — using the `user-n8n-builder` MCP server and the artifact suite documented here.

**n8n** is a workflow automation platform with 545+ nodes, 2,700+ templates, and a full API. The MCP server gives AI agents direct programmatic access to build workflows without leaving the IDE.

---

## Quick Start — Build Your First Workflow in 5 Steps

```
Step 1: Run n8n_health_check() to confirm API connectivity
Step 2: search_nodes({query: "your node"}) → get the nodeType
Step 3: get_node({nodeType: "nodes-base.yournode"}) → understand config
Step 4: n8n_create_workflow({name: "My Workflow", nodes: [...], connections: {...}})
Step 5: n8n_validate_workflow({id}) → fix errors → n8n_update_partial_workflow → activate
```

For AI agent workflows, go to Step 2 with query `"agent"` and read §4 of MASTER_KNOWLEDGE.md.

---

## Artifact Map

| Artifact | Path | Purpose | When to Use |
|----------|------|---------|-------------|
| **Master Knowledge** | `f:\Prime\n8n\MASTER_KNOWLEDGE.md` | Ground truth for all n8n facts | Reference for any n8n question |
| **Command** | `f:\Prime\.cursor\commands\n8n.md` | `/n8n` workflow command | Building, validating, deploying workflows |
| **MCP Tools Skill** | `f:\Prime\.cursor\skills\n8n-mcp-tools-expert\SKILL.md` | Which MCP tool to use when | Choosing between search/validate/create tools |
| **Workflow Patterns Skill** | `f:\Prime\.cursor\skills\n8n-workflow-patterns\SKILL.md` | Pattern selection + checklists | Designing workflow architecture |
| **AI Agent Skill** | `f:\Prime\.cursor\skills\n8n-ai-agent-builder\SKILL.md` | AI agent workflow building | Building LangChain/agent workflows |
| **Validation Skill** | `f:\Prime\.cursor\skills\n8n-validation-expert\SKILL.md` | Interpret and fix errors | When validation returns errors or warnings |
| **Node Config Skill** | `f:\Prime\.cursor\skills\n8n-node-configuration\SKILL.md` | Operation-aware configuration | Configuring complex nodes correctly |
| **Expression Skill** | `f:\Prime\.cursor\skills\n8n-expression-syntax\SKILL.md` | Write expressions correctly | Writing `{{$json...}}` expressions |
| **Code Node Skill** | `f:\Prime\.cursor\skills\n8n-code-node\SKILL.md` | JavaScript + Python Code nodes | Writing code inside Code nodes |
| **Workflow Builder Rule** | `f:\Prime\.cursor\rules\n8n-workflow-builder.mdc` | Auto-loaded for workflow work | Automatically loaded by Cursor |
| **AI Agent Rule** | `f:\Prime\.cursor\rules\n8n-ai-agent.mdc` | Auto-loaded for AI agent work | Automatically loaded by Cursor |
| **Node Dev Rule** | `f:\Prime\.cursor\rules\n8n-node-development.mdc` | Auto-loaded for custom node dev | Automatically loaded by Cursor |

---

## /n8n Sub-Command Reference

| Sub-command | What it does |
|-------------|-------------|
| `/n8n build` | Build a new workflow from scratch using MCP tools |
| `/n8n agent` | Build an AI agent workflow (LangChain + memory + tools) |
| `/n8n validate` | Validate an existing workflow by ID and fix errors |
| `/n8n template` | Search templates and deploy one to your n8n instance |
| `/n8n node` | Research a specific node (search → get_node → validate) |

---

## AI Agent Quick Reference

```
[Webhook/Trigger]
      │
      ▼
[@n8n/n8n-nodes-langchain.agent]
      ├── ai_languageModel → [OpenAI / Anthropic / Gemini]
      ├── ai_tool          → [HTTP Tool / DB Tool / Code Tool]
      ├── ai_memory        → [Window Buffer / Postgres Memory]
      └── ai_outputParser  → [Optional structured output]
      │
      ▼
[Webhook Response / Slack / Email]
```

**Key fact:** LangChain nodes use `@n8n/n8n-nodes-langchain.*` prefix — different from standard `n8n-nodes-base.*` nodes. See MASTER_KNOWLEDGE.md §4.

---

## The 6 Mistakes to Avoid (§8)

| # | Mistake | Fix |
|---|---------|-----|
| 1 | Wrong nodeType prefix | `nodes-base.*` for search/validate; `n8n-nodes-base.*` for workflows |
| 2 | `detail: "full"` by default | Use `detail: "standard"` — 95% of cases |
| 3 | No validation profile | Always set `profile: "runtime"` |
| 4 | Fighting auto-sanitization | Trust it — it runs on every update |
| 5 | Manual `sourceIndex` for IF/Switch | Use `branch: "true"` / `case: 0` instead |
| 6 | No `intent` in workflow updates | Include `intent: "what you're doing"` |

---

## Environment Setup

```bash
# Required for workflow management tools
N8N_API_URL=http://localhost:5678   # Your n8n instance URL
N8N_API_KEY=your-api-key-here       # From n8n Settings → API → API Keys
```

**Without these:** Node discovery, offline validation, template search, and documentation tools still work.
**With these:** Full workflow CRUD, test execution, version management, and deployment unlocked.

See MASTER_KNOWLEDGE.md §9 for complete environment variable reference.

---

## Source Knowledge Locations

All artifacts in this folder are distilled from:
- `f:\Prime\n8n\MASTER_KNOWLEDGE.md` — full n8n knowledge base
- MCP server `user-n8n-builder` — 22 tool descriptors
- Skills in `f:\Prime\.cursor\skills\n8n-*\` — 7 skill files

*n8n v2.2.6 | 545 nodes | 2,700+ templates | February 2026*
