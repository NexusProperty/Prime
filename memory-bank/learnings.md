# Learnings

> Patterns, preferences, and lessons learned. Updated when patterns are confirmed in 2+ sessions.

## Update Rules
- Only add entries confirmed across multiple sessions
- Include specific examples
- Link to relevant files

## Code Patterns

| Pattern | Context | Example |
|---------|---------|---------|
| Brand prop + lookup object | Multi-brand components | `const b = brandConfig[brand]` — one component, three visual identities |
| Emergency config override | Safety states ignore brand color | `isEmergency ? emergencyConfig.bg : b.bg` |
| `'use client'` on leaves only | Next.js App Router | Keep page.tsx as server component; only interactive sub-components get `'use client'` |
| Suspense for useSearchParams | Next.js 15 requirement | `<Suspense fallback={null}><InnerComponent /></Suspense>` |
| `@theme { --z-*: N }` | Tailwind v4 custom z-index | `--z-overlay: 100` in tailwind.css → `z-overlay` class in components |
| range input for drag UIs | Accessible drag interactions | `<input type="range" className="opacity-0">` + custom visual handle |
| Barrel index.ts | Component directory exports | `export { AIChatWidget } from './AIChatWidget'` |
| Sub-component ≤50 lines | Keeps components focused | Extract `WaveformBars`, `ChatMessage`, `ChatInput` etc. |
| Always use `supabase gen types` — never handwrite `database.ts` | Supabase type generation | Run `supabase gen types typescript --project-id <id>`; handwritten types break on library upgrades |
| Supabase migration files must use unique numeric prefixes (YYYYMMDDHHMMSS format) | Migration naming | Use `20260221000001_name.sql` format to avoid duplicate key conflicts in Supabase's migration tracking |
| pg_net trigger for outbound HTTP from Postgres | Supabase webhooks without the Dashboard UI | `PERFORM net.http_post(url := '...', body := payload, headers := jsonb_build_object(...))` inside a PL/pgSQL trigger function |
| Playwright `#id` scoping to avoid strict mode violations | E2E tests where same text appears in multiple elements | `page.locator('#booking').getByRole('button', { name: '1–2 Beds' })` instead of `page.getByRole('button', { name: '1–2 Beds' })` |
| role="dialog" for modal/overlay detection in tests | CrossSellPromptCard uses `role="dialog"` — use it in Playwright to avoid strict mode on generic text | `page.getByRole('dialog', { name: /ai recommendation/i })` |
| Return computed sub-arrays in Edge Function responses | Supabase quote generation — line_items in response payload prevents anon-key RLS barrier on sub-table reads | Include `line_items` in generate-quote response; never require client to fetch sub-table data separately |
| Make `contact_id` optional in client-facing Edge Functions | Client may not have contactId at form submission time (before ingest runs) | Always use `z.string().uuid().optional()` for contactId in functions called from browsers |
| Tailwind v4 boolean data attribute variants drop brackets | headlessui `data-open` state in Tailwind v4 | `group-data-open:rotate-180` NOT `group-data-[open]:rotate-180` — v4 drops brackets for boolean attrs |
| Status-transition edge functions need only Zod + createClient (no shared LLM helpers) | Accept/reject/cancel Edge Functions | quote-accept uses only Zod, createClient; no _shared/quotes.ts helpers — simpler than generate functions |
| n8n HTTP Request body — dynamic JSON | n8n HTTP Request node posting to APIs | Use `contentType: "raw"` + `rawContentType: "application/json"` + `body="{{ $json.requestBody }}"`. `specifyBody: "json"` fails with dynamic expressions. `specifyBody: "string"` sends as form parameter not raw body. (N8N-ACTIVATE 2026-02-23) |
| n8n Code node as HTTP pre-processor | Complex request bodies in n8n | Build in Code node (`JSON.stringify()`), output as string field, reference with `$json.requestBody` in HTTP Request `body` param. Avoids all HTTP Request expression limitations. (N8N-ACTIVATE 2026-02-23) |
| n8n Credentials — skip on basic plans | n8n cloud basic plan | Hardcode API keys directly in `headerParameters` for reliability. n8n Credentials system causes "Credentials not found" errors and is unreliable on basic cloud plans. (N8N-ACTIVATE 2026-02-23) |
| Vercel env pull for debugging | Debugging env var mismatches | `vercel env pull .env.production.local --environment=production` (run in project dir) retrieves decrypted production env vars. Delete the file immediately after reading. (N8N-ACTIVATE 2026-02-23) |

## Communication Preferences

| Preference | Details |
|------------|---------|
| | |

## Common Mistakes

| Mistake | Correction | Prevention |
|---------|------------|------------|
| Using `z-[100]` arbitrary value | Add `--z-overlay: 100` to `@theme {}` in tailwind.css | Run QA before build; check for arbitrary values |
| `useSearchParams()` without Suspense | Wrap in `<Suspense fallback={null}>` | Next.js 15 requires this for all `useSearchParams` usage |
| Naming interface `ChatMessage` same as component | Rename interface to `ChatMessageData` | Suffix interfaces with `Data` when component name might conflict |
| `FormData` conflicts with web API | Use `LeadFormData` for custom form interfaces | Never name interfaces after built-in globals |
| Handwriting Supabase `Database` interface instead of generating it | Run `supabase gen types typescript --project-id <id>` and write output to `src/types/database.ts` | Add `"db:types"` script to `package.json`; never manually edit `database.ts` |
| Using `extensions.http_post` instead of `net.http_post` for pg_net | The pg_net extension installs into the `net` schema, not `extensions` | Always check `pg_get_function_arguments` for actual schema before writing trigger code |
| `page.getByText(/brand-name/i) in tests when brand name appears in footer/nav too` | Scope to containing element or use role-based selectors | Always run tests in headed mode first to see exact DOM structure |
|| Calling `.catch()` on a supabase-js v2 query builder in Deno | `PostgrestBuilder` is not a native Promise in Deno Edge Runtime — use `const { data, error } = await supabase.from(...)...` | TELEGRAM-001 Phase 2 |
|| Setting `OPENROUTER_MODEL` to a web-search model | Bot cites external URLs — use `openai/gpt-4o-mini` and verify by checking response for external URL citations | TELEGRAM-001 post-Phase 5 |
|| Vague LLM system prompt for a scoped internal tool | Bot gives generic answers — enumerate capabilities, limitations, commands, and inject live DB context | TELEGRAM-001 Phase 5 post-fix |

## Deno / Edge Function Patterns

| Pattern | Context | Example |
|---------|---------|-------|
| Always `await` supabase-js v2 queries and destructure `{ data, error }` | Never `.catch()` on the builder in Deno Edge Runtime | `const { data, error } = await supabase.from("contacts").select(...)` |
| `pending_action` in session context for multi-step flows | No schema migration needed for new flow states | `context: { pending_action: "await_email" }` cleared on completion |
| Early-return after multi-message handlers | Prevents double-send from falling through to global `sendMessage` | `/leads` calls `handleLeads()` then `return new Response(...)` |
| Callback query routing before `message.text` | Telegram may send both; check `callbackQuery?.data` first | `if (callbackQuery?.data) { ... return; }` before text handling |
| `outbound_queue` + `mc-send` for async channel delivery | Reuse existing delivery infrastructure for any new channel | Add `delivery_type: "telegram"` + delivery branch in mc-send |
| Inject live DB context into LLM system prompt | Without it bot cannot answer real data questions | Load recent contacts + active sites before building system prompt |

## Tool Preferences

| Tool | Usage | Notes |
|------|-------|-------|
| | | |
