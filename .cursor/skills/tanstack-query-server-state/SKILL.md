---
name: tanstack-query-server-state
description: When/how to add TanStack Query in Next.js App Router, avoiding waterfalls, caching patterns
when_to_use: |
  Use when adding server state management, fetching from Supabase/APIs, or optimizing data loading.
  Trigger phrases: "TanStack Query", "useQuery", "server state", "data fetching", "cache invalidation"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  session_count: 1
  validation: memory-bank/techContext.md — TanStack Query to be added
source_learnings:
  - "TanStack Query + Next.js App Router"
---

# TanStack Query Server State

## Overview

United Trades will use TanStack Query (`@tanstack/react-query`) for server state when Supabase is added. This skill covers when to add it, avoiding request waterfalls, and caching patterns in Next.js 15 App Router.

## Prerequisites

- Verify `@tanstack/react-query` is in `package.json` before importing
- Read `memory-bank/techContext.md` for current state (to be added)
- Do NOT assume QueryClient or providers exist — read layout/provider files first

## When to Add TanStack Query

| Use Query | Use Server Components / fetch | Use useState |
|-----------|------------------------------|--------------|
| Client-side refetch, mutations | Initial page load, static data | Local UI state |
| Real-time invalidation | SEO-critical data | Form inputs |
| Optimistic updates | No client interactivity | Toggles, modals |

## Steps

### Step 1: Verify Package
**Action:** Read `package.json` for `@tanstack/react-query`.
**Success Criteria:** Package installed or user informed to add it.
**If missing:** `npm install @tanstack/react-query` — do not silently assume.

### Step 2: Provider Setup
**Action:** Add `QueryClientProvider` in root layout (client component).
**Success Criteria:** Provider wraps app; QueryClient created with sensible defaults.
**Verification:** Read `src/app/layout.tsx` before adding — may need `'use client'` wrapper.

### Step 3: Avoid Waterfalls
**Action:** Prefer parallel fetches; avoid sequential `await` in components.
**Success Criteria:** No child waiting on parent fetch before starting its own.
**Pattern:** Use `Promise.all` or `useQueries` for parallel; prefetch in layout/route handler when possible.

### Step 4: Caching Patterns
**Action:** Define query keys consistently; use `staleTime` and `gcTime` (formerly `cacheTime`).
**Success Criteria:** Keys match resource (e.g., `['leads', id]`); stale time set for stable data.
**Example:**
```typescript
useQuery({
  queryKey: ['leads', leadId],
  queryFn: () => fetchLead(leadId),
  staleTime: 60_000, // 1 min
})
```

### Step 5: Mutations and Invalidation
**Action:** Use `useMutation` for writes; invalidate related queries on success.
**Success Criteria:** `queryClient.invalidateQueries({ queryKey: ['leads'] })` after create/update.

## Verification Checklist

- [ ] Package verified in package.json
- [ ] Provider in layout (read layout first)
- [ ] No request waterfalls (parallel where possible)
- [ ] Query keys consistent and hierarchical
- [ ] Mutations invalidate correct queries

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Assume QueryClient exists | Read layout, add provider if missing |
| Sequential awaits in tree | Parallel fetches or prefetch |
| Flat query keys | Hierarchical: `['leads'], ['leads', id]` |
| Skip staleTime for rarely-changing data | Set staleTime to reduce refetches |

## Related

- `memory-bank/techContext.md` — State Management
- `.cursor/rules/api-data-fetching.mdc` — data fetching patterns
- Next.js 15 App Router docs — Server vs Client Components
