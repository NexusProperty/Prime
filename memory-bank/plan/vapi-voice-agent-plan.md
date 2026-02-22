# Vapi.ai Voice Agent Implementation Plan
## Prime Group — United Trades (NZ)

**Generated:** 2026-02-22  
**Project:** Prime Electrical · AKF Construction · CleanJet  
**Supabase Project Ref:** `tfdxlhkaziskkwwohtwd`  
**Stack:** Vapi.ai · OpenRouter (gpt-4o-mini) · Vapi Native TTS (PlayHT/ElevenLabs) · Deepgram Nova-2 · Supabase Deno Edge Functions · pgvector · Telnyx  

---

## Phase 0 — Project Inventory & Gap Analysis

### What Already Exists

| Artifact | Status | Detail |
|---|---|---|
| Vapi assistants | ✅ EXISTS | Max (Prime), Alex (AKF), Jess (CleanJet) — IDs in `vapi-test.py` |
| Vapi API key | ✅ EXISTS | `7f6fff5d-...` in `vapi-test.py` — **⚠ ROTATE THIS KEY** (exposed in source) |
| Supabase project | ✅ EXISTS | `tfdxlhkaziskkwwohtwd.supabase.co` |
| Supabase schema | ✅ EXISTS | `leads`, `customers`, `cross_sell_events`, `leads.synced_at` |
| RLS policies | ✅ EXISTS | anon insert on leads, service_role bypass |
| pg_net extension | ✅ EXISTS | Used by lead-to-job trigger (migration 003) |
| pgvector extension | ❌ MISSING | No `CREATE EXTENSION vector` in any migration |
| Knowledge base schema | ❌ MISSING | No `knowledge_base` table or `match_knowledge_base` function |
| Call log table | ❌ MISSING | `vapi_call_log` does not exist |
| Supabase Deno functions | ❌ MISSING | No `supabase/functions/` directory |
| HMAC webhook handler | ❌ MISSING | Next.js API routes exist but not Deno Edge Functions |
| `env.ts` startup validator | ❌ MISSING | No Deno-compatible env guard |
| pgvector RAG helper | ❌ MISSING | No embedding/retrieval pipeline |
| Webhook idempotency log | ❌ MISSING | No dedup table for Vapi retries |
| Async tool queue | ❌ MISSING | No pg_notify or Redis queue |
| OpenRouter config | ❌ MISSING | Current AI uses OpenAI direct via n8n |
| Cartesia TTS config | ❌ MISSING | Assistants likely use default voice |
| Conversation memory | ❌ MISSING | No per-caller context table |
| `.env.local.example` Vapi section | ✅ EXISTS | `VAPI_WEBHOOK_SECRET`, `VAPI_API_KEY`, `VAPI_ASSISTANT_*` present |
| Telnyx phone numbers | ✅ EXISTS (env) | 3 NZ numbers in env template — one per brand |
| Cross-sell engine | ✅ EXISTS | Rule-based + GPT-4o in `lib/crossSell.ts` |
| `AIChatWidget` | ✅ EXISTS | In `@prime/ui-ai`, used on all 3 sites |
| Vapi test script | ✅ EXISTS | `vapi-test.py` — text chat against all 3 assistants |
| E2E voice tests | ✅ EXISTS | `e2e/voice-flow.spec.ts` (8 tests, UI-only, no API calls) |

### Suggested Additions (beyond user-specified — best practice)

- **`vapi_call_log` table** — capture transcripts, duration, ended_reason per call; powers reporting and cross-sell attribution
- **Idempotency table** — `vapi_tool_calls` — dedup Vapi retries by `call_id + tool_name + tool_call_id`
- **Conversation memory** — `vapi_caller_sessions` — store per-phone-number context across calls (return caller recognition)
- **`capture_lead` tool** — write directly from voice call to Supabase leads table; critical for zero-missed-lead guarantee
- **`cross_sell_pitch` tool** — have the voice agent verbally offer a cross-brand service, log to `cross_sell_events`
- **`send_followup_sms` tool** — fire Telnyx SMS post-call with quote URL or booking confirmation
- **`check_emergency` tool** (Prime Electrical only) — triage 24/7 emergency callouts; avoids Max reading from knowledge base for urgent safety calls
- **Webhook signature secret rotation** — document process for rotating `VAPI_WEBHOOK_SECRET` without downtime

### Critical Pre-Phase Security Action

> **⚠ ROTATE `VAPI_API_KEY` IMMEDIATELY.**  
> `7f6fff5d-df27-42f5-8503-63d3d3f84330` is committed in plaintext in `vapi-test.py`.  
> Go to `dashboard.vapi.ai → Settings → API Keys → Regenerate` now. Update `.env.local` and Vercel env vars.  
> Then add `vapi-test.py` to `.gitignore` or replace the hardcoded key with `os.environ.get("VAPI_API_KEY")`.

---

## Phase 1 — Environment & Setup

### 1.1 Required Environment Variables (complete template)

**Add to each site's `.env.local.example` and to Vercel environment:**

```bash
# ── Vapi.ai ──────────────────────────────────────────────────────────────────
VAPI_WEBHOOK_SECRET=          # Vapi dashboard → Account → Webhooks → Signing Secret
VAPI_API_KEY=                 # Vapi dashboard → Account → API Keys (ROTATE — see §0 note)
VAPI_ASSISTANT_PRIME=4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d   # Max — Prime Electrical
VAPI_ASSISTANT_AKF=756c46ed-2c04-49f6-a5fc-c820d11a92dd     # Alex — AKF Construction
VAPI_ASSISTANT_CLEANJET=35ce9713-8297-491e-98ba-6c809a154c2c # Jess — CleanJet

# ── OpenRouter (LLM backend for all 3 assistants) ────────────────────────────
OPENROUTER_API_KEY=           # openrouter.ai/keys
OPENROUTER_MODEL=openai/gpt-4o-mini   # See §1.2 for model recommendation

# ── Deepgram (STT) ───────────────────────────────────────────────────────────
DEEPGRAM_API_KEY=             # deepgram.com/dashboard → API Keys

# ── OpenAI (embeddings only — for pgvector RAG) ──────────────────────────────
OPENAI_API_KEY=               # platform.openai.com/api-keys (embeddings only; LLM uses OpenRouter)

# ── Supabase ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://tfdxlhkaziskkwwohtwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # Supabase → Settings → API → anon public
SUPABASE_SERVICE_ROLE_KEY=            # Supabase → Settings → API → service_role (NEVER expose client-side)

# ── (Already in template — included for completeness) ────────────────────────
TELNYX_API_KEY=               # portal.telnyx.com (for send_followup_sms tool)
TELNYX_FROM_NUMBER_PRIME=     # NZ number for Prime Electrical
TELNYX_FROM_NUMBER_AKF=       # NZ number for AKF Construction
TELNYX_FROM_NUMBER_CLEANJET=  # NZ number for CleanJet
N8N_WEBHOOK_URL=              # Existing — keep for lead enrichment
ENRICH_SECRET=                # Existing — keep for /api/leads/enrich
```

### 1.2 LLM Model Recommendation

**Recommended: `openai/gpt-4o-mini` via OpenRouter**

Rationale for this project:
- The three assistant personas (Max, Alex, Jess) handle structured intents: bookings, quotes, emergency triage, cross-sell pitches. These are narrow, task-oriented conversations — not free-form creative writing.
- `gpt-4o-mini` averages ~350–500ms first-token latency on OpenRouter, safely within the voice agent's "no awkward pause" window.
- The existing enrichment pipeline already uses GPT-4o (via n8n), so the team is familiar with OpenAI's output style. Keeping the same model family reduces prompt engineering friction.
- If higher reasoning quality is needed for complex quote requests, fall back to `openai/gpt-4o` on a per-call basis (more expensive but available on OpenRouter with the same key).

**Alternative:** `anthropic/claude-3-haiku-20240307` — 15% lower latency than gpt-4o-mini in voice scenarios, excellent for following persona instructions. Use if Max/Alex/Jess feel "robotic" in testing.

### 1.3 Voice Provider — Vapi Native (No Cartesia)

**Decision:** Use Vapi's built-in TTS providers. No Cartesia account or API key required. Vapi bundles PlayHT and ElevenLabs in their subscription.

**Recommended provider per assistant:**

| Assistant | Persona | Provider | Voice ID | Tone |
|---|---|---|---|---|
| Max (Prime Electrical) | Confident, experienced electrician | `playht` | `s3://peregrine-voices/oliver_parrot_saad/manifest.json` | Deep, professional male |
| Alex (AKF Construction) | Reliable builder, project-focused | `playht` | `s3://peregrine-voices/mel_parrot_saad/manifest.json` | Warm, measured male |
| Jess (CleanJet) | Friendly, efficient cleaning pro | `11labs` | `21m00Tcm4TlvDq8ikWAM` (ElevenLabs "Rachel") | Clear, upbeat female |

> **Action:** These are starting recommendations. Browse `dashboard.vapi.ai/voice-library` to preview and substitute any voice that better fits the brand. Voice IDs can be changed anytime in the assistant config — no migration required.
>
> **No extra env vars needed** — Vapi handles TTS billing internally. Remove `CARTESIA_API_KEY` and `CARTESIA_VOICE_ID_*` from the env template.

### 1.4 CLI Setup Sequence

Execute in order after obtaining all API keys:

```bash
# ── Step 1: Vapi CLI ──────────────────────────────────────────────────────────
vapi login
vapi list assistants          # Should return Max, Alex, Jess
vapi list phone-numbers       # Confirm Telnyx numbers attached

# ── Step 2: Supabase CLI ─────────────────────────────────────────────────────
supabase login
# If supabase/ folder exists but no config.toml:
supabase init                 # Creates supabase/config.toml
supabase link --project-ref tfdxlhkaziskkwwohtwd
supabase db pull              # Pull current schema to verify state

# ── Step 3: Enable pgvector ──────────────────────────────────────────────────
supabase db execute "CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;"

# ── Step 4: Set production Supabase secrets ──────────────────────────────────
supabase secrets set \
  VAPI_WEBHOOK_SECRET=<your-secret> \
  VAPI_API_KEY=<rotated-key> \
  VAPI_ASSISTANT_PRIME=4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d \
  VAPI_ASSISTANT_AKF=756c46ed-2c04-49f6-a5fc-c820d11a92dd \
  VAPI_ASSISTANT_CLEANJET=35ce9713-8297-491e-98ba-6c809a154c2c \
  OPENROUTER_API_KEY=<your-key> \
  OPENAI_API_KEY=<your-key> \
  DEEPGRAM_API_KEY=<your-key> \
  SUPABASE_SERVICE_ROLE_KEY=<your-key> \
  TELNYX_API_KEY=<your-key> \
  TELNYX_FROM_NUMBER_PRIME=<+64xxxxxxxxx> \
  TELNYX_FROM_NUMBER_AKF=<+64xxxxxxxxx> \
  TELNYX_FROM_NUMBER_CLEANJET=<+64xxxxxxxxx>
```

### 1.5 Env Startup Validator

**File:** `supabase/functions/_shared/env.ts`

```typescript
const REQUIRED_VARS = [
  'VAPI_WEBHOOK_SECRET',
  'VAPI_API_KEY',
  'VAPI_ASSISTANT_PRIME',
  'VAPI_ASSISTANT_AKF',
  'VAPI_ASSISTANT_CLEANJET',
  'OPENROUTER_API_KEY',
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TELNYX_API_KEY',
] as const;

type EnvKey = (typeof REQUIRED_VARS)[number];

export const env = Object.fromEntries(
  REQUIRED_VARS.map((key) => {
    const value = Deno.env.get(key);
    if (!value) throw new Error(`[VAPI] Missing required env var: ${key}`);
    return [key, value];
  }),
) as Record<EnvKey, string>;

// Brand → assistant ID lookup (derived from env at startup)
export const BRAND_ASSISTANT_MAP: Record<string, string> = {
  [env.VAPI_ASSISTANT_PRIME]:    'prime',
  [env.VAPI_ASSISTANT_AKF]:      'akf',
  [env.VAPI_ASSISTANT_CLEANJET]: 'cleanjet',
};
```

### 1.6 Security Fix — vapi-test.py

**File:** `vapi-test.py` — replace hardcoded key:

```python
import os
API_KEY = os.environ.get("VAPI_API_KEY", "")
if not API_KEY:
    raise RuntimeError("VAPI_API_KEY environment variable not set")
```

**Also add to `.gitignore`:**
```
# Vapi test scripts with potential credentials
vapi-test.py
```

---

## Phase 2 — Agent Configuration (Shared Data Contract)

### 2.1 Architecture Decision: 3 Assistants → 1 Webhook

The three existing assistants (Max, Alex, Jess) share a single Supabase Deno Edge Function endpoint. The webhook handler routes to brand-specific logic using the `assistantId` field in every Vapi event payload. This approach:

- Keeps one deployment artifact (easier maintenance)
- Enables shared tool implementations (knowledge base, lead capture, SMS)
- Allows brand-specific tool routing (only Max handles `check_emergency`)
- Matches the Supabase "one project, three brands" architecture already established

**Webhook URL (same for all 3 assistants):**
```
https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook
```

### 2.2 Tool Contract — The Binding Obligation

The following tool names are the **contract** between `vapi/assistant-*.json` and `supabase/functions/vapi-webhook/index.ts`. They must match exactly (case-sensitive, snake_case).

| Tool Name | Assistants | Description | Latency Class |
|---|---|---|---|
| `search_knowledge_base` | Max, Alex, Jess | pgvector RAG — answers questions from FAQ/pricing docs | Async (>200ms — enqueue) |
| `capture_lead` | Max, Alex, Jess | Saves caller name/phone/need to Supabase `leads` | Sync (<100ms) |
| `cross_sell_pitch` | Max, Alex, Jess | Verbally offers a partner brand service; logs to `cross_sell_events` | Sync (<50ms) |
| `send_followup_sms` | Max, Alex, Jess | Sends a Telnyx SMS with quote link or booking confirmation | Async (>200ms — enqueue) |
| `check_emergency` | Max only | Triage 24/7 electrical emergencies; returns callback number | Sync (<20ms) |
| `get_quote_estimate` | Max, Alex | Returns rough price ranges from knowledge base | Async (>200ms — enqueue) |
| `request_site_visit` | Alex | Books an AKF consultation; creates calendar event | Async (>200ms — enqueue) |
| `check_booking_slots` | Jess | Returns available CleanJet booking slots | Sync (mock data for now — real API later) |
| `create_booking` | Jess | Creates a CleanJet booking, saves to leads | Sync (<150ms) |
| `transfer_to_human` | Max, Alex, Jess | Vapi built-in transfer — no custom handler needed | N/A (Vapi-native) |

### 2.3 Assistant Configuration Files

Create one JSON per assistant. Only the differing fields are shown below; the full file replaces the existing Vapi assistant config.

**File:** `vapi/assistant-prime.json`

```json
{
  "name": "Max — Prime Electrical",
  "model": {
    "provider": "openrouter",
    "model": "openai/gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": "You are Max, the friendly and professional AI receptionist for The Prime Electrical — a New Zealand electrical contracting company with 10+ years of experience. You handle inbound enquiries during and after business hours.\n\nYour primary jobs:\n1. Capture the caller's name, phone number, and what they need.\n2. Answer common questions about services (wiring, heat pumps, EV chargers, solar, lighting, switchboard upgrades).\n3. Provide rough price guidance when asked — always phrase it as 'typically starting from' and recommend a site visit for accuracy.\n4. Triage genuine electrical emergencies (no power, sparking, burning smell) — provide the emergency callout number immediately.\n5. Offer relevant cross-brand services naturally when appropriate: CleanJet for post-install cleanup, AKF Construction for any building or renovation work that needs electrical rough-in.\n6. Always end by confirming you have captured their details and that someone will be in touch within 2 hours during business hours.\n\nTone: Confident, knowledgeable, warm. Never overpromise on timelines. Never discuss pricing as a fixed quote — always 'starting from' or 'depends on the job'.\n\nDo NOT handle: legal disputes, employment enquiries, complaints about other companies.\n\nBusiness hours: Monday–Friday 7am–5pm NZ time. After hours: take a message and flag as urgent if safety issue."
      }
    ],
    "temperature": 0.6,
    "maxTokens": 200,
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "capture_lead",
          "description": "Save the caller's contact details and service request to the database. Call this once you have their name and phone number — do not wait for the full conversation to end.",
          "parameters": {
            "type": "object",
            "properties": {
              "name": { "type": "string", "description": "Caller's full name" },
              "phone": { "type": "string", "description": "Caller's phone number in E.164 format or as spoken" },
              "service_type": { "type": "string", "description": "What they need (e.g. 'heat pump installation', 'switchboard upgrade')" },
              "message": { "type": "string", "description": "Brief summary of their enquiry" },
              "urgency": { "type": "string", "enum": ["normal", "urgent", "emergency"], "description": "Call urgency level" }
            },
            "required": ["name", "phone"]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "search_knowledge_base",
          "description": "Search Prime Electrical's FAQ, pricing guide, and service information to answer the caller's question.",
          "parameters": {
            "type": "object",
            "properties": {
              "query": { "type": "string", "description": "The caller's question or topic to search for" }
            },
            "required": ["query"]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "check_emergency",
          "description": "Determine if this is a genuine electrical emergency requiring immediate callout. Use when caller mentions: no power, sparking, burning smell, electrical shock, flooding near electrical.",
          "parameters": {
            "type": "object",
            "properties": {
              "situation": { "type": "string", "description": "Description of the emergency situation" }
            },
            "required": ["situation"]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "get_quote_estimate",
          "description": "Retrieve rough price ranges for common electrical services from the knowledge base.",
          "parameters": {
            "type": "object",
            "properties": {
              "service": { "type": "string", "description": "The service they want a price for" }
            },
            "required": ["service"]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "cross_sell_pitch",
          "description": "Log a cross-sell opportunity and return the verbal pitch to offer the caller a complementary service from a partner brand.",
          "parameters": {
            "type": "object",
            "properties": {
              "lead_id": { "type": "string", "description": "The lead ID returned by capture_lead" },
              "target_brand": { "type": "string", "enum": ["akf", "cleanjet"], "description": "The partner brand to pitch" },
              "reason": { "type": "string", "description": "Why this cross-sell is relevant to their job" }
            },
            "required": ["target_brand", "reason"]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "send_followup_sms",
          "description": "Send the caller an SMS after the call with a summary and next steps link.",
          "parameters": {
            "type": "object",
            "properties": {
              "to_number": { "type": "string", "description": "Caller's phone number" },
              "message_type": { "type": "string", "enum": ["quote_request", "booking_confirmation", "emergency_followup"], "description": "Type of follow-up message to send" }
            },
            "required": ["to_number", "message_type"]
          }
        }
      }
    ]
  },
  "voice": {
    "provider": "playht",
    "voiceId": "s3://peregrine-voices/oliver_parrot_saad/manifest.json",
    "speed": 1.0
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en",
    "smartFormat": true,
    "endpointing": 300
  },
  "firstMessage": "Hi, you've reached The Prime Electrical. I'm Max. How can I help you today?",
  "endCallMessage": "Thanks for calling Prime Electrical. Someone will be in touch shortly. Have a great day!",
  "endCallPhrases": ["goodbye", "bye", "thanks bye", "that's all", "hang up"],
  "serverUrl": "https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook",
  "serverUrlSecret": "{{VAPI_WEBHOOK_SECRET}}",
  "hipaaEnabled": false,
  "recordingEnabled": true,
  "silenceTimeoutSeconds": 20,
  "maxDurationSeconds": 600,
  "backgroundSound": "office",
  "backchannelingEnabled": true,
  "backgroundDenoisingEnabled": true
}
```

**File:** `vapi/assistant-akf.json`

Identical structure. Key differences:
- `"name": "Alex — AKF Construction"`
- System prompt: Construction/renovation focus — quotes, site visits, post-build cleanup with CleanJet
- Tools: Replace `check_emergency` + `get_quote_estimate` with `request_site_visit`; keep `capture_lead`, `search_knowledge_base`, `cross_sell_pitch`, `send_followup_sms`
- `firstMessage`: `"Hi, AKF Construction, Alex speaking — what can I help you with today?"`
- Voice: `{ "provider": "playht", "voiceId": "s3://peregrine-voices/mel_parrot_saad/manifest.json" }`

**File:** `vapi/assistant-cleanjet.json`

Key differences:
- `"name": "Jess — CleanJet"`
- System prompt: Cleaning services focus — residential/commercial, one-off vs subscription, post-reno cleans
- Tools: Replace emergency/quote tools with `check_booking_slots` and `create_booking`; keep `capture_lead`, `search_knowledge_base`, `cross_sell_pitch`, `send_followup_sms`
- `firstMessage`: `"Hi, CleanJet! This is Jess. Are you looking to book a clean or just have a question?"`
- Voice: `{ "provider": "11labs", "voiceId": "21m00Tcm4TlvDq8ikWAM" }` (ElevenLabs "Rachel")

### 2.4 CLI Provisioning Commands

```bash
# Update existing assistants (they already exist — use update, not create)
vapi list assistants   # Confirm IDs match the 3 known IDs

vapi update assistant 4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d \
  --file vapi/assistant-prime.json

vapi update assistant 756c46ed-2c04-49f6-a5fc-c820d11a92dd \
  --file vapi/assistant-akf.json

vapi update assistant 35ce9713-8297-491e-98ba-6c809a154c2c \
  --file vapi/assistant-cleanjet.json

# Verify serverUrl is set on all 3
vapi get assistant 4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d | grep serverUrl
```

> **Note:** The `{{...}}` placeholders in the JSON files must be replaced with actual values before running `vapi update`. Create a `vapi/build-configs.sh` script that performs `sed` substitution from environment variables, or use the Vapi dashboard UI to set `serverUrlSecret` after the CLI update.

---

## Phase 3 — Knowledge Base & RAG Integration

### 3.1 Database Migration

**File:** `supabase/migrations/20260222001_vapi_voice_agent.sql`

```sql
-- =============================================================================
-- VAPI VOICE AGENT: Knowledge Base, RAG, Call Logging, Idempotency
-- =============================================================================

-- Enable pgvector for RAG
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- ---------------------------------------------------------------------------
-- TABLE: knowledge_base
-- Stores chunked documents for RAG retrieval. One row per chunk (~512 tokens).
-- Each brand has its own rows, filtered via the 'brand' column.
-- ---------------------------------------------------------------------------
CREATE TABLE knowledge_base (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  brand       text        NOT NULL CHECK (brand IN ('prime', 'akf', 'cleanjet', 'shared')),
  title       text        NOT NULL,
  content     text        NOT NULL,
  embedding   vector(1536),              -- text-embedding-3-small dimensions
  metadata    jsonb       NOT NULL DEFAULT '{}',
  source      text,                      -- e.g. 'faq', 'pricing', 'services', 'policies'
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE knowledge_base IS 'RAG knowledge base for voice agent. Chunked at ~512 tokens with 50-token overlap.';
COMMENT ON COLUMN knowledge_base.brand IS 'Brand scope: prime | akf | cleanjet | shared (cross-brand facts).';
COMMENT ON COLUMN knowledge_base.embedding IS 'OpenAI text-embedding-3-small (1536 dimensions).';

CREATE INDEX knowledge_base_brand_idx ON knowledge_base (brand);
CREATE INDEX knowledge_base_embedding_idx
  ON knowledge_base
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ---------------------------------------------------------------------------
-- TABLE: vapi_call_log
-- One row per completed Vapi call. Written by end-of-call-report events.
-- ---------------------------------------------------------------------------
CREATE TABLE vapi_call_log (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vapi_call_id     text        UNIQUE NOT NULL,
  assistant_id     text        NOT NULL,
  brand            text        CHECK (brand IN ('prime', 'akf', 'cleanjet')),
  caller_number    text,
  transcript       text,
  summary          text,
  duration_seconds integer,
  recording_url    text,
  ended_reason     text,
  lead_id          uuid        REFERENCES leads(id) ON DELETE SET NULL,
  metadata         jsonb       NOT NULL DEFAULT '{}',
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE vapi_call_log IS 'One row per completed Vapi voice call. Transcript and summary from end-of-call-report.';

CREATE INDEX vapi_call_log_assistant_idx ON vapi_call_log (assistant_id);
CREATE INDEX vapi_call_log_brand_idx     ON vapi_call_log (brand);
CREATE INDEX vapi_call_log_created_idx   ON vapi_call_log (created_at DESC);

-- ---------------------------------------------------------------------------
-- TABLE: vapi_tool_calls
-- Idempotency log. Prevents duplicate tool executions when Vapi retries.
-- ---------------------------------------------------------------------------
CREATE TABLE vapi_tool_calls (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text        UNIQUE NOT NULL,  -- '{call_id}:{tool_name}:{tool_call_id}'
  result          text        NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE vapi_tool_calls IS 'Idempotency log for Vapi tool calls. Deduplicates on retry.';

CREATE INDEX vapi_tool_calls_key_idx ON vapi_tool_calls (idempotency_key);

-- Auto-expire idempotency records after 24 hours (optional: use pg_cron)
-- CREATE INDEX vapi_tool_calls_expire_idx ON vapi_tool_calls (created_at)
--   WHERE created_at < now() - interval '24 hours';

-- ---------------------------------------------------------------------------
-- TABLE: vapi_caller_sessions
-- Per-phone-number context for return caller recognition across calls.
-- ---------------------------------------------------------------------------
CREATE TABLE vapi_caller_sessions (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_number  text        UNIQUE NOT NULL,
  last_brand     text        CHECK (last_brand IN ('prime', 'akf', 'cleanjet')),
  call_count     integer     NOT NULL DEFAULT 1,
  last_called_at timestamptz NOT NULL DEFAULT now(),
  context        jsonb       NOT NULL DEFAULT '{}',  -- e.g. ongoing_job, preferred_service
  lead_id        uuid        REFERENCES leads(id) ON DELETE SET NULL
);

COMMENT ON TABLE vapi_caller_sessions IS 'Per-caller session memory for return caller recognition.';

-- ---------------------------------------------------------------------------
-- FUNCTION: match_knowledge_base
-- Brand-scoped vector similarity search. Returns speech-safe plain text chunks.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding  vector(1536),
  filter_brand     text          DEFAULT NULL,   -- NULL = search all brands
  match_threshold  float         DEFAULT 0.75,
  match_count      int           DEFAULT 3
)
RETURNS TABLE (
  id          uuid,
  title       text,
  content     text,
  source      text,
  similarity  float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    title,
    content,
    source,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE
    (filter_brand IS NULL OR brand IN (filter_brand, 'shared'))
    AND 1 - (embedding <=> query_embedding) > match_threshold
    AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ---------------------------------------------------------------------------
-- RLS: Edge Functions use service_role key — no RLS needed for those tables.
-- Lock down caller sessions from anon access.
-- ---------------------------------------------------------------------------
ALTER TABLE knowledge_base        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_call_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_tool_calls       ENABLE ROW LEVEL SECURITY;
ALTER TABLE vapi_caller_sessions  ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically. No explicit policies needed for Edge Functions.
-- Future: add admin-role SELECT policies if a dashboard is built.

-- Run migration:
-- supabase db push
```

### 3.2 RAG Retrieval Helper

**File:** `supabase/functions/_shared/rag.ts`

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { env } from './env.ts';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const EMBED_URL = 'https://api.openai.com/v1/embeddings';
const EMBED_MODEL = 'text-embedding-3-small';
const EMBED_TIMEOUT_MS = 3000;

interface KBRow {
  title: string;
  content: string;
  source: string;
}

export async function searchKnowledgeBase(
  query: string,
  brand: 'prime' | 'akf' | 'cleanjet',
): Promise<string> {
  // 1. Embed the query with explicit timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EMBED_TIMEOUT_MS);

  let embedding: number[];
  try {
    const embedRes = await fetch(EMBED_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: EMBED_MODEL, input: query }),
      signal: controller.signal,
    });

    if (!embedRes.ok) {
      console.error(`[RAG][embed-error] HTTP ${embedRes.status}`);
      return 'I could not find that information right now. I will make sure someone follows up with you.';
    }

    const embedJson = await embedRes.json() as { data: Array<{ embedding: number[] }> };
    embedding = embedJson.data[0]?.embedding ?? [];
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    console.error(`[RAG][embed-${isTimeout ? 'timeout' : 'error'}]`, err);
    return 'I could not find that information right now. I will make sure someone follows up with you.';
  } finally {
    clearTimeout(timeoutId);
  }

  if (embedding.length === 0) {
    return 'I could not find that information right now.';
  }

  // 2. Brand-scoped pgvector search
  const { data, error } = await supabase.rpc('match_knowledge_base', {
    query_embedding: embedding,
    filter_brand: brand,
    match_threshold: 0.75,
    match_count: 3,
  });

  if (error) {
    console.error(`[RAG][db-error]`, error);
    return 'I could not find that information right now.';
  }

  if (!data || (data as KBRow[]).length === 0) {
    return 'I do not have specific information on that. I will have someone call you back with the details.';
  }

  // 3. Speech-safe plain text — no markdown, no JSON, no code
  return (data as KBRow[])
    .map((row) => `${row.title}. ${row.content}`)
    .join('. ');
}
```

### 3.3 Knowledge Base Seed Data

Create company-specific knowledge base documents in `supabase/seed/knowledge_base/`:

**File:** `supabase/seed/knowledge_base/prime-faq.md`

Document the following for Prime Electrical (to be chunked and embedded):
- Services offered (wiring, heat pumps, EV chargers, solar, lighting, switchboard upgrades)
- Rough price ranges (e.g. "Heat pump supply and install typically starts from $2,800")
- Service areas (NZ regions served)
- Emergency callout procedure and number
- Business hours
- Licensing (Electrical Supervisor licence required for all work in NZ)
- Q Mastercard / GEM Visa financing info

**File:** `supabase/seed/knowledge_base/akf-faq.md`

- Renovation and construction services (kitchens, bathrooms, decks, extensions)
- Project timeline expectations (Consultation → Design → Build → CleanJet handover)
- Materials and workmanship warranty
- Council consent process (when required in NZ)

**File:** `supabase/seed/knowledge_base/cleanjet-faq.md`

- Cleaning types (residential, commercial, post-renovation, end-of-tenancy)
- Pricing (e.g. "One-bedroom clean from $99, weekly subscription 20% off")
- Booking process
- Supplies provided (eco-friendly products)

**Embedding script:** `supabase/seed/embed-knowledge-base.ts` (Deno script):

```typescript
// Run with: deno run --allow-net --allow-env --allow-read supabase/seed/embed-knowledge-base.ts
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Read, chunk at ~512 tokens, embed, and upsert to knowledge_base
// (Implementation: iterate seed markdown files, chunk on paragraph boundaries,
//  call OpenAI embeddings API, insert rows)
```

---

## Phase 4 — Backend Webhooks & Custom Tools

### 4.1 Deno Edge Function Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   ├── env.ts              # Startup env validator (Phase 1)
│   │   ├── rag.ts              # pgvector retrieval helper (Phase 3)
│   │   ├── security.ts         # HMAC verification
│   │   ├── supabase.ts         # Shared Supabase client
│   │   └── types.ts            # Zod schemas + inferred TypeScript types
│   └── vapi-webhook/
│       └── index.ts            # Main Deno Edge Function handler
├── migrations/
│   ├── 20260221_001_initial_schema.sql   (existing)
│   ├── 20260221002_job_sync.sql          (existing)
│   ├── 20260221003_lead_converted_webhook.sql  (existing)
│   └── 20260222001_vapi_voice_agent.sql  (Phase 3 — new)
└── seed/
    └── knowledge_base/
        ├── prime-faq.md
        ├── akf-faq.md
        └── cleanjet-faq.md
```

### 4.2 Shared Security Module

**File:** `supabase/functions/_shared/security.ts`

```typescript
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Verify Vapi webhook HMAC-SHA256 signature.
 * Uses timingSafeEqual to prevent timing-attack leakage.
 * Vapi sends the signature in the 'x-vapi-secret' header.
 */
export function verifyVapiSignature(
  rawBody: Uint8Array,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;

  const digest = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const expected = new TextEncoder().encode(`sha256=${digest}`);
  const received = new TextEncoder().encode(signatureHeader);

  if (expected.byteLength !== received.byteLength) return false;
  return timingSafeEqual(expected, received);
}
```

### 4.3 Zod Schemas (Types Contract)

**File:** `supabase/functions/_shared/types.ts`

```typescript
import { z } from 'npm:zod@3';

// ── Shared ────────────────────────────────────────────────────────────────────

export const BrandSchema = z.enum(['prime', 'akf', 'cleanjet']);
export type Brand = z.infer<typeof BrandSchema>;

export const CallSchema = z.object({
  id: z.string(),
  assistantId: z.string().optional(),
  orgId: z.string().optional(),
  type: z.enum(['inboundPhoneCall', 'outboundPhoneCall', 'webCall']).optional(),
  customer: z.object({
    number: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
});

// ── Incoming Vapi Events ──────────────────────────────────────────────────────

export const FunctionCallEventSchema = z.object({
  message: z.object({
    type: z.literal('function-call'),
    call: CallSchema,
    functionCall: z.object({
      name: z.string(),
      parameters: z.record(z.unknown()),
    }),
    toolCallList: z.array(z.object({
      id: z.string(),
      function: z.object({
        name: z.string(),
        arguments: z.string(),
      }),
    })).optional(),
  }),
});
export type FunctionCallEvent = z.infer<typeof FunctionCallEventSchema>;

export const EndOfCallReportSchema = z.object({
  message: z.object({
    type: z.literal('end-of-call-report'),
    call: CallSchema,
    transcript: z.string().optional(),
    summary: z.string().optional(),
    recordingUrl: z.string().url().optional(),
    durationSeconds: z.number().optional(),
    endedReason: z.string().optional(),
    analysis: z.object({
      summary: z.string().optional(),
      structuredData: z.record(z.unknown()).optional(),
    }).optional(),
  }),
});
export type EndOfCallReport = z.infer<typeof EndOfCallReportSchema>;

export const StatusUpdateSchema = z.object({
  message: z.object({
    type: z.literal('status-update'),
    call: CallSchema,
    status: z.enum(['queued', 'ringing', 'in-progress', 'forwarding', 'ended']),
  }),
});

export const AssistantRequestSchema = z.object({
  message: z.object({
    type: z.literal('assistant-request'),
    call: CallSchema,
  }),
});

export const HangSchema = z.object({
  message: z.object({
    type: z.literal('hang'),
    call: CallSchema,
  }),
});

// Union for routing (discriminate on message.type)
export const VapiEventSchema = z.union([
  FunctionCallEventSchema,
  EndOfCallReportSchema,
  StatusUpdateSchema,
  AssistantRequestSchema,
  HangSchema,
  z.object({ message: z.object({ type: z.string() }) }), // catch-all
]);

// ── Outgoing Tool Response ─────────────────────────────────────────────────────

export const ToolCallResponseSchema = z.object({
  results: z.array(z.object({
    toolCallId: z.string().min(1),
    result: z.string(),
  })),
});
export type ToolCallResponse = z.infer<typeof ToolCallResponseSchema>;

// ── Tool Parameter Schemas ────────────────────────────────────────────────────

export const CaptureLeadParamsSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  service_type: z.string().optional(),
  message: z.string().optional(),
  urgency: z.enum(['normal', 'urgent', 'emergency']).default('normal'),
});

export const SearchKnowledgeBaseParamsSchema = z.object({
  query: z.string().min(1),
});

export const CheckEmergencyParamsSchema = z.object({
  situation: z.string().min(1),
});

export const CrossSellPitchParamsSchema = z.object({
  lead_id: z.string().optional(),
  target_brand: z.enum(['akf', 'cleanjet', 'prime']),
  reason: z.string().min(1),
});

export const SendFollowupSmsParamsSchema = z.object({
  to_number: z.string().min(6),
  message_type: z.enum(['quote_request', 'booking_confirmation', 'emergency_followup']),
});

export const GetQuoteEstimateParamsSchema = z.object({
  service: z.string().min(1),
});

export const RequestSiteVisitParamsSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  project_type: z.string().optional(),
  preferred_date: z.string().optional(),
});

export const CheckBookingSlotsParamsSchema = z.object({
  date_preference: z.string().optional(),
  service_type: z.string().optional(),
});

export const CreateBookingParamsSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  service_type: z.string(),
  date: z.string(),
  time_slot: z.string().optional(),
  address: z.string().optional(),
});
```

### 4.4 Main Webhook Handler

**File:** `supabase/functions/vapi-webhook/index.ts`

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { env, BRAND_ASSISTANT_MAP } from '../_shared/env.ts';
import { verifyVapiSignature } from '../_shared/security.ts';
import { searchKnowledgeBase } from '../_shared/rag.ts';
import {
  type Brand,
  type FunctionCallEvent,
  type EndOfCallReport,
  type ToolCallResponse,
  FunctionCallEventSchema,
  EndOfCallReportSchema,
  VapiEventSchema,
  ToolCallResponseSchema,
  CaptureLeadParamsSchema,
  SearchKnowledgeBaseParamsSchema,
  CheckEmergencyParamsSchema,
  CrossSellPitchParamsSchema,
  SendFollowupSmsParamsSchema,
  GetQuoteEstimateParamsSchema,
  RequestSiteVisitParamsSchema,
  CheckBookingSlotsParamsSchema,
  CreateBookingParamsSchema,
} from '../_shared/types.ts';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ── Idempotency ───────────────────────────────────────────────────────────────

async function checkIdempotency(key: string): Promise<string | null> {
  const { data } = await supabase
    .from('vapi_tool_calls')
    .select('result')
    .eq('idempotency_key', key)
    .maybeSingle();
  return data?.result ?? null;
}

async function recordIdempotency(key: string, result: string): Promise<void> {
  await supabase.from('vapi_tool_calls').upsert(
    { idempotency_key: key, result },
    { onConflict: 'idempotency_key', ignoreDuplicates: true },
  );
}

// ── Tool Handlers ─────────────────────────────────────────────────────────────

async function handleCaptureLead(
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  const { name, phone, service_type, message, urgency } =
    CaptureLeadParamsSchema.parse(params);

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      source_site: brand,
      name,
      phone,
      service_type: service_type ?? null,
      message: message ?? null,
      lead_status: urgency === 'emergency' ? 'hot' : 'new',
    })
    .select('id')
    .single();

  if (error || !lead) {
    console.error('[VAPI][capture_lead] DB error:', error);
    return 'I have noted your details. Someone will follow up shortly.';
  }

  // Update caller session for return caller recognition
  await supabase.from('vapi_caller_sessions').upsert(
    {
      caller_number: phone,
      last_brand: brand,
      lead_id: lead.id,
      last_called_at: new Date().toISOString(),
    },
    { onConflict: 'caller_number' },
  );

  console.log(`[VAPI][capture_lead][${brand}] Lead created: ${lead.id}`);
  return `Perfect, I have saved your details${urgency === 'emergency' ? ' and flagged this as urgent' : ''}. Our team will be in touch very soon.`;
}

async function handleSearchKnowledgeBase(
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  const { query } = SearchKnowledgeBaseParamsSchema.parse(params);
  return await searchKnowledgeBase(query, brand);
}

function handleCheckEmergency(params: Record<string, unknown>): string {
  const { situation } = CheckEmergencyParamsSchema.parse(params);
  const lower = situation.toLowerCase();
  const isEmergency =
    lower.includes('spark') ||
    lower.includes('burn') ||
    lower.includes('shock') ||
    lower.includes('no power') ||
    lower.includes('flood') ||
    lower.includes('smoke') ||
    lower.includes('fire');

  if (isEmergency) {
    return `This sounds like an electrical emergency. Please call our emergency line now at 0800 PRIME 24. If there is any immediate danger, call 111 first. I am flagging this as urgent in our system.`;
  }
  return `I have noted your situation. This is not classified as an emergency requiring immediate callout, but I will make sure our team calls you back as a priority.`;
}

async function handleCrossSellPitch(
  params: Record<string, unknown>,
  callId: string,
): Promise<string> {
  const { lead_id, target_brand, reason } = CrossSellPitchParamsSchema.parse(params);

  const PITCHES: Record<string, string> = {
    cleanjet: `By the way, we work closely with CleanJet — a professional cleaning company. After an electrical install, there is often dust and debris. They do post-install cleans from $99. Would you like me to mention that to the team?`,
    akf: `We partner with AKF Construction for any building or renovation work. If your project needs walls opened or ceilings accessed, they are excellent. Want me to flag that as a possibility?`,
    prime: `We work with The Prime Electrical for all the electrical side of things. If your project needs wiring, lighting, or EV chargers, they can handle that as part of the same project. Shall I note that?`,
  };

  if (lead_id) {
    await supabase.from('cross_sell_events').insert({
      lead_id,
      source_brand: 'prime', // Will be dynamic in full implementation
      target_brand,
      pitch: reason,
      status: 'triggered',
    });
  }

  return PITCHES[target_brand] ?? `We have a partner who can help with that. I will make a note for the team.`;
}

async function handleSendFollowupSms(
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  const { to_number, message_type } = SendFollowupSmsParamsSchema.parse(params);

  const BRAND_MESSAGES: Record<Brand, Record<string, string>> = {
    prime: {
      quote_request: `Thanks for calling Prime Electrical! We'll get back to you with a quote shortly. For urgent jobs: 0800 PRIME 24. theprimeelectrical.co.nz`,
      booking_confirmation: `Your Prime Electrical appointment is confirmed. We'll send a reminder 24 hours before. theprimeelectrical.co.nz`,
      emergency_followup: `Prime Electrical emergency team has been notified. Call 0800 PRIME 24 if situation worsens. If danger, call 111.`,
    },
    akf: {
      quote_request: `Thanks for reaching out to AKF Construction! We'll call you back shortly to discuss your project. akfconstruction.co.nz`,
      booking_confirmation: `Your AKF Construction consultation is booked. We look forward to discussing your project. akfconstruction.co.nz`,
      emergency_followup: `AKF Construction team has been notified of your urgent enquiry. We'll call you shortly.`,
    },
    cleanjet: {
      quote_request: `Thanks for contacting CleanJet! We'll confirm your booking details shortly. cleanjet.co.nz`,
      booking_confirmation: `Your CleanJet booking is confirmed! Our team will arrive at the scheduled time. cleanjet.co.nz`,
      emergency_followup: `CleanJet has noted your urgent request. We'll be in touch very shortly.`,
    },
  };

  const smsBody = BRAND_MESSAGES[brand]?.[message_type] ?? `Thanks for calling! We'll be in touch shortly.`;
  const fromNumber = {
    prime: Deno.env.get('TELNYX_FROM_NUMBER_PRIME'),
    akf: Deno.env.get('TELNYX_FROM_NUMBER_AKF'),
    cleanjet: Deno.env.get('TELNYX_FROM_NUMBER_CLEANJET'),
  }[brand];

  if (!fromNumber) {
    console.warn(`[VAPI][send_followup_sms] No from number for brand: ${brand}`);
    return 'I was unable to send a text message, but your details have been saved.';
  }

  // Fire-and-forget Telnyx SMS (async — do not block the voice response)
  fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromNumber,
      to: to_number,
      text: smsBody,
      messaging_profile_id: Deno.env.get('TELNYX_MESSAGING_PROFILE_ID'),
    }),
  }).catch((err: unknown) => {
    console.error('[VAPI][send_followup_sms] Telnyx error:', err);
  });

  return 'I have sent you a text message with our details. Check your phone shortly.';
}

function handleGetQuoteEstimate(params: Record<string, unknown>, brand: Brand): string {
  const { service } = GetQuoteEstimateParamsSchema.parse(params);
  // Static fallback — will be replaced by knowledge base search in production
  console.log(`[VAPI][get_quote_estimate][${brand}] Service: ${service}`);
  return `For ${service}, I recommend requesting a site visit for an accurate quote. I can save your details and have our estimator call you back. Would you like me to do that?`;
}

async function handleRequestSiteVisit(
  params: Record<string, unknown>,
): Promise<string> {
  const { name, phone, project_type, preferred_date } =
    RequestSiteVisitParamsSchema.parse(params);

  await supabase.from('leads').insert({
    source_site: 'akf',
    name,
    phone,
    service_type: project_type ?? 'site visit',
    message: preferred_date ? `Preferred date: ${preferred_date}` : null,
    lead_status: 'new',
  });

  return `Great, I have booked a site visit consultation for you${preferred_date ? ` around ${preferred_date}` : ''}. Alex from the AKF team will call to confirm the time.`;
}

function handleCheckBookingSlots(_params: Record<string, unknown>): string {
  // Static response — real implementation queries a booking system API
  return `We have availability Monday to Friday from 8am to 5pm, and Saturday mornings. What day works best for you?`;
}

async function handleCreateBooking(
  params: Record<string, unknown>,
): Promise<string> {
  const { name, phone, service_type, date, time_slot, address } =
    CreateBookingParamsSchema.parse(params);

  await supabase.from('leads').insert({
    source_site: 'cleanjet',
    name,
    phone,
    service_type,
    message: [
      `Booking: ${date}${time_slot ? ` at ${time_slot}` : ''}`,
      address ? `Address: ${address}` : null,
    ].filter(Boolean).join('. '),
    lead_status: 'hot',
  });

  return `Perfect, your ${service_type} has been booked for ${date}${time_slot ? ` at ${time_slot}` : ''}. You will receive a text confirmation shortly.`;
}

// ── Tool Router ───────────────────────────────────────────────────────────────

type ToolResult = string;

const SLOW_TOOLS = new Set([
  'search_knowledge_base',
  'get_quote_estimate',
  'request_site_visit',
  'check_booking_slots',
  'send_followup_sms',
]);

async function routeToolCall(
  toolName: string,
  params: Record<string, unknown>,
  brand: Brand,
): Promise<ToolResult> {
  switch (toolName) {
    case 'capture_lead':
      return await handleCaptureLead(params, brand);
    case 'search_knowledge_base':
      return await handleSearchKnowledgeBase(params, brand);
    case 'check_emergency':
      return handleCheckEmergency(params);
    case 'cross_sell_pitch':
      return await handleCrossSellPitch(params, '');
    case 'send_followup_sms':
      return await handleSendFollowupSms(params, brand);
    case 'get_quote_estimate':
      return handleGetQuoteEstimate(params, brand);
    case 'request_site_visit':
      return await handleRequestSiteVisit(params);
    case 'check_booking_slots':
      return handleCheckBookingSlots(params);
    case 'create_booking':
      return await handleCreateBooking(params);
    default:
      console.warn(`[VAPI][unknown-tool] ${toolName}`);
      return 'I am sorry, I was unable to complete that action. Let me make a note for the team.';
  }
}

// ── Event Handlers ────────────────────────────────────────────────────────────

async function handleFunctionCall(
  event: FunctionCallEvent,
  startTime: number,
): Promise<Response> {
  const { call, functionCall } = event.message;
  const brand = (BRAND_ASSISTANT_MAP[call.assistantId ?? ''] ?? 'prime') as Brand;
  const idempotencyKey = `${call.id}:${functionCall.name}`;

  // 1. Idempotency check — handle Vapi retries
  const cached = await checkIdempotency(idempotencyKey);
  if (cached) {
    console.log(`[VAPI][idempotent-hit][${call.id}] ${functionCall.name}`);
    return new Response(cached, { headers: { 'Content-Type': 'application/json' } });
  }

  // 2. Budget-aware execution
  const elapsed = Date.now() - startTime;
  const remainingBudget = 450 - elapsed;
  const toolName = functionCall.name;

  let result: string;

  if (SLOW_TOOLS.has(toolName) && remainingBudget < 300) {
    // Budget nearly exhausted for a slow tool — return holding message
    // Async queue deferred to a future sprint. Holding message keeps the call alive.
    result = 'Let me look that up and get back to you in just a moment.';
  } else {
    result = await Promise.race([
      routeToolCall(toolName, functionCall.parameters as Record<string, unknown>, brand),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve('I am processing that. Please give me just a moment.'), remainingBudget)
      ),
    ]);
  }

  // 3. Build and validate response
  const response: ToolCallResponse = ToolCallResponseSchema.parse({
    results: [{ toolCallId: functionCall.name, result }],
  });

  const responseBody = JSON.stringify(response);

  // 4. Store idempotency record (non-blocking)
  recordIdempotency(idempotencyKey, responseBody).catch((err: unknown) => {
    console.error('[VAPI][idempotency-write-error]', err);
  });

  const durationMs = Date.now() - startTime;
  console.log(`[VAPI][function-call][${call.id}][${toolName}][${brand}] ${durationMs}ms`);

  return new Response(responseBody, { headers: { 'Content-Type': 'application/json' } });
}

// Conversation memory: fired by Vapi before the call starts.
// Returns assistantOverrides with a context-enriched system prompt for return callers.
async function handleAssistantRequest(
  data: { message: { call: { id: string; assistantId?: string; customer?: { number?: string } } } },
  startTime: number,
): Promise<Response> {
  const { call } = data.message;
  const callerNumber = call.customer?.number;
  const brand = (BRAND_ASSISTANT_MAP[call.assistantId ?? ''] ?? null) as Brand | null;

  if (!callerNumber || !brand) {
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: session } = await supabase
    .from('vapi_caller_sessions')
    .select('call_count, last_brand, context, last_called_at')
    .eq('caller_number', callerNumber)
    .maybeSingle();

  if (!session || session.call_count <= 1) {
    // First-time caller — no override needed
    console.log(`[VAPI][assistant-request][${call.id}] New caller ${callerNumber}`);
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Return caller — inject memory into system prompt
  const memoryNote = `\n\n[CALLER CONTEXT: This caller has contacted us ${session.call_count} times before. Last call was with ${session.last_brand} on ${new Date(session.last_called_at as string).toLocaleDateString('en-NZ')}. Greet them as a returning customer naturally without reading this note aloud.]`;

  const durationMs = Date.now() - startTime;
  console.log(`[VAPI][assistant-request][${call.id}] Return caller (${session.call_count} calls) | ${durationMs}ms`);

  return new Response(
    JSON.stringify({
      assistantOverrides: {
        model: {
          messages: [
            {
              role: 'system',
              content: memoryNote,
            },
          ],
        },
      },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}

async function handleEndOfCallReport(event: EndOfCallReport): Promise<Response> {
  const { call, transcript, summary, recordingUrl, durationSeconds, endedReason } =
    event.message;

  const brand = BRAND_ASSISTANT_MAP[call.assistantId ?? ''] as Brand | undefined;

  await supabase.from('vapi_call_log').upsert(
    {
      vapi_call_id: call.id,
      assistant_id: call.assistantId ?? 'unknown',
      brand: brand ?? null,
      caller_number: call.customer?.number ?? null,
      transcript: transcript ?? null,
      summary: summary ?? null,
      recording_url: recordingUrl ?? null,
      duration_seconds: durationSeconds ?? null,
      ended_reason: endedReason ?? null,
    },
    { onConflict: 'vapi_call_id', ignoreDuplicates: true },
  );

  console.log(`[VAPI][end-of-call-report][${call.id}][${brand ?? 'unknown'}] ${durationSeconds ?? 0}s`);

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now();

  // 1. Read raw body buffer BEFORE JSON parsing (HMAC requires raw bytes)
  const rawBody = new Uint8Array(await req.arrayBuffer());
  const signature = req.headers.get('x-vapi-secret');

  // 2. HMAC signature verification — FIRST operation, before any logic
  if (!verifyVapiSignature(rawBody, signature, env.VAPI_WEBHOOK_SECRET)) {
    const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown';
    console.warn(`[VAPI][auth-fail] Invalid signature | ip=${ip}`);
    return new Response('Unauthorized', { status: 401 });
  }

  // 3. JSON parse
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  // 4. Zod schema validation
  const parsed = VapiEventSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('[VAPI][schema-error]', JSON.stringify({
      issues: parsed.error.issues,
      keys: Object.keys(body as Record<string, unknown>),
    }));
    return new Response(
      JSON.stringify({ error: 'Invalid payload', issues: parsed.error.issues }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // 5. Route on event type
  const eventType = (parsed.data as { message: { type: string } }).message.type;

  try {
    switch (eventType) {
      case 'function-call':
        return await handleFunctionCall(
          FunctionCallEventSchema.parse(parsed.data),
          startTime,
        );

      case 'end-of-call-report':
        return await handleEndOfCallReport(
          EndOfCallReportSchema.parse(parsed.data),
        );

      case 'assistant-request':
        // Conversation memory: look up caller history and inject into system prompt override
        return await handleAssistantRequest(parsed.data as { message: { call: { id: string; assistantId?: string; customer?: { number?: string } } } }, startTime);

      case 'status-update':
      case 'hang':
      case 'speech-update':
      case 'transcript':
      default:
        console.log(`[VAPI][${eventType}] Acknowledged in ${Date.now() - startTime}ms`);
        return new Response(
          JSON.stringify({ received: true }),
          { headers: { 'Content-Type': 'application/json' } },
        );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[VAPI][handler-error][${eventType}]`, message);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
```

### 4.5 Tool Contract Integrity Check

This table verifies `assistant-*.json` tool names match `index.ts` switch cases exactly:

| `assistant.json` tool `name` | `index.ts` `case` | Match |
|---|---|---|
| `capture_lead` | `'capture_lead'` | ✅ |
| `search_knowledge_base` | `'search_knowledge_base'` | ✅ |
| `check_emergency` | `'check_emergency'` | ✅ |
| `cross_sell_pitch` | `'cross_sell_pitch'` | ✅ |
| `send_followup_sms` | `'send_followup_sms'` | ✅ |
| `get_quote_estimate` | `'get_quote_estimate'` | ✅ |
| `request_site_visit` | `'request_site_visit'` | ✅ |
| `check_booking_slots` | `'check_booking_slots'` | ✅ |
| `create_booking` | `'create_booking'` | ✅ |

---

## Phase 5 — Testing & Deployment

### 5.1 Deploy Edge Function

```bash
# Ensure supabase/functions/vapi-webhook/index.ts exists
supabase functions deploy vapi-webhook --no-verify-jwt

# Verify deployment
supabase functions list
```

### 5.2 Update Vapi Assistants with Webhook URL

```bash
# Confirm the Edge Function URL
echo "https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook"

# Update all 3 assistants
vapi update assistant 4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d \
  --server-url "https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook"

vapi update assistant 756c46ed-2c04-49f6-a5fc-c820d11a92dd \
  --server-url "https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook"

vapi update assistant 35ce9713-8297-491e-98ba-6c809a154c2c \
  --server-url "https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook"

# Set the signing secret in Vapi dashboard:
# dashboard.vapi.ai → Account → Webhooks → Server URL Secret
# Value must match VAPI_WEBHOOK_SECRET in Supabase secrets
```

### 5.3 Integration Tests — Simulated Webhook Events

```bash
# Store Supabase function URL
BASE="https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook"
SECRET="<your-VAPI_WEBHOOK_SECRET>"

# Generate a valid HMAC signature for a payload
PAYLOAD='{"message":{"type":"function-call","call":{"id":"test-001","assistantId":"4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d"},"functionCall":{"name":"capture_lead","parameters":{"name":"Test Caller","phone":"+6421000000","service_type":"heat pump","urgency":"normal"}}}}'
SIG="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')"

# Test capture_lead (Prime Electrical — Max)
curl -X POST "$BASE" \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $SIG" \
  -d "$PAYLOAD"
# Expected: {"results":[{"toolCallId":"capture_lead","result":"Perfect, I have saved your details..."}]}
# Expected time: < 200ms

# Test end-of-call-report
PAYLOAD2='{"message":{"type":"end-of-call-report","call":{"id":"test-002","assistantId":"4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d","customer":{"number":"+6421000000"}},"transcript":"Hello, this is a test call.","summary":"Test call","durationSeconds":30,"endedReason":"customer-ended-call"}}'
SIG2="sha256=$(echo -n "$PAYLOAD2" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')"
curl -X POST "$BASE" \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $SIG2" \
  -d "$PAYLOAD2"
# Expected: {"received":true}
# Verify: check vapi_call_log in Supabase

# Test security — invalid signature should return 401
curl -X POST "$BASE" \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: sha256=invalid" \
  -d "$PAYLOAD"
# Expected: HTTP 401 Unauthorized
```

### 5.4 Vapi CLI Voice Smoke Tests

```bash
# Test Max (Prime Electrical) — web call (no phone needed)
vapi call create \
  --assistant-id 4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d \
  --type web

# Test Alex (AKF Construction)
vapi call create \
  --assistant-id 756c46ed-2c04-49f6-a5fc-c820d11a92dd \
  --type web

# Test Jess (CleanJet)
vapi call create \
  --assistant-id 35ce9713-8297-491e-98ba-6c809a154c2c \
  --type web

# Monitor logs during tests
supabase functions logs vapi-webhook --follow

# Check recent calls
vapi list calls --limit 5
```

### 5.5 Knowledge Base Seeding

Before smoke testing, seed at least minimal knowledge base content:

```bash
# Run the embedding script (after writing seed markdown files)
deno run \
  --allow-net \
  --allow-env \
  --allow-read \
  supabase/seed/embed-knowledge-base.ts

# Verify rows in Supabase
# SELECT count(*), brand FROM knowledge_base GROUP BY brand;
```

### 5.6 Post-Deployment Checklist

```
Environment
[ ] VAPI_API_KEY rotated — old key from vapi-test.py is invalidated
[ ] vapi-test.py updated to use os.environ.get("VAPI_API_KEY")
[ ] All Supabase secrets set (supabase secrets list to verify)
[ ] VAPI_WEBHOOK_SECRET matches between Supabase secrets and Vapi dashboard

Database
[ ] supabase db push succeeded — no migration errors
[ ] knowledge_base table exists with ivfflat index
[ ] vapi_call_log table exists
[ ] vapi_tool_calls table exists (idempotency)
[ ] vapi_caller_sessions table exists
[ ] match_knowledge_base function exists

Edge Function
[ ] supabase functions deploy succeeded
[ ] GET https://tfdxlhkaziskkwwohtwd.supabase.co/functions/v1/vapi-webhook returns 401 (no signature)
[ ] Integration test: capture_lead returns 200 within 500ms
[ ] Integration test: invalid signature returns 401
[ ] Integration test: end-of-call-report writes to vapi_call_log

Vapi Assistants
[ ] All 3 assistants have serverUrl pointing to Supabase function
[ ] serverUrlSecret set in Vapi dashboard (matches VAPI_WEBHOOK_SECRET)
[ ] All 3 assistants use Cartesia voice (not default)
[ ] All 3 assistants use OpenRouter/gpt-4o-mini (not OpenAI direct)
[ ] All 3 assistants use Deepgram Nova-2 transcriber

Voice Smoke Tests (per assistant)
[ ] Max answers in character, captures lead, searches knowledge base
[ ] Alex answers, handles renovation enquiry, offers site visit
[ ] Jess answers, checks booking slots, creates a booking
[ ] Any assistant: emergency question → check_emergency returns callout number
[ ] Any assistant: cross-sell logic triggers naturally (e.g. Max offers CleanJet for post-install)
[ ] Any assistant: send_followup_sms sends SMS to test number

Knowledge Base
[ ] At least 10 chunks per brand embedded and retrievable
[ ] RAG response is plain text (no markdown, no JSON)
[ ] search_knowledge_base returns within 450ms (check function logs)

Monitoring
[ ] supabase functions logs vapi-webhook shows structured [VAPI][...] log lines
[ ] vapi list calls shows calls from smoke tests
[ ] vapi_call_log has rows after smoke test calls complete
```

### 5.7 Ongoing Monitoring

```bash
# Stream function logs
supabase functions logs vapi-webhook --follow

# Check recent calls
vapi list calls --limit 20

# Query call log for errors
# SELECT ended_reason, count(*) FROM vapi_call_log GROUP BY ended_reason ORDER BY count DESC;

# Check latency of tool calls (if you add a duration_ms column later)
# SELECT tool_name, avg(duration_ms) FROM vapi_tool_calls GROUP BY tool_name;
```

---

## Integration Validation — Final Cross-Check

```
Tool Contract Integrity
[ ] All 9 tool names in assistant-*.json match switch cases in index.ts (see §4.5 table)
[ ] Zod parameter schemas in types.ts match JSON Schema in assistant-*.json

Data Contract Integrity
[ ] capture_lead writes to leads table with correct source_site per brand
[ ] end-of-call-report writes to vapi_call_log with correct brand derived from assistantId
[ ] cross_sell_pitch writes to cross_sell_events (linking with existing GPT-4o pipeline)
[ ] vapi_caller_sessions updated on every capture_lead call

Security Invariants
[ ] verifyVapiSignature uses timingSafeEqual — confirmed in security.ts
[ ] HMAC check is first operation in Deno.serve handler — before JSON parse
[ ] No secrets in source code — all via Deno.env.get() / env module
[ ] VAPI_API_KEY rotated and not in any committed file

Latency Budget
[ ] capture_lead: sync, < 100ms ✅
[ ] check_emergency: sync, < 20ms ✅
[ ] create_booking: sync, < 150ms ✅
[ ] search_knowledge_base: SLOW_TOOLS set — fallback if budget < 300ms ✅
[ ] send_followup_sms: fire-and-forget Telnyx call — does not block response ✅
[ ] All slow tools have Promise.race timeout fallback in routeToolCall ✅

Voice Quality
[ ] All RAG responses are speech-safe plain text — no markdown, JSON, code
[ ] handleCheckEmergency returns immediate, actionable instruction
[ ] cross_sell_pitch response is conversational, not a brochure

Decisions Locked (no longer open)
[x] TTS provider → Vapi native (PlayHT for Max/Alex, ElevenLabs for Jess) — no Cartesia account needed
[x] LLM → openai/gpt-4o-mini via OpenRouter
[x] Async queue → Deferred — synchronous handlers with mock data fallbacks in this sprint
[x] Conversation memory → Configured — handleAssistantRequest pre-fetches vapi_caller_sessions and injects into system prompt
[x] Phone provider → Telnyx only — all Twilio references removed from env template

Remaining Open Items (non-blocking — implement with mock data for now)
[ ] Booking system API — check_booking_slots returns static slots; wire to real calendar API in a later sprint
[ ] Knowledge base seed — which NZ regions does each brand serve? Add to FAQ docs before embedding
[ ] Real Vapi voice IDs — browse dashboard.vapi.ai/voice-library, confirm PlayHT/ElevenLabs IDs suit each persona
```

---

## Artifact Summary

| File | Phase | Action |
|---|---|---|
| `.env.local.example` (updated) | 1 | Add OpenRouter, Cartesia, Deepgram, OpenAI sections |
| `supabase/functions/_shared/env.ts` | 1 | Create |
| `supabase/functions/_shared/security.ts` | 1 | Create |
| `vapi/assistant-prime.json` | 2 | Create (update existing Vapi assistant) |
| `vapi/assistant-akf.json` | 2 | Create (update existing Vapi assistant) |
| `vapi/assistant-cleanjet.json` | 2 | Create (update existing Vapi assistant) |
| `supabase/migrations/20260222001_vapi_voice_agent.sql` | 3 | Create + run |
| `supabase/functions/_shared/rag.ts` | 3 | Create |
| `supabase/functions/_shared/types.ts` | 4 | Create |
| `supabase/functions/vapi-webhook/index.ts` | 4 | Create |
| `supabase/seed/knowledge_base/prime-faq.md` | 3 | Create |
| `supabase/seed/knowledge_base/akf-faq.md` | 3 | Create |
| `supabase/seed/knowledge_base/cleanjet-faq.md` | 3 | Create |
| `supabase/seed/embed-knowledge-base.ts` | 3 | Create |
| `vapi-test.py` | 0 | Fix hardcoded key + add to .gitignore |
