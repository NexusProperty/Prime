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

## Tool Preferences

| Tool | Usage | Notes |
|------|-------|-------|
| | | |
