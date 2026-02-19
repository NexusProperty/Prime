# Skills Review Findings Report

- **Orion ID:** ORION-001
- **Date:** 2026-02-19
- **Source:** Direct scan of `C:\Users\Jackc\.cursor\skills-cursor\`, `f:\Prime\.cursor\skills\`, `f:\Prime\.agent\skills\skills\`
- **Reference:** `/orion` command Phase 3 execution

---

## Executive Summary

A skills review across three locations reveals a clear split: **Cursor user skills** (5 meta-skills for rules/settings/subagents), **project skills** (3 E2E-focused skills), and **general skills** (864+ in `.agent/skills/skills`). The United Trades stack (Next.js 15 App Router, React 19, Tailwind v4, Supabase, Make.com, OpenAI GPT-4o, Vapi.ai, Twilio, hub-and-spoke cross-sell) has no dedicated project skills yet. The `.agent` library contains relevant skills (e.g. `nextjs-supabase-auth`, `zapier-make-patterns`, `twilio-communications`, `voice-ai-development`) but requires curation to avoid noise and ensure project-specific patterns are followed.

---

## Verified Inventory Summary

### Cursor Skills (`C:\Users\Jackc\.cursor\skills-cursor\`)

| Skill | Path | Purpose |
|-------|------|---------|
| create-rule | `create-rule/SKILL.md` | Create Cursor rules, RULE.md, AGENTS.md |
| create-skill | `create-skill/SKILL.md` | Create Agent Skills (SKILL.md format) |
| create-subagent | `create-subagent/SKILL.md` | Create subagent definitions |
| update-cursor-settings | `update-cursor-settings/SKILL.md` | Modify settings.json |
| migrate-to-skills | `migrate-to-skills/SKILL.md` | Migrate rules/content to skills |

**Verification:** All 5 skills confirmed via `Glob` for `**/SKILL.md` under `C:\Users\Jackc\.cursor\skills-cursor\`.

---

### Project Skills (`f:\Prime\.cursor\skills\`)

| Skill | Path | Purpose |
|-------|------|---------|
| dynamic-entity-selectors | `dynamic-entity-selectors/SKILL.md` | E2E pattern for entity cards with `data-testid` |
| e2e-selector-verification | `e2e-selector-verification/SKILL.md` | Protocol for verifying E2E selectors vs source |
| radix-ui-e2e | `radix-ui-e2e/SKILL.md` | Patterns for testing Radix UI (e.g. Select) in Playwright |

**Verification:** All 3 skills confirmed via `Glob` and `Read` of `dynamic-entity-selectors/SKILL.md`.

---

### General Skills (`f:\Prime\.agent\skills\skills\`)

| Count | Notes |
|-------|-------|
| 864+ | Skills with `SKILL.md` |
| Many | General-purpose (automation, testing, frameworks) |
| Relevant subset | `nextjs-supabase-auth`, `nextjs-app-router-patterns`, `nextjs-best-practices`, `zapier-make-patterns`, `twilio-communications`, `voice-ai-development`, `voice-ai-engine-development`, `voice-agents`, `tailwind-patterns`, `tailwind-design-system`, `supabase-automation`, `postgres-best-practices` |

**Recommendation:** Curation required. The `.agent/skills/skills` folder contains many general skills; only a subset aligns with United Trades. Recommend creating a curated index or symlink set for project-relevant skills rather than loading all 864+.

---

## Detailed Findings

### 1. Gap: No Project-Specific Stack Skills

The project uses:
- Next.js 15 App Router, React 19, TypeScript strict
- Tailwind v4 via CSS `@theme {}` (not tailwind.config.js)
- Supabase Auth/DB
- Make.com automation
- OpenAI GPT-4o
- Vapi.ai + Twilio
- Hub-and-spoke cross-sell (Prime ↔ AKF ↔ CleanJet)

**Finding:** No project skill exists for any of these. The three existing project skills are E2E/testing-focused only.

---

### 2. Cursor Skills Are Meta, Not Domain

The Cursor skills (`create-rule`, `create-skill`, `create-subagent`, `update-cursor-settings`, `migrate-to-skills`) support configuration and authoring. They do not encode United Trades domain knowledge or stack patterns.

---

### 3. .agent Skills Are Uncurated

864+ skills in `.agent/skills/skills` span many domains (Unity, Terraform, blockchain, etc.). United Trades-relevant skills exist but are buried. No project-level index or "skill pack" exists.

---

### 4. Pattern Analysis

- **Project skills** follow a consistent format: `SKILL.md` with frontmatter (`name`, `description`, `when_to_use`, `evidence`, `source_learnings`).
- **Cursor skills** are simpler: `name`, `description`, usage guidance.
- **.agent skills** vary in structure; some include `metadata.json`, `AGENTS.md`, implementation playbooks.

---

## Files Requiring Investigation

- `f:\Prime\.agent\skills\skills\zapier-make-patterns\SKILL.md` — Make.com patterns
- `f:\Prime\.agent\skills\skills\nextjs-supabase-auth\SKILL.md` — Auth patterns
- `f:\Prime\.agent\skills\skills\voice-ai-development\SKILL.md` — Vapi.ai relevance
- `f:\Prime\.agent\skills\skills\twilio-communications\SKILL.md` — Twilio patterns
- `f:\Prime\.agent\skills\skills\tailwind-patterns\SKILL.md` — Tailwind v4 alignment
