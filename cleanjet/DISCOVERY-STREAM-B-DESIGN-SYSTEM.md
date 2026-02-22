# Stream B — Design System Report

**Project:** CleanJet  
**Scan Date:** 2026-02-23  
**Scope:** `F:/Prime/cleanjet` — components, styling, tokens, patterns

---

## 1. Component Library

### 1.1 Core Components

| Component | Path | Purpose |
|-----------|------|---------|
| `Button` | `src/components/Button.tsx` | Primary CTA; supports `variant` (solid/outline), `color` (slate/blue/white), `href` or `button` |
| `Container` | `src/components/Container.tsx` | Max-width wrapper: `max-w-7xl px-4 sm:px-6 lg:px-8` |
| `Logo` | `src/components/Logo.tsx` | Brand mark |
| `NavLink` | `src/components/NavLink.tsx` | Header nav link |
| `Fields` | `src/components/Fields.tsx` | `TextField`, `SelectField` — form inputs with labels |
| `SlimLayout` | `src/components/SlimLayout.tsx` | Auth/404 layout — split panel with background image |

### 1.2 Layout & Shell

| Component | Path | Purpose |
|-----------|------|---------|
| `Header` | `src/components/Header.tsx` | Sticky nav, promo bar, desktop/mobile nav, Book Now CTA |
| `Footer` | `src/components/Footer.tsx` | 4-column grid: brand, services, company, contact; Prime Group cross-links |
| `SlimLayout` | `src/components/SlimLayout.tsx` | Centered form panel + full-bleed background image |

### 1.3 Section Components

| Component | Path | Purpose |
|-----------|------|---------|
| `Hero` | `src/components/Hero.tsx` | Hero + BookingWizard inline |
| `PrimaryFeatures` | `src/components/PrimaryFeatures.tsx` | Services grid (4 cards) + How It Works (5 steps) |
| `SecondaryFeatures` | `src/components/SecondaryFeatures.tsx` | Operating Standard (3 items) |
| `Pricing` | `src/components/Pricing.tsx` | 3-tier pricing, one-off/weekly toggle |
| `Testimonials` | `src/components/Testimonials.tsx` | Social proof |
| `CallToAction` | `src/components/CallToAction.tsx` | AKF cross-sell + final CTA |
| `Faqs` | `src/components/Faqs.tsx` | FAQ grid (3 columns) |

### 1.4 Booking & AI

| Component | Path | Purpose |
|-----------|------|---------|
| `BookingWizard` | `src/components/BookingWizard.tsx` | 3-step flow: RoomSelector → DatePicker → ConfirmReview |
| `SubscriptionToggle` | `src/components/SubscriptionToggle.tsx` | One-off vs weekly toggle |
| `AIUpsellCard` | `src/components/AIUpsellCard.tsx` | AI upsell |
| `AIInteractiveLayer` | `src/components/AIInteractiveLayer.tsx` | AI chat layer |
| `MobileStickyBar` | `src/components/MobileStickyBar.tsx` | Mobile sticky CTA |

### 1.5 BookingWizard Subcomponents

| Component | Path |
|-----------|------|
| `WizardProgressBar` | `BookingWizard/WizardProgressBar.tsx` |
| `RoomSelector` | `BookingWizard/RoomSelector.tsx` |
| `DatePicker` | `BookingWizard/DatePicker.tsx` |
| `ConfirmReview` | `BookingWizard/ConfirmReview.tsx` |

### 1.6 Dependencies

- **UI:** `@headlessui/react` (Popover for mobile nav)
- **Styling:** `clsx` for conditional classes
- **Forms:** `@tailwindcss/forms` plugin
- **AI:** `@prime/ui-ai` (AI chat widget)

---

## 2. Styling & Color Tokens

### 2.1 Tailwind Theme (`src/styles/tailwind.css`)

```css
@theme {
  /* Typography scale */
  --text-xs through --text-9xl (with line-heights)
  --font-sans: var(--font-inter)
  --font-display: var(--font-lexend)

  /* Radius */
  --radius-4xl: 2rem

  /* Container */
  --container-2xl: 40rem

  /* CleanJet brand tokens */
  --color-brand-primary: oklch(0.60 0.20 225)
  --color-brand-primary-hover: oklch(0.55 0.20 225)
  --color-brand-accent: oklch(0.68 0.18 145)
  --color-brand-accent-hover: oklch(0.63 0.18 145)
  --color-brand-dark: oklch(0.18 0.06 225)
  --color-brand-light: oklch(0.96 0.03 225)

  /* Z-index */
  --z-overlay: 100
}
```

**Note:** Brand tokens are defined but **not widely used** in components. Components mostly use Tailwind palette (sky, slate, emerald, etc.).

### 2.2 Color Palette in Use

| Usage | Colors |
|-------|--------|
| **Primary / CTA** | `sky-500`, `sky-600`, `sky-700`, `sky-50`, `sky-100`, `sky-200` |
| **Neutrals** | `slate-50`–`slate-900`, `gray-200`–`gray-900` |
| **Dark sections** | `slate-900` (Pricing, CTA, Footer) |
| **Accents** | `emerald-400`–`emerald-900` (eco badge, success), `violet`/`purple`/`amber`/`orange` (service card gradients) |
| **Form** | `gray-200`, `gray-50`, `blue-500` (focus) |

### 2.3 Typography

| Font | Variable | Usage |
|------|----------|-------|
| **Inter** | `--font-inter` | Body, UI |
| **Lexend** | `--font-display` | Headings, brand |

**Scale:** `text-xs` → `text-9xl` (Tailwind default scale + custom line-heights in `@theme`).

**Conventions:**
- Section labels: `text-xs font-bold uppercase tracking-widest text-sky-600`
- H1: `font-display text-5xl sm:text-7xl`
- H2: `font-display text-3xl sm:text-4xl`
- Body: `text-sm`–`text-lg`, `text-slate-600` / `text-slate-700`

---

## 3. Spacing & Layout

### 3.1 Container

- **Main:** `max-w-7xl px-4 sm:px-6 lg:px-8` (via `Container`)
- **Narrow:** `max-w-xl`, `max-w-2xl`, `max-w-3xl` for centered content
- **SlimLayout:** `max-w-md` / `md:w-96` for auth forms

### 3.2 Section Spacing

| Pattern | Classes |
|---------|---------|
| Section padding | `py-16 sm:py-24` or `py-20 sm:py-28` / `py-32` |
| Section gap | `gap-6`, `gap-8`, `gap-10`, `gap-12` |
| Grid gap | `gap-6`, `gap-8`, `gap-x-8` |

### 3.3 Grid Patterns

- **Services:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **How It Works:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`
- **Pricing:** `grid-cols-1 lg:grid-cols-3`
- **FAQ:** `grid-cols-1 lg:grid-cols-3`
- **Footer:** `grid-cols-1 lg:grid-cols-4`

---

## 4. Page Patterns

### 4.1 Home Page Structure

```
Header (sticky)
AIUpsellCard
main
  Hero (BookingWizard inline)
  #booking (SubscriptionToggle + BookingWizard)
  PrimaryFeatures (#services + #how-it-works)
  SecondaryFeatures (#why-cleanjet)
  Pricing (#pricing)
  Testimonials (#testimonials)
  CallToAction (AKF cross-sell + final CTA)
  Faqs (#faq)
Footer
AIInteractiveLayer
```

### 4.2 Slim Layout (Auth / 404)

- Centered form panel (`max-w-md`)
- Full-bleed background image on `lg:` breakpoint
- White panel with `shadow-2xl`
- Logo + form content

### 4.3 Section Alternation

- `bg-white` → `bg-slate-50` → `bg-slate-900` (Pricing, CTA)
- Borders: `border-slate-100`, `border-slate-200`, `border-sky-100`

---

## 5. Interactive States

### 5.1 Button

| State | Classes |
|-------|---------|
| Default | `bg-sky-600`, `bg-blue-600`, etc. |
| Hover | `hover:bg-sky-500`, `hover:bg-slate-700` |
| Active | `active:bg-slate-800`, `active:bg-blue-800` |
| Focus | `focus-visible:outline-2 focus-visible:outline-offset-2` |

### 5.2 Links

- Nav: `hover:text-sky-600 hover:bg-slate-50`
- Footer: `hover:text-white`, `hover:text-slate-400`
- Mobile nav: `hover:text-sky-600 hover:bg-sky-50`

### 5.3 Form Inputs (Fields.tsx)

- Default: `border-gray-200 bg-gray-50`
- Focus: `focus:border-blue-500 focus:bg-white focus:ring-blue-500`

### 5.4 Cards

- Service cards: `hover:shadow-lg hover:-translate-y-1`
- Pricing toggle: Active pill `bg-white text-slate-900` vs inactive `text-slate-400 hover:text-white`

### 5.5 Headless UI (Mobile Nav)

- `PopoverBackdrop`: `bg-slate-900/60 backdrop-blur-sm`
- `PopoverPanel`: `data-closed:scale-95 data-closed:opacity-0`, transition `duration-150`

---

## 6. Border Radius

| Element | Radius |
|--------|--------|
| Buttons, pills | `rounded-full` |
| Service cards | `rounded-3xl` |
| Form inputs | `rounded-md` |
| Eco badge | `rounded-full` |
| Header logo box | `rounded-none` (explicit) |
| Mobile nav CTA | `rounded-full` |

**Note:** `--radius-4xl: 2rem` is defined but rarely used; most use `rounded-3xl` or `rounded-full`.

---

## 7. Shadows

| Usage | Classes |
|-------|---------|
| Header | `shadow-sm` |
| Service cards | `shadow-sm`, `hover:shadow-lg` |
| SlimLayout panel | `shadow-2xl` |
| Step circles | `shadow-lg shadow-sky-600/30` |

---

## 8. Z-Index

| Layer | Value |
|-------|-------|
| Header | `z-50` |
| Mobile nav backdrop | `z-40` |
| Mobile nav panel | `z-50` |
| Theme | `--z-overlay: 100` |

---

## 9. Responsive Breakpoints

Standard Tailwind: `sm:`, `md:`, `lg:`, `xl:`.

| Pattern | Breakpoint |
|---------|------------|
| Mobile nav | Hidden `md:flex` for desktop |
| Promo bar | `hidden sm:block` |
| SlimLayout image | `hidden sm:contents lg:block` |
| Grid columns | `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4` |

---

## 10. Anomalies & Inconsistencies

1. **Brand tokens vs. palette:** `--color-brand-*` exist but components use `sky-*`, `slate-*` directly.
2. **Gray vs. slate:** `Fields.tsx` uses `gray-*`; most UI uses `slate-*`.
3. **Phone number:** `0800 000 000` in UI vs `(09) 215-2900` in `websiteinfo.md`.
4. **Button colors:** `Button` supports `blue`/`slate`/`white`; Header/CTA use `sky-600` inline.
5. **Pricing section:** Uses `slate-900` + `sky-600`; Plan component uses `text-white` (assumes dark bg).

---

## 11. Summary for Implementation

| Category | Summary |
|----------|---------|
| **Component library** | Button, Container, Fields, Header, Footer, SlimLayout + 10+ section components |
| **Styling** | Tailwind v4, `@theme` with brand tokens (underused), Inter + Lexend |
| **Colors** | Sky primary, slate neutrals, emerald accent, service-specific gradients |
| **Layout** | `max-w-7xl` container, section `py-20`–`py-32`, grid patterns |
| **Interactive** | Hover/focus/active on buttons/links; Headless UI for mobile nav |
| **Radius** | `rounded-full` (CTAs), `rounded-3xl` (cards), `rounded-md` (inputs) |
