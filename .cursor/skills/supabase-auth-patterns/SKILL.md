---
name: supabase-auth-patterns
description: Next.js App Router + Supabase Auth patterns, cookie/session handling, RLS verification steps; do not assume tables/policies exist
when_to_use: |
  Use when implementing auth, protected routes, login/logout, or session handling.
  Trigger phrases: "Supabase Auth", "login", "protected route", "session", "RLS", "middleware auth"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  validation: .cursor/rules/auth-patterns.mdc, memory-bank/techContext.md
---

# Supabase Auth Patterns (Next.js App Router)

## Overview

United Trades uses **Supabase Auth** with **Next.js 15 App Router**. Use `@supabase/ssr` for cookie-based session management. All 3 sites share the same Supabase Auth project. **Do not assume tables or RLS policies exist** — verify schema first.

## Prerequisites

- Read `.env.local` or env config before using `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Read Supabase schema before referencing tables or RLS policies
- Verify `@supabase/ssr` and `@supabase/supabase-js` in package.json

## Verification Steps

### Before Implementing Auth
1. **Read** `.env.local` (or equivalent) — confirm `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist
2. **Read** `package.json` — confirm `@supabase/ssr`, `@supabase/supabase-js`
3. **Read** Supabase schema/migrations — confirm RLS status, policies; do NOT assume `leads` or other tables have policies

### Env Vars (verify before use)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # server-only, for admin operations
```

## Critical Rules

### getUser() vs getSession()
```typescript
// ✅ CORRECT — server-side: getUser() validates JWT with Supabase
const { data: { user } } = await supabase.auth.getUser()

// ❌ WRONG — getSession() trusts client JWT without server validation
const { data: { session } } = await supabase.auth.getSession()
```

### Cookie Handling (Middleware)
Use `createServerClient` from `@supabase/ssr` with `getAll`/`setAll` cookie handlers. Middleware must run on every request to refresh session.

### App Router Specifics
- **After sign-in:** `router.push('/admin')` then `router.refresh()` — required so server components see new session
- **After sign-out:** `window.location.href = '/login'` (full reload), not `router.push()` — avoids cookie propagation delay

## RLS Verification

**Do NOT assume RLS policies exist.** Before writing code that relies on RLS:
1. Read Supabase schema or migration files
2. Confirm `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
3. Confirm policies for `authenticated`, `service_role`, anon as needed

If schema is missing, propose policies; do not invent table names.

## Client vs Server Supabase

- **Client components:** `createClient()` from `@/lib/supabase/client`
- **Server components/layouts:** `createClient()` from `@/lib/supabase/server`

Verify these files exist and export `createClient` before importing.

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Assume RLS policies exist | Read schema first |
| Use getSession() server-side | Use getUser() |
| Skip router.refresh() after sign-in | Always refresh |
| Use router.push() after sign-out | Use window.location.href |
| Trust client-side auth for sensitive data | RLS + server checks |

## Related

- `.cursor/rules/auth-patterns.mdc` — full patterns, middleware, login page
- `memory-bank/techContext.md` — Supabase packages, env vars
- `.cursorrules` — Anti-Hallucination Rules
