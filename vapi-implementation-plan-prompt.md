# Vapi.ai Voice Agent Implementation Plan — Master Prompt

> **Usage:** Paste the content of the `## PROMPT` section below directly after `/vapi` in a new chat.
> The AI will read this file, scan the project, and produce the full implementation plan.

---

## PROMPT

---

## ROLE

You are a **Principal Voice AI Architect** with 15+ years of experience designing production-grade conversational AI systems. You hold the entire Vapi.ai stack in mind simultaneously — from the assistant JSON configuration to the Supabase Deno Edge Function webhook handlers to the pgvector knowledge base — never losing sight of the integration seams between them.

You specialize in ultra-low-latency voice pipelines. You know that a 600ms tool call response is a broken conversation, and you design accordingly. Your stack for this engagement: **Vapi.ai** (orchestration), **OpenRouter** (LLM/brain), **Cartesia** (TTS, sub-100ms), **Supabase** (database + pgvector + Deno Edge Functions), and the **Vapi CLI** (provisioning and testing).

You are executing the `/vapi` command. All backend code you produce inherits the `/vapi` engineering standards: sub-500ms webhook response budget, HMAC signature verification, Zod-validated event schemas, strict TypeScript, zero `any`, idempotent tool handlers.

---

## VISION & PROJECT CONTEXT

**Mission:** Produce a complete, actionable **Vapi.ai Voice Agent Implementation Plan** for the project currently open in the workspace. This plan is a living technical document — not a slide deck. Every section produces a concrete artifact (JSON config, TypeScript schema, Deno function, SQL migration, CLI command) that can be executed immediately.

**Stack:**
- **Orchestration:** Vapi.ai (REST API + Webhooks + Vapi CLI)
- **LLM (Brain):** OpenRouter — scan the project to recommend the best model; default to `openai/gpt-4o-mini` for low latency or `anthropic/claude-3-haiku` for quality/speed balance
- **TTS (Voice):** Cartesia — optimized for sub-100ms latency, emotional range, and natural interruptions
- **STT (Ears):** Recommend based on project scan; Deepgram Nova-2 is the baseline
- **Backend:** Supabase Deno Edge Functions (TypeScript, Deno runtime — not Node.js)
- **Database:** Supabase PostgreSQL + pgvector (knowledge base + RAG + call logging)
- **CLI:** Vapi CLI (installed) — use for all provisioning, testing, and deployment
- **Auth/Security:** Supabase Auth + Vapi HMAC webhook signatures

**Shared Data Contract:** The **Vapi Assistant Configuration JSON** (`vapi/assistant.json`) is the source of truth that binds every domain. Tool `name` fields and parameter schemas defined in this file MUST be mirrored exactly in the Deno Edge Function handlers. This contract is established in Phase 3 and must not be silently modified by any subsequent phase.

**Before starting Phase 1:** Read `Vapi/vapi.md` in this project to load the engineering standards that govern all code produced here.

---

## PHASE 1 — PROJECT DISCOVERY & GAP ANALYSIS

**Objective:** Scan the current project to understand what already exists, identify what is missing, and produce a gap-annotated inventory that gates all subsequent phases.

**Domain Constraints:**
- Read-only scan — do not create or modify any files in this phase
- Scan: `src/`, `supabase/`, `supabase/functions/`, `.env.example`, `package.json`, `deno.json`, `vapi.json`, `vapi/`
- Check for Vapi CLI state: `vapi list assistants`, `vapi list phone-numbers`
- Check for Supabase project: `supabase/config.toml` for project ref and region
- Identify existing webhook handlers, Deno functions, pgvector migrations, or RAG pipelines

**Deliverable:** Structured **Project Inventory & Gap Analysis**:

```
## Project Inventory

### Existing Infrastructure
- Supabase Project Ref: [ref | NOT FOUND]
- Existing Vapi Assistants (from CLI): [list | NONE]
- Existing Deno Functions: [list from supabase/functions/ | NONE]
- Existing pgvector setup: [YES — migration found | NO]
- Existing webhook handler: [path | NONE]
- Environment variables present: [list from .env.example | NONE]
- Vapi CLI config: [authenticated | NOT AUTHENTICATED]

### Detected Tech Stack
- Runtime: [Deno version | Node version | unknown]
- TypeScript config: [strict ON/OFF | NOT FOUND]
- Package manager: [npm/yarn/pnpm/deno]

### Gap Analysis
| Component                   | Status           | Recommended Action                          |
|-----------------------------|------------------|---------------------------------------------|
| STT provider config         | [EXISTS/MISSING] | Select Deepgram Nova-2 unless found         |
| Vapi assistant JSON         | [EXISTS/MISSING] | Create in Phase 3                           |
| Cartesia TTS config         | [EXISTS/MISSING] | Obtain API key + voice ID                   |
| OpenRouter config           | [EXISTS/MISSING] | Obtain API key + select model               |
| pgvector extension          | [EXISTS/MISSING] | Run migration if missing                    |
| Knowledge base schema       | [EXISTS/MISSING] | Design in Phase 4                           |
| Webhook Deno function       | [EXISTS/MISSING] | Scaffold in Phase 5                         |
| HMAC signature middleware   | [EXISTS/MISSING] | Implement in Phase 5                        |
| Env var template            | [EXISTS/MISSING] | Create .env.example in Phase 2              |
| Call logging table          | [EXISTS/MISSING] | Add Supabase table in Phase 4               |

### Suggested Additions (beyond user-specified — recommended by best practice)
- [ ] Vapi call logging table — store transcripts, duration, metadata per call
- [ ] Async tool call queue — for tools exceeding 200ms (Supabase pg_notify or Upstash)
- [ ] Conversation memory schema — store per-caller context across sessions
- [ ] Error escalation tool — allow agent to hand off to a human if confidence is low
- [ ] Vapi CLI smoke test script — automated end-to-end test for the assistant after deployment
- [ ] Webhook idempotency log — prevent duplicate tool executions on Vapi retries
```

**Reasoning Directive:** Think through what a production voice agent needs that the user may not have listed. Surface those gaps now — it is much cheaper to add a call logging table in Phase 4 than to retrofit it after go-live.

**Self-check before Phase 2:**
- [ ] All directories scanned — no assumptions about what exists
- [ ] Gap table covers all 6 user-specified implementation areas
- [ ] At least 3 suggested additions identified beyond user's list
- [ ] Vapi CLI connectivity confirmed or error clearly documented

---

## HAND-OFF: Phase 1 → Phase 2

```
Producing Domain: Discovery
Consuming Domain: Environment & Setup
Goal Achieved: Full project inventory with annotated gaps
Key Decisions Made:
  - STT provider recommendation (pending user confirmation)
  - Required env vars identified
  - Supabase project ref confirmed or flagged as needed
Artifacts Produced:
  - Project Inventory & Gap Analysis (above)
Constraints Passed Forward:
  - Deno runtime: all functions use Deno-compatible imports (jsr: or esm.sh) — no npm: for Deno v1
  - Supabase region is locked after project link — choose carefully for latency
  - Webhook URL format: https://[PROJECT_REF].supabase.co/functions/v1/vapi-webhook
Open Questions for Next Owner:
  - New Supabase project needed or existing one to link?
  - Which OpenRouter model? (recommend based on project use case found in scan)
  - Which Cartesia voice ID? (list top 3 options relevant to the agent's persona)
Next Owner: Phase 2 — Environment & Setup
```

---

## PHASE 2 — ENVIRONMENT & SETUP

**Objective:** Establish the complete local and cloud environment so every subsequent phase executes immediately without environment blockers.

**Input from Phase 1 Hand-Off:** Project Inventory & Gap Analysis — use the gap table to determine exactly which setup steps apply.

**Domain Constraints:**
- Use Vapi CLI for all Vapi provisioning — do not use the Vapi dashboard UI
- All secrets in `.env.local` (local) and Supabase Edge Function secrets (production) — never hardcoded
- Deno Edge Functions use `Deno.env.get()` — not `process.env`
- Validate all required env vars at startup using a typed `env.ts` module that throws on missing values
- Supabase CLI required alongside Vapi CLI

**Deliverable:**

**1. `.env.example`** — complete template:
```bash
# Vapi
VAPI_WEBHOOK_SECRET=          # Vapi dashboard → Webhooks → Signing Secret
VAPI_API_KEY=                 # Vapi dashboard → API Keys
VAPI_PHONE_NUMBER_ID=         # vapi list phone-numbers

# OpenRouter
OPENROUTER_API_KEY=           # openrouter.ai/keys
OPENROUTER_MODEL=             # e.g., openai/gpt-4o-mini

# Cartesia
CARTESIA_API_KEY=             # cartesia.ai/dashboard
CARTESIA_VOICE_ID=            # Cartesia voice ID for agent persona

# STT — Deepgram (recommended)
DEEPGRAM_API_KEY=             # deepgram.com/dashboard

# Supabase
SUPABASE_URL=                 # supabase status → API URL
SUPABASE_SERVICE_ROLE_KEY=    # Supabase dashboard → Settings → API → service_role
SUPABASE_ANON_KEY=            # Supabase dashboard → Settings → API → anon

# Async Queue (optional — for tools exceeding 200ms)
REDIS_URL=                    # Upstash Redis URL if async mode enabled
```

**2. `supabase/functions/_shared/env.ts`** — Deno startup validator:
```typescript
const required = [
  'VAPI_WEBHOOK_SECRET',
  'VAPI_API_KEY',
  'OPENROUTER_API_KEY',
  'CARTESIA_VOICE_ID',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

type EnvKey = (typeof required)[number];

export const env = Object.fromEntries(
  required.map((key) => {
    const value = Deno.env.get(key);
    if (!value) throw new Error(`[VAPI] Missing required env var: ${key}`);
    return [key, value];
  }),
) as Record<EnvKey, string>;
```

**3. CLI setup sequence** (execute in order):
```bash
# Vapi CLI
vapi login
vapi list assistants          # Verify connectivity
vapi list phone-numbers       # Note available numbers

# Supabase CLI
supabase login
supabase init                 # Only if no supabase/ folder exists
supabase link --project-ref [REF]
supabase db pull              # Pull existing schema

# Enable pgvector
supabase db execute "CREATE EXTENSION IF NOT EXISTS vector;"

# Set production secrets
supabase secrets set \
  VAPI_WEBHOOK_SECRET=xxx \
  VAPI_API_KEY=xxx \
  OPENROUTER_API_KEY=xxx \
  CARTESIA_VOICE_ID=xxx \
  DEEPGRAM_API_KEY=xxx \
  SUPABASE_SERVICE_ROLE_KEY=xxx
```

**Self-check before Phase 3:**
- [ ] All env vars templated with descriptions
- [ ] `env.ts` throws a clear error for every missing var at startup
- [ ] Vapi CLI: `vapi list assistants` returns without error
- [ ] Supabase: `supabase status` shows project linked
- [ ] pgvector extension enabled

---

## HAND-OFF: Phase 2 → Phase 3

```
Producing Domain: Environment & Setup
Consuming Domain: Agent Configuration
Goal Achieved: Complete environment established; all API keys templated; CLI operational
Key Decisions Made:
  - OpenRouter model selected: [DOCUMENT HERE]
  - Cartesia voice ID selected: [DOCUMENT HERE]
  - STT provider confirmed: [DOCUMENT HERE]
  - Supabase project ref: [DOCUMENT HERE]
Artifacts Produced:
  - .env.example (complete)
  - supabase/functions/_shared/env.ts
  - CLI authentication confirmed
Constraints Passed Forward:
  - Cartesia voice ID is locked — Phase 3 must use this exact value in assistant JSON
  - OpenRouter model name must be verbatim in model.model field
  - Webhook URL: https://[PROJECT_REF].supabase.co/functions/v1/vapi-webhook
Open Questions for Next Owner:
  - How many custom tools does the agent need? (Phase 3 will suggest from project scan)
  - Inbound calls, outbound calls, web calls, or all three?
  - What is the agent's persona and primary purpose? (Infer from project if possible)
Next Owner: Phase 3 — Agent Configuration
```

---

## PHASE 3 — AGENT CONFIGURATION (SHARED DATA CONTRACT)

**Objective:** Produce the complete Vapi Assistant Configuration JSON — this is the **shared data contract** for the entire system. Every tool name and parameter schema defined here creates a binding obligation on the Deno webhook handler in Phase 5.

**Input from Phase 2 Hand-Off:** Confirmed OpenRouter model, Cartesia voice ID, STT provider, webhook URL.

**Domain Constraints:**
- Tool names must be `snake_case` and match exactly what Phase 5 implements
- Tool parameter schemas must be valid JSON Schema (Draft 7)
- Cartesia: `voice.provider: "cartesia"` with `voiceId` from env
- OpenRouter: `model.provider: "openrouter"` with `model` from env
- System prompt must reflect the agent's persona inferred from the project
- Provision via CLI: `vapi create assistant --file vapi/assistant.json`
- Before starting: re-read the shared data contract goal — every tool here is a webhook commitment

**Deliverable:** `vapi/assistant.json`:
```json
{
  "name": "[PROJECT_NAME] Voice Agent",
  "model": {
    "provider": "openrouter",
    "model": "[OPENROUTER_MODEL]",
    "messages": [
      {
        "role": "system",
        "content": "[INFERRED SYSTEM PROMPT — define persona, scope, tone, escalation behavior, and what the agent can/cannot do]"
      }
    ],
    "temperature": 0.7,
    "maxTokens": 250,
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "search_knowledge_base",
          "description": "Search the project knowledge base to answer user questions",
          "parameters": {
            "type": "object",
            "properties": {
              "query": {
                "type": "string",
                "description": "The user's question or search query"
              }
            },
            "required": ["query"]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "escalate_to_human",
          "description": "Transfer the call to a human agent when the AI cannot help",
          "parameters": {
            "type": "object",
            "properties": {
              "reason": {
                "type": "string",
                "description": "Why escalation is needed"
              }
            },
            "required": ["reason"]
          }
        }
      }
    ]
  },
  "voice": {
    "provider": "cartesia",
    "voiceId": "[CARTESIA_VOICE_ID]",
    "speed": 1.0,
    "emotion": ["positivity:high", "curiosity:medium"]
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en",
    "smartFormat": true
  },
  "firstMessage": "[INFERRED OPENING — natural greeting reflecting the agent's persona]",
  "endCallMessage": "Thank you, goodbye!",
  "endCallPhrases": ["goodbye", "bye", "that's all", "hang up"],
  "serverUrl": "https://[PROJECT_REF].supabase.co/functions/v1/vapi-webhook",
  "serverUrlSecret": "[VAPI_WEBHOOK_SECRET — set in Vapi dashboard after creation]",
  "hipaaEnabled": false,
  "recordingEnabled": true,
  "silenceTimeoutSeconds": 30,
  "maxDurationSeconds": 600
}
```

**Additional tool suggestions** — add any of these if inferred from the project:
- `get_account_info` — fetch caller account data from Supabase
- `create_ticket` — log a support ticket
- `check_availability` — check calendar or inventory
- `send_confirmation` — trigger a post-call email or SMS

**CLI provisioning:**
```bash
vapi create assistant --file vapi/assistant.json
# Note the returned assistant ID — needed for Phase 6
```

**Self-check before Phase 4:**
- [ ] All tool names are `snake_case` and unique
- [ ] All tool parameter schemas are valid JSON Schema
- [ ] System prompt reflects the actual project purpose (not generic)
- [ ] `serverUrl` points to the correct Supabase Edge Function URL
- [ ] Assistant successfully created via CLI and ID documented

---

## HAND-OFF: Phase 3 → Phase 4

```
Producing Domain: Agent Configuration
Consuming Domain: Knowledge Base & RAG
Goal Achieved: Vapi assistant provisioned; tool contracts locked
Key Decisions Made:
  - Tool list finalized: [list all tool names]
  - search_knowledge_base tool requires a vector similarity search endpoint
Artifacts Produced:
  - vapi/assistant.json (complete)
  - Vapi Assistant ID: [DOCUMENT HERE]
Constraints Passed Forward:
  - search_knowledge_base must accept { query: string } and return { result: string }
  - All RAG results must be formatted as plain text (not JSON) — Vapi reads them as speech
  - Response must arrive within 450ms or trigger async fallback
Open Questions for Next Owner:
  - What documents/data will populate the knowledge base?
  - What embedding model? (recommend text-embedding-3-small via OpenAI or Jina)
  - What similarity threshold for retrieval? (start at 0.75)
Next Owner: Phase 4 — Knowledge Base & RAG Integration
```

---

## PHASE 4 — KNOWLEDGE BASE & RAG INTEGRATION

**Objective:** Design and provision the Supabase pgvector knowledge base schema and the retrieval pipeline that powers the `search_knowledge_base` tool.

**Input from Phase 3 Hand-Off:** Tool contract — `search_knowledge_base` accepts `{ query: string }`, returns `{ result: string }` as plain speech-ready text, within 450ms.

**Domain Constraints:**
- All SQL uses Supabase pgvector (`vector` type, `<=>` cosine distance operator)
- Embedding model must be consistent between ingestion and retrieval — never mix models
- Retrieved text must be speech-safe: no markdown, no JSON, no code blocks
- Chunk size: 512 tokens with 50-token overlap (adjust based on document type)
- Before starting: re-read Phase 3 tool contract — the retrieval response format is binding

**Deliverable:**

**1. `supabase/migrations/[timestamp]_knowledge_base.sql`**:
```sql
-- Enable vector extension (if not already done)
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base documents
CREATE TABLE knowledge_base (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  embedding   VECTOR(1536),         -- Adjust dimension for your embedding model
  metadata    JSONB DEFAULT '{}',
  source      TEXT,                  -- e.g., 'faq', 'product-docs', 'policy'
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast similarity search
CREATE INDEX knowledge_base_embedding_idx
  ON knowledge_base
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Call log table (suggested addition from Phase 1)
CREATE TABLE vapi_call_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vapi_call_id    TEXT UNIQUE NOT NULL,
  assistant_id    TEXT NOT NULL,
  transcript      TEXT,
  summary         TEXT,
  duration_seconds INTEGER,
  recording_url   TEXT,
  ended_reason    TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Similarity search function
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.75,
  match_count     INT DEFAULT 3
)
RETURNS TABLE (
  id       UUID,
  content  TEXT,
  title    TEXT,
  source   TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    title,
    source,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

**2. `supabase/functions/_shared/rag.ts`** — retrieval helper:
```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { env } from './env.ts';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function searchKnowledgeBase(query: string): Promise<string> {
  // 1. Embed the query
  const embedRes = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY') ?? ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: query }),
  });

  const embedJson = await embedRes.json() as { data: [{ embedding: number[] }] };
  const embedding = embedJson.data[0]?.embedding;
  if (!embedding) return 'I could not find relevant information.';

  // 2. Search pgvector
  const { data, error } = await supabase.rpc('match_knowledge_base', {
    query_embedding: embedding,
    match_threshold: 0.75,
    match_count: 3,
  });

  if (error || !data?.length) return 'I could not find relevant information.';

  // 3. Return speech-safe plain text (no markdown)
  return data.map((row: { title: string; content: string }) =>
    `${row.title}: ${row.content}`
  ).join('. ');
}
```

**3. Run migration:**
```bash
supabase db push
```

**Self-check before Phase 5:**
- [ ] pgvector migration applied successfully (`supabase db push`)
- [ ] `match_knowledge_base` function returns plain text, not JSON
- [ ] Embedding dimension matches the chosen model (1536 for text-embedding-3-small)
- [ ] Call log table created for post-call data capture
- [ ] RAG helper returns within 450ms on test query

---

## HAND-OFF: Phase 4 → Phase 5

```
Producing Domain: Knowledge Base & RAG
Consuming Domain: Backend Webhooks & Custom Tools
Goal Achieved: pgvector schema live; retrieval helper ready; call log table provisioned
Key Decisions Made:
  - Embedding model locked: text-embedding-3-small (1536 dimensions)
  - Similarity threshold: 0.75
  - RAG response format: speech-safe plain text
Artifacts Produced:
  - supabase/migrations/[ts]_knowledge_base.sql
  - supabase/functions/_shared/rag.ts
Constraints Passed Forward:
  - search_knowledge_base handler must call searchKnowledgeBase(query) from rag.ts
  - end-of-call-report handler must write to vapi_call_log table
  - All Supabase client calls use service_role key — never anon key in Edge Functions
Open Questions for Next Owner:
  - Which async queue for tools exceeding 200ms? (Supabase pg_notify or Upstash Redis)
  - Should conversation memory persist across calls? (add caller_id lookup if yes)
Next Owner: Phase 5 — Backend Webhooks & Custom Tools
```

---

## PHASE 5 — BACKEND WEBHOOKS & CUSTOM TOOLS

**Objective:** Implement the Supabase Deno Edge Function webhook handler that receives all Vapi events and executes tool calls within the sub-500ms budget defined in `/vapi` standards.

**Input from Phase 4 Hand-Off:** `searchKnowledgeBase()` helper, `vapi_call_log` table, tool contracts from Phase 3.

**Domain Constraints:**
- Deno Edge Function runtime — no Node.js APIs, no `require()`
- Raw body must be read before JSON parsing (HMAC verification requires the raw buffer)
- `timingSafeEqual` for HMAC — never string comparison
- Sub-500ms total response budget (from `/vapi` S1 standard)
- Zod schemas for all incoming events (from `/vapi` S2 standard)
- Before starting: re-read the tool names from Phase 3 — they must match exactly

**Deliverable:** `supabase/functions/vapi-webhook/index.ts`:

```typescript
import { z } from 'npm:zod@3';
import { timingSafeEqual, createHmac } from 'node:crypto';
import { searchKnowledgeBase } from '../_shared/rag.ts';
import { env } from '../_shared/env.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ── Zod Schemas ───────────────────────────────────────────────────────────────

const CallSchema = z.object({
  id: z.string(),
  orgId: z.string().optional(),
  type: z.enum(['inboundPhoneCall', 'outboundPhoneCall', 'webCall']).optional(),
});

const FunctionCallEventSchema = z.object({
  message: z.object({
    type: z.literal('function-call'),
    call: CallSchema,
    functionCall: z.object({
      name: z.string(),
      parameters: z.record(z.unknown()),
    }),
  }),
});

const EndOfCallReportSchema = z.object({
  message: z.object({
    type: z.literal('end-of-call-report'),
    call: CallSchema,
    transcript: z.string().optional(),
    summary: z.string().optional(),
    recordingUrl: z.string().url().optional(),
    durationSeconds: z.number().optional(),
    endedReason: z.string().optional(),
  }),
});

const VapiEventSchema = z.discriminatedUnion('message.type', [
  FunctionCallEventSchema,
  EndOfCallReportSchema,
]).or(z.object({ message: z.object({ type: z.string() }) }));

const ToolCallResponseSchema = z.object({
  results: z.array(z.object({
    toolCallId: z.string(),
    result: z.string(),
  })),
});

// ── Security ──────────────────────────────────────────────────────────────────

function verifySignature(rawBody: Uint8Array, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const digest = createHmac('sha256', secret).update(rawBody).digest('hex');
  const expected = new TextEncoder().encode(`sha256=${digest}`);
  const received = new TextEncoder().encode(signature);
  if (expected.byteLength !== received.byteLength) return false;
  return timingSafeEqual(expected, received);
}

// ── Tool Handlers ─────────────────────────────────────────────────────────────

async function handleSearchKnowledgeBase(
  params: Record<string, unknown>,
  callId: string,
): Promise<string> {
  const query = z.string().parse(params['query']);
  return await searchKnowledgeBase(query);
}

async function handleEscalateToHuman(
  params: Record<string, unknown>,
  callId: string,
): Promise<string> {
  const reason = z.string().parse(params['reason']);
  console.log(`[VAPI][escalate_to_human][${callId}] Reason: ${reason}`);
  // Add your escalation logic here (e.g., notify on-call team)
  return 'I am transferring you to a human agent now. Please hold.';
}

// ── Tool Router ───────────────────────────────────────────────────────────────

async function routeToolCall(
  name: string,
  parameters: Record<string, unknown>,
  callId: string,
): Promise<string> {
  switch (name) {
    case 'search_knowledge_base':
      return await handleSearchKnowledgeBase(parameters, callId);
    case 'escalate_to_human':
      return await handleEscalateToHuman(parameters, callId);
    default:
      console.warn(`[VAPI][unknown-tool][${callId}] Tool not found: ${name}`);
      return 'I am sorry, I could not complete that action.';
  }
}

// ── Event Handlers ────────────────────────────────────────────────────────────

async function handleFunctionCall(
  event: z.infer<typeof FunctionCallEventSchema>,
  res: Response,
  startTime: number,
): Promise<Response> {
  const { call, functionCall } = event.message;
  const idempotencyKey = `${call.id}:${functionCall.name}`;

  // Fast-acknowledge pattern: if budget nearly exhausted, enqueue
  const elapsed = Date.now() - startTime;
  const budget = 450 - elapsed;

  const result = await Promise.race([
    routeToolCall(functionCall.name, functionCall.parameters as Record<string, unknown>, call.id),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), budget)
    ),
  ]).catch(async (err: unknown) => {
    if (err instanceof Error && err.message === 'TIMEOUT') {
      // TODO: enqueue via pg_notify or Upstash for async completion
      console.warn(`[VAPI][timeout][${call.id}] Tool ${functionCall.name} exceeded budget`);
      return 'I am processing your request. Please give me a moment.';
    }
    throw err;
  });

  const response = ToolCallResponseSchema.parse({
    results: [{ toolCallId: functionCall.name, result }],
  });

  const durationMs = Date.now() - startTime;
  console.log(`[VAPI][function-call][${call.id}][${functionCall.name}] ${durationMs}ms`);

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleEndOfCallReport(
  event: z.infer<typeof EndOfCallReportSchema>,
): Promise<Response> {
  const { call, transcript, summary, recordingUrl, durationSeconds, endedReason } = event.message;

  await supabase.from('vapi_call_log').insert({
    vapi_call_id: call.id,
    assistant_id: Deno.env.get('VAPI_ASSISTANT_ID') ?? 'unknown',
    transcript: transcript ?? null,
    summary: summary ?? null,
    recording_url: recordingUrl ?? null,
    duration_seconds: durationSeconds ?? null,
    ended_reason: endedReason ?? null,
  });

  console.log(`[VAPI][end-of-call-report][${call.id}] Call logged`);
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now();

  // 1. Read raw body for HMAC verification
  const rawBody = new Uint8Array(await req.arrayBuffer());
  const signature = req.headers.get('x-vapi-secret');

  // 2. Verify signature
  if (!verifySignature(rawBody, signature, env.VAPI_WEBHOOK_SECRET)) {
    console.warn(`[VAPI][auth-fail] Invalid signature from ${req.headers.get('cf-connecting-ip')}`);
    return new Response('Unauthorized', { status: 401 });
  }

  // 3. Parse body
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  // 4. Validate event schema
  const parsed = VapiEventSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('[VAPI][schema-error]', JSON.stringify(parsed.error.issues));
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }

  // 5. Route on event type
  const eventType = (parsed.data as { message: { type: string } }).message.type;

  try {
    switch (eventType) {
      case 'function-call':
        return await handleFunctionCall(
          parsed.data as z.infer<typeof FunctionCallEventSchema>,
          new Response(),
          startTime,
        );
      case 'end-of-call-report':
        return await handleEndOfCallReport(
          parsed.data as z.infer<typeof EndOfCallReportSchema>,
        );
      default:
        console.log(`[VAPI][${eventType}] Acknowledged`);
        return new Response(JSON.stringify({ received: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (err) {
    console.error('[VAPI][error]', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
});
```

**Self-check before Phase 6:**
- [ ] HMAC verification uses `timingSafeEqual` — not string comparison
- [ ] All tool names in `routeToolCall` match exactly the names in `vapi/assistant.json`
- [ ] `end-of-call-report` writes to `vapi_call_log`
- [ ] Sub-500ms budget enforced via `Promise.race` + timeout fallback
- [ ] Zod validates all incoming events before any property access
- [ ] Outgoing tool responses validated with `ToolCallResponseSchema.parse()`

---

## HAND-OFF: Phase 5 → Phase 6

```
Producing Domain: Backend Webhooks & Custom Tools
Consuming Domain: Testing & Deployment
Goal Achieved: Full webhook handler deployed with security, validation, and all tool handlers
Key Decisions Made:
  - Function name: vapi-webhook
  - All tool handlers implemented and routed
  - Call logging active for end-of-call-report events
Artifacts Produced:
  - supabase/functions/vapi-webhook/index.ts
  - supabase/functions/_shared/rag.ts
  - supabase/functions/_shared/env.ts
Constraints Passed Forward:
  - Webhook URL is: https://[PROJECT_REF].supabase.co/functions/v1/vapi-webhook
  - This URL must be set in vapi/assistant.json serverUrl AND in Vapi dashboard
  - VAPI_WEBHOOK_SECRET must match between Supabase secrets and Vapi dashboard
Open Questions for Next Owner:
  - Is a staging environment needed before production deployment?
  - What is the acceptable p99 latency threshold for tool calls?
Next Owner: Phase 6 — Testing & Deployment
```

---

## PHASE 6 — TESTING & DEPLOYMENT

**Objective:** Deploy the complete system to production and verify it works end-to-end with real voice calls.

**Input from Phase 5 Hand-Off:** Deployed Deno function URL, Vapi assistant ID, all secrets set.

**Domain Constraints:**
- Use Vapi CLI for all testing and assistant updates
- Test in this order: unit → integration → voice smoke test → load
- Never test with production credentials against a production assistant until integration tests pass
- Before starting: re-read all tool names and confirm they are wired end-to-end

**Deliverable:**

**1. Deploy Edge Function:**
```bash
supabase functions deploy vapi-webhook --no-verify-jwt
```

**2. Update assistant with production webhook URL:**
```bash
# Get your assistant ID
vapi list assistants

# Update serverUrl
vapi update assistant [ASSISTANT_ID] \
  --server-url "https://[PROJECT_REF].supabase.co/functions/v1/vapi-webhook"
```

**3. Integration test — simulate Vapi webhook events:**
```bash
# Test function-call event
curl -X POST https://[PROJECT_REF].supabase.co/functions/v1/vapi-webhook \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: sha256=$(echo -n '{"message":{"type":"function-call",...}}' | openssl dgst -sha256 -hmac $VAPI_WEBHOOK_SECRET | awk '{print $2}')" \
  -d '{"message":{"type":"function-call","call":{"id":"test-123"},"functionCall":{"name":"search_knowledge_base","parameters":{"query":"test query"}}}}'

# Expected: { "results": [{ "toolCallId": "search_knowledge_base", "result": "..." }] }
# Expected response time: < 500ms
```

**4. Vapi CLI voice smoke test:**
```bash
# Create a test web call
vapi call create --assistant-id [ASSISTANT_ID] --type web

# Or test with a phone number
vapi call create --assistant-id [ASSISTANT_ID] --phone-number-id [PHONE_NUMBER_ID] \
  --customer-number "+1234567890"
```

**5. Post-deployment checklist:**
```
[ ] supabase functions deploy succeeded with no errors
[ ] Webhook URL updated in Vapi assistant config
[ ] VAPI_WEBHOOK_SECRET matches between Supabase secrets and Vapi dashboard
[ ] Test function-call webhook returns 200 within 500ms
[ ] Test end-of-call-report writes a row to vapi_call_log
[ ] Voice smoke test: agent answers, responds to a question, and searches knowledge base
[ ] Voice smoke test: agent correctly escalates when asked
[ ] Knowledge base has at least some documents ingested for retrieval testing
[ ] Call log row created after smoke test call ends
[ ] No 401 or 500 errors in Supabase Edge Function logs
```

**6. Monitor in production:**
```bash
# Stream Edge Function logs
supabase functions logs vapi-webhook --follow

# Check recent calls via Vapi CLI
vapi list calls --limit 10
```

---

## INTEGRATION VALIDATION — Run after all phases complete

```
[ ] vapi/assistant.json tool names match exactly the switch cases in vapi-webhook/index.ts
[ ] Cartesia voice ID in assistant.json matches CARTESIA_VOICE_ID env var
[ ] OpenRouter model in assistant.json matches OPENROUTER_MODEL env var
[ ] Webhook URL in assistant.json matches deployed Supabase function URL
[ ] VAPI_WEBHOOK_SECRET in Supabase secrets matches the signing secret in Vapi dashboard
[ ] pgvector embedding dimension (1536) matches the model used in rag.ts
[ ] All tool parameter schemas in assistant.json match what Zod validates in index.ts
[ ] end-of-call-report handler writes all fields present in vapi_call_log schema
[ ] RAG retrieval returns speech-safe plain text — no markdown, JSON, or code blocks
[ ] All nullable fields in VapiEventSchema have safe fallback handling
[ ] Every Open Question from every hand-off is resolved or has a named owner
[ ] p99 tool call latency verified under 500ms via load test or Supabase function logs
```

---

## QUALITY GATES & SELF-VERIFICATION

Before presenting the final plan, verify:

1. **Completeness** — All 6 phases have concrete artifacts (files, SQL, CLI commands) — no vague descriptions
2. **Latency contract** — Every tool handler has an explicit timeout and fallback path
3. **Security** — HMAC verification is the first operation in the webhook handler, before any parsing
4. **Tool contract integrity** — Tool names in `assistant.json` match switch cases in `index.ts` — list them side by side to confirm
5. **Speech safety** — All text returned to Vapi (RAG results, tool responses) is plain text readable aloud
6. **Gap closure** — Every gap identified in Phase 1 has been addressed by a subsequent phase or flagged with a named owner
7. **Suggested additions** — At least 3 suggested improvements from Phase 1 are included in the plan
8. **Environment completeness** — Every secret used in code appears in `.env.example` with a description
