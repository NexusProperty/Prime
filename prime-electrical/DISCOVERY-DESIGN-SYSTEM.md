# Design System Report — Prime Electrical

**Project:** `prime-electrical`  
**Discovery Date:** 2026-02-22  
**Scope:** Stream B — Component library, styling, tokens, typography, spacing, layout, patterns, interactive states

---

## 1. Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 |
| Styling | Tailwind CSS v4 |
| UI Primitives | Headless UI (Popover) |
| Shared UI | `@prime/ui-ai` (FormFields, AIProcessingOverlay, CrossSellPromptCard) |
| Utilities | `clsx` |

---

## 2. Color Tokens

**Location:** `src/styles/tailwind.css` (inside `@theme`)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-primary` | `oklch(0.52 0.26 255)` | Primary brand (blue) |
| `--color-brand-primary-hover` | `oklch(0.47 0.26 255)` | Hover state |
| `--color-brand-accent` | `oklch(0.82 0.19 90)` | Accent (yellow/gold) |
| `--color-brand-dark` | `oklch(0.16 0.04 255)` | Dark backgrounds |
| `--color-brand-light` | `oklch(0.96 0.02 255)` | Light backgrounds |
| `--color-brand-muted` | `oklch(0.60 0.10 255)` | Muted text/elements |

**In-component usage:** Tailwind utilities (`blue-600`, `slate-900`, `emerald-400`, `amber-600`) are used directly; brand tokens are defined but not consistently referenced in components.

---

## 3. Typography

### Fonts

| Role | Font | Variable | Source |
|------|------|----------|--------|
| Sans / body | Inter | `--font-inter` | `next/font/google` |
| Display / headings | Lexend | `--font-lexend` | `next/font/google` |
| Mono | System mono | — | Used for labels, status, CTAs |

**Tailwind theme:**

```css
--font-sans: var(--font-inter);
--font-display: var(--font-lexend);
```

### Type Scale (Tailwind v4 @theme)

| Token | Size | Line Height |
|-------|------|-------------|
| `--text-xs` | 0.75rem | 1rem |
| `--text-sm` | 0.875rem | 1.5rem |
| `--text-base` | 1rem | 1.75rem |
| `--text-lg` | 1.125rem | 2rem |
| `--text-xl` | 1.25rem | 2rem |
| `--text-2xl` | 1.5rem | 2rem |
| `--text-3xl` | 2rem | 2.5rem |
| `--text-4xl` | 2.5rem | 3.5rem |
| `--text-5xl` | 3rem | 3.5rem |
| `--text-6xl` | 3.75rem | 1 |
| `--text-7xl` | 4.5rem | 1.1 |
| `--text-8xl` | 6rem | 1 |
| `--text-9xl` | 8rem | 1 |

### Typography Conventions

- **Headings:** `font-display` (Lexend), `font-bold`, `tracking-tight`
- **Labels / status:** `font-mono`, `text-[9px]`–`text-xs`, `uppercase`, `tracking-widest`
- **Body:** `font-sans` (Inter), `text-slate-600` / `text-slate-700`

---

## 4. Spacing & Layout

### Container

**Component:** `Container` (`src/components/Container.tsx`)

- `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Custom width token: `--container-2xl: 40rem` (defined but rarely used)

### Section Spacing

- Common: `py-16 sm:py-24`, `py-20 sm:py-32`
- Gaps: `gap-4`, `gap-6`, `gap-8`, `gap-12`

### Grid

- `grid-cols-1` → `lg:grid-cols-3` or `lg:grid-cols-4` for feature/testimonial layouts
- `max-w-2xl`, `max-w-3xl` for constrained content

---

## 5. Layout Shell

### Main Layout

- **Root:** `flex h-full flex-col`, `scroll-smooth`, `bg-white`, `antialiased`
- **Body:** `flex h-full flex-col`

### Page Structure (Home)

1. `FinancingBanner` — full-width amber strip
2. `Header` — sticky, `z-50`
3. `main` — Hero, PrimaryFeatures, SecondaryFeatures, CallToAction, Testimonials, Contact (LeadCaptureForm), Faqs
4. `Footer` — dark (`bg-slate-900`)
5. `AIInteractiveLayer` — chat widget + `MobileStickyBar` + emergency alert

### Slim Layout (Auth)

**Component:** `SlimLayout` (`src/components/SlimLayout.tsx`)

- Split layout: form column + background image
- Form: `max-w-md` / `md:w-96`, centered
- Image: `lg:block`, full-height cover

---

## 6. Component Library

### Core Components

| Component | Purpose |
|-----------|---------|
| `Button` | Link/button with `solid`/`outline` variants, `slate`/`blue`/`white` colors |
| `Container` | Max-width wrapper with responsive padding |
| `Header` | Top bar + main nav; mobile Popover menu |
| `Footer` | 4-column grid, Prime Group strip, copyright |
| `Hero` | Full-height hero with grid overlay, status stamps, CTA |
| `PrimaryFeatures` | Tabbed “System Architecture” section (dark theme) |
| `SecondaryFeatures` | 3-column “Why Choose Us” cards |
| `CallToAction` | Financing + “Commence Operations” CTA |
| `Testimonials` | 3-column testimonial cards |
| `Faqs` | 3-column FAQ grid |
| `FinancingBanner` | Amber finance strip |
| `Fields` | `TextField`, `SelectField` (gray-200/gray-50 forms) |
| `SlimLayout` | Auth split layout |
| `MobileStickyBar` | Fixed bottom bar (Call / Book) on mobile |
| `AIInteractiveLayer` | Chat widget + emergency triage |

### AI Components (`@prime/ui-ai`)

- `FormFields`, `AIProcessingOverlay`, `CrossSellPromptCard`
- Used by `LeadCaptureForm`

### Headless UI

- `Popover`, `PopoverButton`, `PopoverBackdrop`, `PopoverPanel` — mobile nav

---

## 7. Page Patterns

### Home Page Sections

| Section | ID | Style |
|--------|-----|-------|
| Hero | — | White, full-height, grid overlay |
| PrimaryFeatures | `#services` | Dark (`slate-950`), circuit grid |
| SecondaryFeatures | `#secondary-features` | White |
| CallToAction (financing) | `#financing` | Dark |
| CallToAction (CTA) | `#contact-cta` | Light (`slate-100`) |
| Testimonials | `#testimonials` | `slate-50` |
| Contact form | `#contact` | `slate-50` |
| Faqs | `#faq` | `slate-50` |

### Visual Motifs

- **Grid overlays:** `linear-gradient` circuit/grid patterns, low opacity
- **Status stamps:** Green ping dot + “System Online” + “Auckland // NZ”
- **Eyebrow rules:** Horizontal line + mono label (e.g. “Master Electricians NZ”)
- **Terminal-style CTAs:** `> Initiate Diagnostic`, `> Load Full Schematic`

---

## 8. Interactive States

### Button (`Button.tsx`)

| State | Styles |
|-------|--------|
| Default | `bg-slate-900`, `bg-blue-600`, etc. |
| Hover | `hover:bg-slate-700`, `hover:bg-blue-500` |
| Active | `active:bg-slate-800`, `active:bg-blue-800` |
| Focus | `focus-visible:outline-2 focus-visible:outline-offset-2` |

### Header / Nav

- `NavLink`: `hover:text-slate-900`
- `CTA`: `hover:bg-slate-800`
- Mobile `PopoverButton`: `hover:bg-slate-50`
- Popover panel: `data-closed:scale-95 data-closed:opacity-0` + transitions

### PrimaryFeatures Tabs

- Active: `border-blue-500 bg-blue-500/10 text-blue-400`
- Inactive: `border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300`

### Footer Links

- `hover:text-white`, `hover:fill-white`

### Form Fields (`Fields.tsx`)

- `focus:border-blue-500 focus:bg-white focus:ring-blue-500`

### MobileStickyBar

- `active:bg-blue-700`, `active:bg-slate-700`

---

## 9. Design Tokens Summary

| Category | Tokens |
|----------|--------|
| Colors | `brand-primary`, `brand-primary-hover`, `brand-accent`, `brand-dark`, `brand-light`, `brand-muted` |
| Typography | `font-sans`, `font-display`; `text-xs` … `text-9xl` |
| Radius | `--radius-4xl: 2rem` |
| Container | `--container-2xl: 40rem` |
| Z-index | `--z-overlay: 100` |

---

## 10. Anomalies & Gaps

1. **Brand tokens vs. usage:** `--color-brand-*` exist but components mostly use raw Tailwind colors (`blue-600`, `slate-900`).
2. **Form styling:** `Fields.tsx` uses `gray-*`; rest of site uses `slate-*`.
3. **Email mismatch:** Footer uses `info@theprimeelectrical.co.nz`; CallToAction uses `info@theprimeelectrical.co.nz`; content files use `sales@theprimeelectrical.co.nz`.
4. **MobileStickyBar:** Present in `AIInteractiveLayer` but `MobileStickyBar` is hidden when `isEmergency` (emergency triage active).
5. **No shared design tokens doc:** Tokens are in CSS; no single source of truth for component usage.
