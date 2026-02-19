---
name: salient-template-integration
description: How to scaffold sites from tailwind-plus-salient/salient-ts/ without modifying the source template; migration checklist
when_to_use: |
  Use when creating a new site (prime-electrical, akf-construction, cleanjet) or syncing from Salient.
  Trigger phrases: "scaffold from Salient", "new site", "template migration", "Salient copy"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  session_count: 1
  validation: .cursorrules Project Structure
source_learnings:
  - "Salient Template Integration"
---

# Salient Template Integration

## Overview

The source template is `tailwind-plus-salient/salient-ts/`. **Do not modify it directly.** New sites (prime-electrical, akf-construction, cleanjet) are scaffolded by copying and customizing. This skill defines the process and migration checklist.

## Prerequisites

- Read `.cursorrules` for Project Structure
- Verify `tailwind-plus-salient/salient-ts/` exists before copying
- Do NOT edit files inside `salient-ts/` — treat as read-only source

## Steps

### Step 1: Verify Source Exists
**Action:** Glob or Read to confirm `tailwind-plus-salient/salient-ts/` and its structure.
**Success Criteria:** Template path confirmed; key files present (package.json, src/app, src/components).
**If missing:** Report; do not invent paths.

### Step 2: Copy, Don't Link
**Action:** Copy template into new site folder (e.g., `prime-electrical/`); do not symlink or modify source.
**Success Criteria:** New site is independent; changes in site do not affect template.
**Command pattern:** `cp -r tailwind-plus-salient/salient-ts/* prime-electrical/` (or equivalent).

### Step 3: Update Site Identity
**Action:** Change `package.json` name, update brand-specific content (Hero, Footer, logos).
**Success Criteria:** Site name and brand reflected; no "Laravel" or template placeholders.

### Step 4: Migration Checklist (Per Site)
**Action:** Apply these changes after copy:
- [ ] `package.json` — update `name` to site slug
- [ ] `src/app/layout.tsx` — title, metadata
- [ ] `src/components/Hero.tsx` — brand headline, CTA
- [ ] `src/components/Footer.tsx` — brand links, copyright
- [ ] `src/components/Header.tsx` — nav items, CTA
- [ ] `src/styles/tailwind.css` — `@theme` brand colors
- [ ] `public/` — favicon, logos
- [ ] `tsconfig.json` — verify `@/*` → `./src/*`

### Step 5: Preserve Template Patterns
**Action:** Keep Headless UI usage, clsx patterns, Tailwind v4 setup.
**Success Criteria:** No tailwind.config.js; PostCSS uses `@tailwindcss/postcss`; imports use `@/`.

## Verification Checklist

- [ ] Source template NOT modified
- [ ] New site folder is copy, not symlink
- [ ] package.json name updated
- [ ] Brand content replaced
- [ ] Path alias `@/*` works
- [ ] `npm run build` passes

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Edit salient-ts/ directly | Copy to site, edit copy |
| Add tailwind.config.js | Use @theme in tailwind.css |
| Change PostCSS plugin | Keep @tailwindcss/postcss |
| Assume site exists | Verify folder before operations |

## Template Structure (Reference)

```
salient-ts/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (auth)/
│   ├── components/
│   └── styles/tailwind.css
├── package.json
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```

## Related

- `.cursorrules` — Project Structure
- `memory-bank/techContext.md` — Tailwind v4, site structure
- `headless-ui-patterns` — preserve UI patterns in scaffolded sites
