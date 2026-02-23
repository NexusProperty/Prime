---
name: n8n-ai-agent-builder
description: Expert guide for building AI agent workflows in n8n using LangChain nodes. Covers agent architecture, connection types, LangChain node prefixes, memory types, tool attachment, and validation.
when_to_use: |
  Use this skill when:
  - Building a conversational AI chatbot in n8n
  - Connecting an AI agent to external tools (HTTP, database, code execution)
  - Adding memory to an AI agent for multi-turn conversations
  - Getting connection type errors when attaching LLM models to agent nodes
  - Using any @n8n/n8n-nodes-langchain.* node
  - Building a RAG (retrieval-augmented generation) workflow in n8n
evidence: "f:\\Prime\\n8n\\MASTER_KNOWLEDGE.md §4, §2"
---

# n8n AI Agent Builder

**Reference:** MASTER_KNOWLEDGE.md §4 (AI Agent Architecture) and §2 (LangChain node prefixes)

---

## Overview

n8n AI agent workflows use LangChain-based nodes with special connection types. The main agent node (`@n8n/n8n-nodes-langchain.agent`) connects to model, tool, memory, and parser nodes via typed connections — not standard `main` connections.

**Architecture:**
```
[Trigger] → [@n8n/n8n-nodes-langchain.agent] → [Output]
                    │
    ┌───────────────┼───────────────────────┐
    │               │                       │
[LLM Model]   [Tools (0–N)]          [Memory]
ai_languageModel  ai_tool             ai_memory
```

---

## Prerequisites

- OpenAI/Anthropic/Google API credentials configured in n8n
- `user-n8n-builder` MCP with API access (N8N_API_URL + N8N_API_KEY)
- Understand which trigger to use (Webhook for chat, Schedule for autonomous agents)

---

## Steps

### Step 1 — Create Base Agent Workflow
**Success Criteria:** Workflow exists with trigger and agent node created.
```javascript
n8n_create_workflow({
  name: "AI Assistant",
  nodes: [
    {type: "n8n-nodes-base.webhook", name: "Chat Input"},
    {type: "@n8n/n8n-nodes-langchain.agent", name: "AI Agent"}
  ],
  connections: {
    "Chat Input": {main: [["AI Agent"]]}
  }
})
```

### Step 2 — Attach Language Model
**Success Criteria:** LLM connected to agent via `ai_languageModel` connection.
```javascript
n8n_update_partial_workflow({
  id: workflowId,
  intent: "Attach OpenAI GPT-4 model to agent",
  operations: [
    {type: "addNode", node: {
      type: "@n8n/n8n-nodes-langchain.lmOpenAi",
      name: "OpenAI GPT-4",
      parameters: {model: "gpt-4o"}
    }},
    {type: "addConnection",
      source: "OpenAI GPT-4",
      target: "AI Agent",
      connectionType: "ai_languageModel"}
  ]
})
```

### Step 3 — Attach Memory (for multi-turn chat)
**Success Criteria:** Memory connected via `ai_memory` — agent can reference conversation history.
```javascript
n8n_update_partial_workflow({
  id: workflowId,
  intent: "Add conversation memory",
  operations: [
    {type: "addNode", node: {
      type: "@n8n/n8n-nodes-langchain.memoryWindowBuffer",
      name: "Window Memory",
      parameters: {contextWindowLength: 10}
    }},
    {type: "addConnection",
      source: "Window Memory",
      target: "AI Agent",
      connectionType: "ai_memory"}
  ]
})
```

### Step 4 — Attach Tools (optional, for tool-using agents)
**Success Criteria:** Tools connected via `ai_tool` — agent can call them during reasoning.
```javascript
n8n_update_partial_workflow({
  id: workflowId,
  intent: "Add HTTP tool for web search",
  operations: [
    {type: "addNode", node: {
      type: "@n8n/n8n-nodes-langchain.toolHttpRequest",
      name: "Web Search Tool"
    }},
    {type: "addConnection",
      source: "Web Search Tool",
      target: "AI Agent",
      connectionType: "ai_tool"}
  ]
})
```

### Step 5 — Add Output and Validate
**Success Criteria:** Workflow validated with `ai-friendly` profile and activated.
```javascript
// Add webhook response
n8n_update_partial_workflow({
  id: workflowId,
  intent: "Add response node",
  operations: [
    {type: "addNode", node: {type: "n8n-nodes-base.webhookResponse", name: "Respond"}},
    {type: "addConnection", source: "AI Agent", target: "Respond"}
  ]
})

// Validate with ai-friendly profile
n8n_validate_workflow({id: workflowId})
// Then: validate_node with profile: "ai-friendly" for individual nodes

// Activate
n8n_update_partial_workflow({id: workflowId, intent: "Activate",
  operations: [{type: "activateWorkflow"}]})
```

---

## LangChain Node Reference

| Node | Type | Purpose |
|------|------|---------|
| `@n8n/n8n-nodes-langchain.agent` | Main | Orchestrates LLM + tools + memory |
| `@n8n/n8n-nodes-langchain.lmOpenAi` | Model | OpenAI GPT models |
| `@n8n/n8n-nodes-langchain.lmChatAnthropic` | Model | Anthropic Claude |
| `@n8n/n8n-nodes-langchain.lmChatGoogleGemini` | Model | Google Gemini |
| `@n8n/n8n-nodes-langchain.memoryWindowBuffer` | Memory | Last N messages |
| `@n8n/n8n-nodes-langchain.memoryPostgresChatMemory` | Memory | Persistent DB memory |
| `@n8n/n8n-nodes-langchain.toolHttpRequest` | Tool | HTTP API calls |
| `@n8n/n8n-nodes-langchain.toolCode` | Tool | Code execution |

---

## Verification

- [ ] Agent node type is `@n8n/n8n-nodes-langchain.agent` (not `n8n-nodes-base.agent`)
- [ ] Model connected via `ai_languageModel` (not `main`)
- [ ] Memory connected via `ai_memory`
- [ ] Tools connected via `ai_tool`
- [ ] Validation uses `profile: "ai-friendly"`
- [ ] Workflow activated and test message received a reply

---

## Related

- MASTER_KNOWLEDGE.md §4 — Full AI agent architecture with complete JSON example
- MASTER_KNOWLEDGE.md §2 — LangChain nodeType prefix rules
- n8n-validation-expert skill — fixing ai-friendly validation errors
- n8n-mcp-tools-expert skill — MCP tool patterns for building
