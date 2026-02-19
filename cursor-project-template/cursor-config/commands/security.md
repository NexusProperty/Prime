# SECURITY Command - Security Review & Vulnerability Analysis

This command performs OWASP-aligned security review of referenced files or directories, identifying vulnerabilities with severity ratings and remediation guidance.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. It does NOT replace any existing functionality — it gates entry into it.

All command executions — including `/security` — must follow this three-phase sequence. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

The Main Agent spawns **2-3 parallel subagents** via the `Task` tool. **ALL subagents MUST use `model: "fast"`**.

**Subagent A — Target Scanner** (`codebase-scanner-fast`, `model: "fast"`)
- Read all files in the referenced path
- Identify file types (components, hooks, API routes, utilities, configs)
- Map data flow patterns (user input → processing → output)

**Subagent B — Auth/RLS Scanner** (`auth-security-specialist-fast`, `model: "fast"`)
- Check for ProtectedRoute usage on private pages
- Verify Supabase RLS policies on referenced tables
- Identify auth state handling patterns

**Subagent C — Dependency Scanner** (optional, `codebase-scanner-fast`, `model: "fast"`)
- Check `package.json` for known vulnerable dependencies
- Identify usage of security-sensitive libraries

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives all subagent discovery reports and performs security analysis:

1. **Scope mapping** — Understand the attack surface of the referenced code
2. **OWASP checklist** — Evaluate against each security category (see below)
3. **Finding synthesis** — Compile findings with severity ratings
4. **Report generation** — Produce structured security report

### Phase 3: Execution (Delegated by Main Agent)

> The Main Agent delegates report creation to a subagent. It does NOT directly create files.

1. **Delegate report creation** — Spawn subagent to create security findings document
2. **Update Memory Bank** — Record security review in `memory-bank/activeContext.md`

---

## OWASP Security Checklist

The security review evaluates these categories:

### 1. Input Validation
- [ ] All user inputs sanitized before processing
- [ ] Zod schemas on API boundaries
- [ ] File uploads validated (type, size, content)
- [ ] URL parameters validated

### 2. Authentication
- [ ] ProtectedRoute on all private pages
- [ ] Auth state checked before sensitive operations
- [ ] Session management secure (httpOnly cookies, secure flag)
- [ ] Password requirements enforced

### 3. Authorization (RLS)
- [ ] Supabase RLS policies on all tables with user data
- [ ] Row-level checks in application code where RLS insufficient
- [ ] No privilege escalation paths
- [ ] API routes verify user permissions

### 4. Injection Prevention
- [ ] No raw SQL queries (use parameterized queries or RPC)
- [ ] No dangerouslySetInnerHTML with user content
- [ ] No eval() or Function() with user input
- [ ] Command injection prevented in server-side code

### 5. Data Exposure
- [ ] No sensitive data in client bundles (API keys, secrets)
- [ ] No PII in logs or error messages
- [ ] Proper error handling (no stack traces to users)
- [ ] Secure data transmission (HTTPS enforced)

### 6. Cryptography
- [ ] Passwords hashed (not stored in plaintext)
- [ ] Tokens have expiration and rotation
- [ ] Secure random generation for tokens/IDs
- [ ] No weak algorithms (MD5, SHA1 for security)

---

## Severity Ratings

| Severity | Definition | Response |
|----------|------------|----------|
| **CRITICAL** | Immediate exploitation possible; data breach risk | Fix immediately; block deployment |
| **HIGH** | Significant vulnerability; requires attacker skill | Fix before next release |
| **MEDIUM** | Moderate risk; defense-in-depth issue | Fix within sprint |
| **LOW** | Minor issue; best practice violation | Track for future fix |
| **INFO** | Observation; no direct security impact | Document only |

---

## Finding Format

Each finding must include:

```markdown
### [SEVERITY] Finding Title

**Category:** [OWASP category from checklist]
**Location:** `path/to/file.ts:line_number`
**Description:** What the vulnerability is

**Exploit Path:**
How an attacker could leverage this vulnerability

**Remediation:**
Specific code change to fix the issue

**Verification:**
How to confirm the fix works
```

---

## Workflow

1. **Receive target** — User provides `@` reference to file or directory
2. **Discovery** — Spawn subagents to scan target code
3. **Analysis** — Apply OWASP checklist to findings
4. **Report** — Generate severity-rated findings
5. **Output** — Present findings to user with remediation guidance

---

## Usage

```
/security @src/lib/supabase/
/security @src/components/auth/
/security @src/hooks/usePayment.ts
```

---

## Integration with AGENTS.md

This command respects the Verification Layer (Article II). All file reads are performed via the Read tool before analysis. No assumptions are made about file contents.

---

*This command implements the Security Review Agent pattern from Claude Code's `agent-prompt-security-review-slash-command.md`.*
