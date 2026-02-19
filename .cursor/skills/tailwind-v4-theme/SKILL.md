---
name: tailwind-v4-theme
description: Tailwind v4 theme tokens via CSS @theme {}, OKLCH colors, no tailwind.config.js, Salient alignment
when_to_use: |
  Use when customizing theme, colors, typography, or spacing in United Trades sites.
  Trigger phrases: "@theme", "Tailwind v4", "theme tokens", "brand colors", "tailwind.config", "OKLCH"
evidence:
  first_observed: 2026-02-19
  last_confirmed: 2026-02-19
  validation: .cursorrules, memory-bank/techContext.md
---

# Tailwind v4 Theme

## Overview

United Trades uses **Tailwind CSS v4**. Theme customization lives in CSS via `@theme {}` — **no `tailwind.config.js`**. PostCSS uses `@tailwindcss/postcss`. Align with Salient template patterns.

## Prerequisites

- Read `src/styles/tailwind.css` before editing theme
- Verify `postcss.config.js` uses `@tailwindcss/postcss` (not `tailwindcss` directly)
- Do NOT create or reference `tailwind.config.js`

## Theme Location

| File | Purpose |
|------|---------|
| `src/styles/tailwind.css` | `@theme {}` block, custom tokens |
| `postcss.config.js` | `@tailwindcss/postcss` plugin |

## @theme Syntax

```css
@import 'tailwindcss';

@plugin '@tailwindcss/forms';

@theme {
  /* Colors — prefer OKLCH for perceptual uniformity */
  --color-brand: oklch(0.55 0.2 250);
  --color-brand-light: oklch(0.75 0.15 250);

  /* Typography (Salient pattern) */
  --font-sans: var(--font-inter);
  --font-display: var(--font-lexend);

  /* Custom spacing/radius */
  --radius-4xl: 2rem;
  --container-2xl: 40rem;

  /* Text sizes (Salient uses --text-* pattern) */
  --text-xs: 0.75rem;
  --text-xs--line-height: 1rem;
}
```

## OKLCH Color Guidelines

- Use `oklch(L C H)` for brand colors — better perceptual uniformity than hex
- L: 0–1 (lightness), C: 0–0.4 (chroma), H: 0–360 (hue)
- Example: `oklch(0.55 0.2 250)` — medium blue

## Verification Steps

### Before Editing Theme
1. **Read** `src/styles/tailwind.css` — confirm existing tokens
2. **Read** `postcss.config.js` — confirm `@tailwindcss/postcss`
3. **Glob** for `tailwind.config.js` — if found, remove or flag (project uses v4)

### After Adding Tokens
- [ ] Token names follow Tailwind convention (`--color-*`, `--font-*`, `--radius-*`)
- [ ] No `tailwind.config.js` introduced
- [ ] `npm run build` passes

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Add tailwind.config.js | Use @theme in tailwind.css |
| Use hex for new brand colors | Prefer oklch() |
| Assume Salient tokens exist | Read tailwind.css first |
| Change PostCSS plugin | Keep @tailwindcss/postcss |

## Salient Alignment

Salient template defines: `--font-sans`, `--font-display`, `--radius-4xl`, `--container-2xl`, `--text-*` scale. Preserve these when adding site-specific tokens. Add brand colors per site (Prime, AKF, CleanJet) in `@theme`.

## Related

- `memory-bank/techContext.md` — Tailwind v4 Notes
- `.cursorrules` — Tailwind v4 note
- `salient-template-integration` — migration checklist
