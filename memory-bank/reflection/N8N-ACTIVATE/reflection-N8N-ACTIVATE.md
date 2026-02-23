# Reflection: N8N-ACTIVATE — n8n Lead Enrichment Pipeline

**Task ID:** N8N-ACTIVATE  
**Complexity:** Level 2  
**Date Completed:** 2026-02-23  
**Status:** ✅ Complete — end-to-end verified

---

## Summary

The n8n lead enrichment pipeline was activated end-to-end: form/voice submissions now trigger GPT-4o analysis via OpenRouter, and `ai_notes` are written back to the `leads` table in Supabase. The task evolved beyond simple JSON import — we configured the live workflow directly via MCP tools, bypassed n8n's broken Credentials system, and solved critical HTTP body serialization issues. Final verification: `{"ok":true}` returned with `ai_notes` confirmed in the database for a real lead ID.

---

## What Went Well

- **MCP-driven configuration** — Configured the live n8n workflow (`wAyQCY6uKnKAnL2J`) directly via MCP tools instead of manual JSON import; faster iteration and no import/export friction.
- **Iterative debugging** — Systematic diagnosis of each failure (body serialization, credentials, ENRICH_SECRET mismatch) led to targeted fixes.
- **Vercel env pull** — `vercel env pull .env.production.local --environment=production` retrieved the actual `ENRICH_SECRET` value when Supabase and Vercel had mismatched values; critical for debugging the 401 on `/api/leads/enrich`.
- **Code node as pre-processor** — Building the OpenRouter request body in a Code node with full JavaScript avoided all expression limitations in the HTTP Request node.
- **OpenRouter switch** — User request to use OpenRouter instead of OpenAI was straightforward; only the HTTP Request URL and body format changed.

---

## Challenges Encountered

1. **n8n HTTP Request body serialization** — `specifyBody: "json"` validates expressions as JSON and fails with dynamic object expressions. `specifyBody: "string"` sends the value as a form parameter (`body=value`), not as a raw JSON body. **Error seen:** OpenRouter returned 400 Bad Request because the body was malformed. **Fix:** Use `contentType: "raw"` + `rawContentType: "application/json"` + `body: "={{ $json.requestBody }}"` where `requestBody` is a `JSON.stringify`'d string from a Code node.

2. **n8n Credentials system** — "Credentials not found" errors when trying to use n8n's built-in credential for API keys. Unreliable on basic cloud plans. **Fix:** Hardcoded `Authorization: Bearer <key>` directly in `headerParameters` for the HTTP Request node.

3. **ENRICH_SECRET mismatch** — Supabase Edge Functions and n8n used one value; Vercel `/api/leads/enrich` expected another. **Error seen:** 401 Unauthorized on POST to `/api/leads/enrich`. **Diagnosis:** Pulled Vercel production env with `vercel env pull .env.production.local` and compared; corrected the value in Supabase Vault and n8n Variables.

4. **n8n webhook data nesting** — Easy to forget that webhook payload is under `$json.body`, not `$json`. In Code nodes: `$input.first().json.body.field`. Documented in MASTER_KNOWLEDGE §7 but required re-checking during debugging.

---

## Lessons Learned

1. **n8n HTTP Request body — dynamic JSON** — Use `contentType: "raw"` + `rawContentType: "application/json"` + a body field that references a JSON string from a prior node. Never use `specifyBody: "json"` for dynamic expressions; never use `specifyBody: "string"` expecting a raw body.

2. **n8n Code node as HTTP pre-processor** — For complex request bodies, build the full JSON in a Code node with `JSON.stringify()`, output as a string field, and reference it in the HTTP Request node. Avoids all expression limitations and validation failures.

3. **n8n Credentials — skip on basic plans** — Hardcode API keys in `headerParameters` for reliability. The Credentials system causes "Credentials not found" and is unreliable on basic cloud plans.

4. **Vercel env pull for debugging** — `vercel env pull .env.production.local --environment=production` (run in project dir) retrieves decrypted production env vars. Delete the file immediately after reading.

---

## Process Improvements

- **Test the enrich endpoint first** — Before wiring n8n, verify `/api/leads/enrich` works with a curl POST using the correct `ENRICH_SECRET` header. Reduces debugging cycles when n8n and endpoint are both in play.
- **Store ENRICH_SECRET in Supabase vault too** — If the enrich endpoint ever moves to an Edge Function, having the secret in the vault avoids another source of truth.
- **Use contentType raw from the start** — When building n8n workflows that POST dynamic JSON to external APIs, default to `contentType: "raw"` + Code node body builder; avoid `specifyBody: "json"` for anything non-static.

---

## Technical Improvements

- **Update MASTER_KNOWLEDGE.md §3** — Add Pattern 2 (HTTP API Integration) guidance: `contentType: "raw"` + `rawContentType: "application/json"` for dynamic JSON bodies; Code node pre-processor pattern.
- **Store N8N_WEBHOOK_URL in Supabase vault** — So it's accessible via `vault.decrypted_secrets` if needed by other Edge Functions.
- **Consistent secret storage** — Ensure `ENRICH_SECRET` is stored identically in Supabase Vault, Vercel, and n8n Variables; document the single source of truth (e.g. Vercel) and sync procedure.

---

## Next Steps

- Update `MASTER_KNOWLEDGE.md` §3 (Pattern 2: HTTP API Integration) with `contentType: "raw"` guidance for dynamic JSON bodies
- Next sprint candidate: VERCEL-MC (Deploy Mission Control to Vercel)
- Consider adding N8N_WEBHOOK_URL to the Supabase vault so it's accessible via `vault.decrypted_secrets`
