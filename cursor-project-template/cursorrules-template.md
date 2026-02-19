---
**TEMPLATE FILE** — Copy to project root as `.cursorrules` and replace placeholders (`[PROJECT_NAME]`, `[FRAMEWORK]`, etc.) with your project-specific values. Remove or customize HTML comments as needed.
---

# [PROJECT_NAME] - Cursor Rules

<!-- CUSTOMIZE: Rename this file to .cursorrules and replace [PROJECT_NAME] with your project name -->

> These rules are derived from extensive analysis of 48+ test failures, authentication race conditions,
> and UI flakiness. Following these rules prevents recurring bugs and improves code quality.

## Project Context

<!-- CUSTOMIZE: Replace placeholders with your actual tech stack -->

**[PROJECT_NAME]** is a [PROJECT_DESCRIPTION] built with:
- [FRAMEWORK] (e.g., React 19 + TypeScript + Vite)
- [BACKEND] (e.g., Supabase for Auth, Database, Edge Functions)
- [STATE_MANAGEMENT] (e.g., TanStack Query for server state)
- [UI_LIBRARY] + [STYLING] (e.g., Radix UI + Tailwind CSS + design system)
- [E2E_TESTING] (e.g., Playwright for E2E testing)

---

## 🚨 CRITICAL RULES (Breaking These Causes Bugs)

### 1. React Hooks Order
**All hooks MUST be called before any conditional returns.**

```typescript
// ❌ CAUSES CRASH
function Component() {
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/login" />; // WRONG!
  const [state, setState] = useState(false); // Hook order violation!
}

// ✅ CORRECT
function Component() {
  const { profile } = useAuth();
  const [state, setState] = useState(false); // All hooks first
  if (!profile) return <Navigate to="/login" />; // Then early returns
}
```

### 2. Loading State Resolution
**Async operations MUST resolve loading states in `finally` blocks.**

```typescript
// ❌ CAUSES INFINITE LOADING
try {
  const data = await fetch();
  setIsLoading(false); // Not called on error!
} catch (error) {
  setError(error);
}

// ✅ CORRECT
try {
  const data = await fetch();
} catch (error) {
  setError(error);
} finally {
  setIsLoading(false); // Always called
}
```

### 3. Timeout Protection for Async Operations
**External API calls MUST have timeout protection.**

```typescript
// ❌ CAN HANG FOREVER
const { data } = await supabase.from('profiles').select('*');

// ✅ CORRECT - Timeout protection
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Timeout')), 10000)
);
const result = await Promise.race([fetchPromise, timeoutPromise]);
```

<!-- CUSTOMIZE: Update the API call example above if your backend differs from Supabase -->

---

## 📋 Pre-Commit Checklist

Before committing, verify:
- [ ] All hooks before conditional returns
- [ ] Loading states in `finally` blocks
- [ ] `data-testid` on critical elements
- [ ] Loading/error/empty states handled
- [ ] `npm run typecheck` passes
- [ ] `npm run test:run` passes
- [ ] `npm run e2e:smoke` passes

<!-- CUSTOMIZE: Adjust script names (typecheck, test:run, e2e:smoke) to match your package.json -->

---

## 🧠 Thinking Protocol

When facing a non-trivial decision (architecture, debugging, multi-file changes), agents MUST use structured reasoning:

### Chain of Thought
Before proposing a solution, work through:
1. **Analyze** — What exactly is being asked? What are the constraints?
2. **Explore** — What existing code/patterns are relevant? (Read first!)
3. **Plan** — What are the options? What are the tradeoffs?
4. **Verify** — Does the plan pass the AGENTS.md verification layer?

### When to Use
- Architecture decisions (new features, refactoring)
- Debugging sessions (root cause analysis)
- Multi-file changes (impact assessment)
- Any decision with significant tradeoffs

## 💬 Communication Standards

- Do not explain how a framework/language works — the developer knows
- Do not repeat the user's question back to them
- When showing code changes, use diffs or targeted snippets, not full file rewrites
- Prefix code suggestions with a 1-line summary of what changes and why
- No time estimates unless explicitly asked
- No hedging ("I think", "perhaps", "maybe") — be direct

## 📖 Context-Specific Rules (in `.cursor/rules/`)

<!-- CUSTOMIZE: Update rule files and descriptions to match your project's .cursor/rules setup -->

These rules apply automatically when editing matching files:

| Rule File | Applies To | Description |
|-----------|-----------|-------------|
| `anti-hallucination.mdc` | All files (always) | Verify imports, no mock data invention |
| `react-patterns.mdc` | `*.tsx`, `*.ts` | Component patterns, hooks, state management |
| `ui-styling.mdc` | `*.tsx`, `*.ts`, `*.css` | [DESIGN_SYSTEM], tokens, gradient mapping, forbidden patterns |
| `auth-patterns.mdc` | Auth/route files | ProtectedRoute, auth state, testing |
| `api-data-fetching.mdc` | Hooks/queries | React Query, [BACKEND] RPC, mutations |
| `e2e-testing.mdc` | Test files | Flaky test prevention, selectors, timing |

---

## 📖 Key Documentation

<!-- CUSTOMIZE: Update paths to match your project's doc structure -->

- **`docs/architecture/UI_STANDARDS.md`** — UI source of truth (read FIRST for UI tasks)
- **`docs/BEST_PRACTICES.md`** — Project dialect guide
- **`docs/ARCHITECTURE.md`** — System architecture

---

*These rules are living documents. Update when new patterns are discovered.*
