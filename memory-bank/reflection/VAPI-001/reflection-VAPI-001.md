# Reflection — VAPI-001: Voice Agent Backend Infrastructure

**Date:** 2026-02-22  
**Task:** Full Vapi.ai voice agent backend deployment for Prime Group (3 NZ trade companies)  
**Complexity:** Level 4 (multi-phase system build)  
**Status:** ✅ Deployed & Reflected — Pending Voice Smoke Test

---

## Summary

VAPI-001 delivered a complete Vapi.ai voice agent backend from code generation through live production deployment in a single session. The stack includes three assistants (Max, Alex, Jess) for Prime Electrical, AKF Construction, and CleanJet; ElevenLabs TTS (Luke — Deep Kiwi Narrator) for Max; Deepgram Nova-2 STT; OpenRouter for both LLM (gpt-4o-mini) and embeddings (text-embedding-3-small); a Supabase Deno Edge Function webhook; PostgreSQL with pgvector RAG, call logging, idempotency, and conversation memory; and a Telnyx NZ number for Prime Electrical SMS. Nine bugs were found and fixed during deployment, including HMAC verification logic, env var handling, RAG/embedding configuration, and tooling workarounds. All automated smoke tests passed; remaining work is a voice smoke test and linking the Telnyx number to Vapi for inbound calls.

---

## What Went Well

1. **End-to-end deployment in one session** — Code generation → migration → secrets → function deploy → assistant updates → KB seeding all completed without handoff.

2. **Supabase MCP** — `apply_migration` and `deploy_edge_function` worked reliably; no CLI version mismatches or auth issues.

3. **OpenRouter as single API** — Discovered OpenRouter supports `text-embedding-3-small` (1536 dims), eliminating the need for a separate OpenAI API key for embeddings.

4. **Fast-acknowledge pattern** — `capture_lead` writes to DB and returns quickly; no blocking on downstream systems.

5. **Zod schemas** — All Vapi event types validated in `types.ts`; invalid payloads rejected early.

6. **Idempotency** — Every `function-call` event checked against `vapi_call_log` before processing; safe for retries.

7. **KB seeding** — 13/13 chunks embedded for Prime Electrical; UNIQUE on `(brand, title)` prevents duplicate chunks.

8. **Vapi REST API workaround** — When `vapi assistant update --file` panicked with nil pointer dereference, PATCH `/assistant/:id` via REST worked.

---

## Challenges Encountered

| Challenge | Resolution |
|-----------|------------|
| Vapi HMAC verification failing | Vapi sends the Server URL Secret as a plain value in `x-vapi-secret`, not an HMAC digest. Replaced HMAC implementation with direct `timingSafeEqual` comparison. |
| Edge function crash on startup | `OPENAI_API_KEY` and `OPENROUTER_API_KEY` were in `REQUIRED_VARS` but not available. Made them optional exports and removed from required vars. |
| RAG still referencing removed env | `rag.ts` imported `env.OPENAI_API_KEY` after it was removed. Fixed by importing `OPENAI_API_KEY` as standalone export (or switching fully to OpenRouter). |
| Embedding upsert failing | `onConflict: 'title'` used but no UNIQUE on title. Added UNIQUE on `(brand, title)` and updated `onConflict` to `'brand,title'`. |
| Hardcoded OpenAI endpoint in embed script | Added `EMBED_URL` env logic to support OpenRouter for embeddings. |
| Vapi CLI nil pointer panic | Used Vapi REST API directly (PATCH `/assistant/:id`) instead of CLI. |
| Deno not in Windows PATH | Used full path `C:\Users\Jackc\.deno\bin\deno.exe` via PowerShell. |
| Duplicate `OPENROUTER_API_KEY` in `.env.local` | Removed duplicate at line 103. |

---

## Key Bugs Found & Fixed

1. **`security.ts` — Wrong HMAC implementation**  
   - **Root cause:** Assumed Vapi sends an HMAC digest of the request body. Vapi actually sends the Server URL Secret as a plain value in `x-vapi-secret`.  
   - **Fix:** Replaced HMAC computation with direct `timingSafeEqual(secret, headerValue)`.

2. **`env.ts` — Required vars causing crash**  
   - **Root cause:** `OPENAI_API_KEY` and `OPENROUTER_API_KEY` in `REQUIRED_VARS` but not set; function crashed on startup.  
   - **Fix:** Made both optional exports; removed from required vars list.

3. **`rag.ts` — Stale env reference**  
   - **Root cause:** Still referenced `env.OPENAI_API_KEY` after it was removed from env object.  
   - **Fix:** Import `OPENAI_API_KEY` as standalone export or use OpenRouter exclusively.

4. **`embed-knowledge-base.ts` — Invalid onConflict**  
   - **Root cause:** `onConflict: 'title'` but no UNIQUE constraint on `title` alone.  
   - **Fix:** Added `UNIQUE(brand, title)` to migration; updated `onConflict` to `'brand,title'`.

5. **`embed-knowledge-base.ts` — Hardcoded OpenAI endpoint**  
   - **Root cause:** Script assumed OpenAI API for embeddings.  
   - **Fix:** Added `EMBED_URL` env logic to support OpenRouter embedding endpoint.

6. **OpenRouter for embeddings**  
   - **Discovery:** OpenRouter supports `text-embedding-3-small` (1536 dims). No separate OpenAI key needed.  
   - **Fix:** Switched embedding script to use OpenRouter; removed OpenAI dependency for embeddings.

7. **Vapi CLI nil pointer dereference**  
   - **Root cause:** `vapi assistant update --file` panics (CLI bug).  
   - **Fix:** Used Vapi REST API (PATCH `/assistant/:id`) directly.

8. **Deno not in PATH (Windows)**  
   - **Root cause:** Deno installed at `C:\Users\Jackc\.deno\bin\deno.exe` but not in PATH.  
   - **Fix:** Invoked via full path in PowerShell.

9. **Duplicate `OPENROUTER_API_KEY` in `.env.local`**  
   - **Root cause:** Key appeared at line 61 and 103.  
   - **Fix:** Removed duplicate.

---

## Lessons Learned

- **L1:** Vapi Server URL Secret is sent as plain text in `x-vapi-secret`, not HMAC. Always verify against Vapi docs before implementing auth.
- **L2:** Optional env vars for third-party APIs reduce startup fragility when keys are not yet configured.
- **L3:** OpenRouter can replace both LLM and embedding calls; one API key simplifies deployment.
- **L4:** UNIQUE constraints must match `onConflict` targets exactly; otherwise upserts fail silently or with cryptic errors.
- **L5:** Vapi CLI has edge-case bugs; REST API is more reliable for assistant updates.
- **L6:** Windows PATH issues with Deno — use full path or add to PATH for scripts.

---

## Process Improvements

1. **Verify auth mechanism before coding** — Read Vapi webhook auth docs first; avoid implementing HMAC when plain secret comparison is expected.
2. **Make third-party API keys optional at startup** — Fail only when the key is actually needed (e.g. on first RAG call), not on function load.
3. **Use REST API for Vapi assistant updates** — Skip CLI when `vapi assistant update --file` is unreliable.
4. **Add migration for UNIQUE before embed script** — Ensure `onConflict` targets exist before running upserts.
5. **Document Deno path for Windows** — Add to README or use `deno run` via npx/script that resolves path.

---

## Technical Improvements

- **Single OpenRouter integration** — Use OpenRouter for both LLM and embeddings; remove `OPENAI_API_KEY` from required vars entirely.
- **RAG fallback** — Consider graceful degradation when embeddings/RAG fail (e.g. return empty or cached response).
- **Idempotency key** — Already implemented; ensure all tool handlers that write to DB use it.
- **Conversation memory** — Pre-fetch on `assistant-request` for return callers; verify in voice smoke test.

---

## Cost Notes

- **Per-call estimate:** Dominated by ElevenLabs TTS (Luke — Deep Kiwi Narrator). Deepgram STT and OpenRouter gpt-4o-mini are relatively cheap.
- **Main cost driver:** ElevenLabs TTS. Consider PlayHT for non-Max assistants if cost becomes an issue.
- **Embeddings:** One-time cost for KB seed; OpenRouter text-embedding-3-small is low cost.

---

## Next Steps

1. ~~**Voice smoke test** — Make actual test call to Max via Vapi dashboard; verify end-to-end flow.~~ ✅ **Done**
2. ~~**Link Telnyx number** — Connect +6498734191 to Vapi as inbound phone number for Prime Electrical.~~ ✅ **Done**
3. **Embed AKF/CleanJet KB** — Run `embed-knowledge-base.ts` for AKF and CleanJet when their FAQ content is ready.
4. **Rotate VAPI_API_KEY** — If key was exposed in git history, rotate in Vapi dashboard and update secrets.

---

## Technical Artifacts Changed

| File | Change |
|------|--------|
| `supabase/functions/vapi-webhook/index.ts` | Main webhook handler |
| `supabase/functions/_shared/env.ts` | Optional API keys; required vars validator |
| `supabase/functions/_shared/security.ts` | Plain secret comparison (not HMAC) |
| `supabase/functions/_shared/types.ts` | Zod schemas for all events |
| `supabase/functions/_shared/rag.ts` | OpenRouter-backed pgvector RAG |
| `supabase/seed/embed-knowledge-base.ts` | Deno embedding script; OpenRouter support |
| `supabase/seed/knowledge_base/prime-faq.md` | 13 chunks seeded |
| `vapi/assistant-prime.json`, `vapi/assistant-akf.json`, `vapi/assistant-cleanjet.json` | Assistant configs |
| `supabase/migrations/20260222001_vapi_voice_agent.sql` | Vapi tables + UNIQUE on knowledge_base |
| `prime-electrical/.env.local` | All real keys; duplicate OPENROUTER_API_KEY removed |

---

*Deployment duration: single session | Bugs fixed: 9 | Smoke tests: Auth 200/401, check_emergency, capture_lead, KB 13/13*
