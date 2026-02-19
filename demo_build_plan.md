# Demo Build Plan — United Trades (3 Sites)

> **Govening rule:** `.cursor/rules/demo-ui.mdc` — all UI code must use Salient template components and tailwind-plus-commit tokens. No generic Tailwind patterns.
> **Template base:** `tailwind-plus-salient/salient-ts/` — copy this directory as the starting point for each site.
> **Competitor reference:** `Websites.md` — benchmark against Auckland competitors before finalising copy and layout.

---

## Architecture Overview

All 3 sites share:
- **Framework:** Next.js 15 App Router + TypeScript
- **Styling:** Tailwind CSS v4 — theme tokens in `src/styles/tailwind.css` per site
- **Component base:** `tailwind-plus-salient/salient-ts/src/components/`
- **Mobile sticky CTA:** All 3 sites get a fixed footer bar on mobile (Call Now / Book Online)
- **Hub footer:** All 3 sites get a "Part of the Prime Group" cross-link section above the main footer

---

## Project 1 — The Prime Electrical (Redesign)

**Positioning:** Modern, tech-forward electrical company with Solar, Heat Pumps & Smart Home as growth verticals.
**Brand tone:** Professional, technical, future-focused. "We power the next generation of NZ homes."
**Color identity:** Electric blue (`oklch(0.52 0.26 255)`) + yellow accent (`oklch(0.85 0.18 90)`)

### Salient Components to Use

| Component | Usage |
|-----------|-------|
| `Header.tsx` | Keep structure; update nav links to: Services, Solar, Smart Home, About, Contact |
| `Hero.tsx` | Replace "Trusted by" logos with: Master Electricians NZ, SEANZ, Xero certified. Replace dual CTA with: "Get a Free Solar Quote" (primary) + "Call Now" (secondary) |
| `PrimaryFeatures.tsx` | 3 tabs: Electrical Services / Solar & Renewables / Smart Home & Automation. Blue background retained. |
| `SecondaryFeatures.tsx` | 3 columns: Heat Pumps, EV Charging, Security Systems — icon + description cards |
| `CallToAction.tsx` | "Don't lose another lead after hours — our AI answers every call" + "See How It Works" button |
| `Testimonials.tsx` | 3 customer quotes — focus on Solar ROI stories and smart home installs |
| `Faqs.tsx` | 6 FAQs: Solar rebates NZ, installation time, smart home compatibility, EV charger types, heat pump brands, financing options |
| `Pricing.tsx` | Repurpose as "Service Packages": Basic Electrical / Heat Pump & Solar / Smart Home Premium |
| `Footer.tsx` | Add "Part of the Prime Group: AKF Construction | CleanJet" cross-links |

### AI Feature Placement

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION                                            │
│  H1: "Auckland's Solar & Smart Home Electricians"        │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🤖 INSTANT SOLAR QUOTE CALCULATOR              │    │
│  │  [ Select: House size ] [ Monthly power bill ]  │    │
│  │  [ Postcode            ] [ Get My Free Quote → ]│    │
│  └─────────────────────────────────────────────────┘    │
│  Sub: "No obligation. Estimate in 30 seconds."           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  FINANCING BANNER (below hero, above features)           │
│  "Finance your solar install from $0 upfront —          │
│   Q Mastercard & GEM Visa accepted"                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  PRIMARY FEATURES (tabbed)                               │
│  Tab 1: Electrical | Tab 2: Solar | Tab 3: Smart Home    │
│  Each tab: feature screenshot + 4 bullet points          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  CTA SECTION                                             │
│  "Missed calls = missed jobs. Our AI voice receptionist  │
│   answers after hours for all 3 of our brands."          │
│  [ Learn About Our AI System ]                           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  MOBILE STICKY FOOTER (sm: hidden)                       │
│  [📞 Call Now]          [📅 Book Online]                │
└─────────────────────────────────────────────────────────┘
```

**AI Component:** Inline quote calculator in hero (not a modal). Fields: `SelectField` from `Fields.tsx` for house size and bill range. On submit → POST to `/api/leads` → Make.com webhook → GPT-4o estimates ROI → email sent to customer + lead logged in Supabase.

### Immediate Fixes (Pre-Redesign Checklist)
- [ ] Hardcode "10+ Years Experience" in the stats counter (remove dynamic counter bug)
- [ ] Fix typos: "Competent" → "Competent", "Recommend" → "Recommend" (audit all body copy)
- [ ] Auto-format all prices to `$1,200.00` NZD format
- [ ] Add mobile sticky footer CTA bar
- [ ] Add financing banner above the fold

---

## Project 2 — AKF Construction (Redesign)

**Positioning:** High-end Auckland renovation, deck, and fencing specialists. Portfolio-first, trust-driven.
**Brand tone:** Solid, experienced, premium. "Built to last. Designed to impress."
**Color identity:** Warm slate (`oklch(0.35 0.03 240)`) + timber/earth accent (`oklch(0.65 0.12 55)`)

### Salient Components to Use

| Component | Usage |
|-----------|-------|
| `Header.tsx` | Nav links: Projects, Services, Decks & Fencing, About, Get a Quote |
| `Hero.tsx` | Full-bleed project hero photo. H1: "Auckland's Renovation Specialists". CTA: "View Our Projects" + "Get a Free Quote" |
| `PrimaryFeatures.tsx` | 3 tabs: Renovations / Decks & Outdoor / Fencing & Boundaries — each with project photos |
| `SecondaryFeatures.tsx` | Repurpose as Process Steps: 1. Consultation 2. Design 3. Build 4. Handover (CleanJet finish) |
| `Testimonials.tsx` | 3 client stories — "before we were embarrassed by our deck, now it's our favourite room" |
| `CallToAction.tsx` | "See our latest projects" — gallery CTA section |
| `Faqs.tsx` | Do you handle council permits? What materials do you use? Do you offer a warranty? |
| `Pricing.tsx` | NOT used — replace with "Get a Custom Quote" CTA section (construction pricing is not fixed) |
| `Footer.tsx` | "Part of the Prime Group: Prime Electrical | CleanJet" cross-links |

### AI Feature Placement

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION                                            │
│  Full-bleed project photo (deck/renovation)             │
│  H1: "Auckland's Renovation Specialists"                 │
│  [View Our Projects]   [Get a Free Quote]               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  BEFORE / AFTER SLIDER SECTION                          │
│  🤖 "Renovation Visualizer"                             │
│  [ ◀ Drag to Compare ▶ ]                                │
│  Before: Raw outdoor space → After: Completed deck       │
│  Caption: "3 bedroom home, Henderson — 14 days build"   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  SERVICES (PrimaryFeatures tabs)                         │
│  Tab 1: Renovations | Tab 2: Decks | Tab 3: Fencing     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  PROCESS TIMELINE (SecondaryFeatures repurposed)        │
│  Step 1 → Step 2 → Step 3 → Step 4                     │
│  "Consultation → Design → Build → Clean (CleanJet)"     │
│  CleanJet step is a cross-sell link                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  CONTACT / QUOTE SECTION                                 │
│  🤖 "Smart Quote Request"                               │
│  "Describe your project:" [text area]                   │
│  → AI reads submission → detects if electrical work     │
│     needed → auto-suggests Prime Electrical bundle      │
└─────────────────────────────────────────────────────────┘
```

**AI Component 1 — Before/After Slider:** CSS `clip-path` drag slider with two `next/image` layers. Not in Salient natively — propose as compatible alternative using absolute positioning + `input[type=range]` overlay.

**AI Component 2 — Smart Quote Form:** Textarea → POST to `/api/leads` → GPT-4o dependency check → If "electrical" keywords → auto-reply includes Prime Electrical bundle offer. All logged in Supabase with `cross_sell_flags`.

### Project Setup Notes
- [ ] Source 5–8 high-quality before/after project photos for slider
- [ ] Prepare project portfolio grid (min 9 projects for 3×3 grid)
- [ ] Timeline component: 4 steps, horizontal on desktop / vertical on mobile

---

## Project 3 — CleanJet (New Build)

**Positioning:** Fast, friendly, affordable residential cleaning in Auckland. Book in 60 seconds.
**Brand tone:** Fresh, energetic, trustworthy. "A sparkling home, without the hassle."
**Color identity:** Sky blue (`oklch(0.68 0.18 225)`) + fresh green accent (`oklch(0.72 0.18 145)`)

### Salient Components to Use

| Component | Usage |
|-----------|-------|
| `Header.tsx` | Nav links: Services, Pricing, How It Works, Reviews, Book Now |
| `Hero.tsx` | H1: "Auckland Home Cleaning — Book in 60 Seconds". Embed inline booking widget in hero. |
| `PrimaryFeatures.tsx` | 3 tabs: Regular Clean / Deep Clean / End of Tenancy — pricing and what's included |
| `SecondaryFeatures.tsx` | 3 columns: Vetted cleaners, Eco-friendly products, 100% satisfaction guarantee |
| `Pricing.tsx` | One-off vs Weekly subscription toggle. 3 house sizes: 1–2 bed / 3–4 bed / 5+ bed |
| `Testimonials.tsx` | "I've been using CleanJet weekly for 6 months — best thing I ever did" |
| `CallToAction.tsx` | "First clean 20% off — book before Friday" promotional CTA |
| `Faqs.tsx` | Do you bring your own products? Are cleaners insured? Can I skip a week? |
| `Footer.tsx` | "Part of the Prime Group: Prime Electrical | AKF Construction" cross-links |

### AI Feature Placement

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION                                            │
│  H1: "Auckland Home Cleaning — Book in 60 Seconds"       │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🤖 INSTANT PRICING CALCULATOR                  │    │
│  │  How many bedrooms? [ 1 ][ 2 ][ 3 ][ 4 ][ 5+ ] │    │
│  │  How often?  ○ One-off  ○ Weekly (save 20%)      │    │
│  │  [ See My Price →  $149 ]                        │    │
│  └─────────────────────────────────────────────────┘    │
│  Price updates live as user selects options              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  PRICING SECTION (Salient Pricing.tsx)                   │
│  [ One-off Clean ] ←toggle→ [ Weekly — Save 20% ]        │
│  1–2 bed: $99 / 3–4 bed: $149 / 5+ bed: $199           │
│  CTA per tier: "Book This Clean →"                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  🤖 BOOKING ASSISTANT (floating widget — bottom right)   │
│  Trigger: "Need help choosing?" button                   │
│  Widget: chat-style Q&A to guide to right package       │
│  Powered by: Vapi.ai text mode or simple decision tree  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  CROSS-SELL (below testimonials)                         │
│  "Had renovation work done? We specialise in            │
│   post-build cleans. Ask about our AKF bundle."         │
│  → Links to AKF Construction                            │
└─────────────────────────────────────────────────────────┘
```

**AI Component 1 — Live Price Calculator:** Client component (`'use client'`). State: `bedrooms` (1–5), `frequency` (one-off/weekly). Price computed client-side from a lookup table. On "Book" → pre-fills booking form with selections.

**AI Component 2 — Booking Assistant Widget:** Floating `<button>` fixed bottom-right. Expands to a `<dialog>` with a 3-step decision tree (bedrooms → frequency → date preference → confirmation). On complete → POST to `/api/leads` → Supabase + Make.com.

### Project Setup Notes
- [ ] Pricing lookup table: define per bedroom count × frequency in `src/lib/pricing.ts`
- [ ] Booking form: integrate with existing calendar system (TBC — Calendly or custom)
- [ ] Subscription flow: one-off vs recurring — clarify payment processor (Stripe TBC)
- [ ] First clean discount: promo code system or automatic if selected "Weekly"

---

## Shared Implementation Steps

### Step 1 — Scaffold the 3 Site Directories

```bash
# From f:\Prime\
cp -r tailwind-plus-salient/salient-ts prime-electrical
cp -r tailwind-plus-salient/salient-ts akf-construction
cp -r tailwind-plus-salient/salient-ts cleanjet
```

Each site gets its own:
- `package.json` (rename from `tailwind-plus-salient`)
- `.env.local` with its own Supabase/Make.com keys
- `src/styles/tailwind.css` with brand `@theme` tokens

### Step 2 — Per-Site Brand Token Setup

Each site's `src/styles/tailwind.css`:

```css
/* prime-electrical/src/styles/tailwind.css */
@import 'tailwindcss';
@plugin '@tailwindcss/forms';

@theme {
  --color-brand-primary: oklch(0.52 0.26 255);   /* Electric blue */
  --color-brand-accent: oklch(0.85 0.18 90);      /* Yellow */
  --color-brand-dark: oklch(0.18 0.04 255);       /* Near black */
  --font-display: 'Mona Sans', ui-sans-serif;
  --font-sans: 'Inter', ui-sans-serif;
}

/* akf-construction/src/styles/tailwind.css */
@theme {
  --color-brand-primary: oklch(0.35 0.03 240);   /* Warm slate */
  --color-brand-accent: oklch(0.65 0.12 55);     /* Timber/earth */
  --color-brand-dark: oklch(0.15 0.02 240);
}

/* cleanjet/src/styles/tailwind.css */
@theme {
  --color-brand-primary: oklch(0.68 0.18 225);   /* Sky blue */
  --color-brand-accent: oklch(0.72 0.18 145);    /* Fresh green */
  --color-brand-dark: oklch(0.20 0.06 225);
}
```

### Step 3 — Component Customisation Order (Per Site)

Do in this order to avoid breaking changes cascading:

1. **Replace `Logo.tsx`** — New SVG logo per brand
2. **Update `Header.tsx`** — Nav links, CTA label
3. **Update `Hero.tsx`** — H1, sub-copy, CTAs, trust logos
4. **Replace `PrimaryFeatures.tsx`** — Tab labels, content, screenshots
5. **Update `SecondaryFeatures.tsx`** — Icons and feature descriptions
6. **Update `Testimonials.tsx`** — Real client quotes
7. **Update `Faqs.tsx`** — Industry-specific Q&A
8. **Update `Pricing.tsx`** — Tiers or replace with custom component
9. **Update `CallToAction.tsx`** — CTA copy and destination
10. **Update `Footer.tsx`** — Links + "Prime Group" cross-links section
11. **Add mobile sticky CTA** — New component: `MobileStickyBar.tsx`
12. **Add AI component** — Per-site AI widget (calculator / slider / bot)

### Step 4 — Shared Lead API Route

Create in each site (or extract to a shared package later):

```
src/app/api/leads/route.ts   ← POST handler
src/lib/supabase/server.ts   ← Supabase server client
src/lib/supabase/client.ts   ← Supabase browser client
src/lib/cross-sell.ts        ← Cross-sell keyword rules
```

Lead schema (Supabase):
```sql
brand: 'prime-electrical' | 'akf-construction' | 'cleanjet'
source: 'hero-calculator' | 'contact-form' | 'booking-assistant' | 'voice-ai'
cross_sell_flags: string[]  -- e.g. ['akf', 'cleanjet']
status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
```

### Step 5 — Mobile Sticky Bar (All Sites)

New shared component `MobileStickyBar.tsx`:

```tsx
// Implements compatible alternative to @tailwind-plus-commit fixed footer
// Not in Salient template natively

export function MobileStickyBar({
  phone,
  bookingUrl,
}: {
  phone: string
  bookingUrl: string
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex sm:hidden border-t border-brand-dark/20">
      <a
        href={`tel:${phone}`}
        className="flex flex-1 items-center justify-center gap-2 bg-brand-primary py-4 text-sm font-semibold text-white"
      >
        📞 Call Now
      </a>
      <a
        href={bookingUrl}
        className="flex flex-1 items-center justify-center gap-2 bg-brand-dark py-4 text-sm font-semibold text-white"
      >
        📅 Book Online
      </a>
    </div>
  )
}
```

### Step 6 — Hub Footer Cross-Links (All Sites)

Add above each site's `<Footer>`:

```tsx
// HubFooter.tsx — "Part of the Prime Group"
const GROUP_BRANDS = [
  { name: 'Prime Electrical', href: 'https://primeelectrical.co.nz', desc: 'Electrical & Solar' },
  { name: 'AKF Construction', href: 'https://akfconstruction.co.nz', desc: 'Renovations & Decks' },
  { name: 'CleanJet', href: 'https://cleanjet.co.nz', desc: 'Home Cleaning' },
]
// Render as a small 3-logo strip — hide current site's own logo
```

---

## Build Priority & Sequence

| Priority | Site | Reason |
|----------|------|--------|
| 🔴 1 | **Prime Electrical** | Existing site losing leads — Phase 1 immediate fixes first, then redesign |
| 🟠 2 | **CleanJet** | New build — simpler scope, fast win, proves the AI booking concept |
| 🟡 3 | **AKF Construction** | Portfolio-heavy — needs real project photos before site can go live |

### Week-by-Week

| Week | Task |
|------|------|
| 1 | Prime Electrical: immediate fixes (counter, typos, pricing, sticky CTA, SMS fallback) |
| 2 | Prime Electrical: Salient redesign — Hero + PrimaryFeatures + Solar Quote Calculator |
| 3 | CleanJet: Scaffold + brand tokens + Hero + Pricing Calculator |
| 4 | CleanJet: Booking assistant widget + contact form → Supabase + Make.com |
| 5 | AKF Construction: Scaffold + brand tokens + Hero + Before/After Slider |
| 6 | AKF Construction: Smart Quote Form + cross-sell AI integration |
| 7 | All 3: Cross-link Hub Footer, shared lead API, Supabase schema live |
| 8 | All 3: QA, mobile testing, Core Web Vitals audit, deploy to Vercel |

---

## Competitor Benchmarks to Beat

Before finalising layout and copy for each site, review these Auckland competitors from `Websites.md`:

**Electrical:** epservices.co.nz, livewireelectrical.co.nz, purepower.nz, zenenergy.co.nz
**Construction:** argon.co.nz, grandrenovations.co.nz, highmarkhomes.co.nz, evolutionbuilders.co.nz
**Cleaning:** thelocalguyscleaning.co.nz, kiwicleanhome.co.nz, lifemaideasy.nz

Key gaps to exploit: most competitors have no AI features, no instant pricing, no cross-brand bundling, and poor mobile UX.

---

## Open Questions

Before building, confirm:
- [ ] Is the Prime Electrical existing site a WordPress/Wix rebuild or does code exist to migrate?
- [ ] Which job management tool is confirmed — Simpro, Fergus, or Tradify?
- [ ] Are Twilio phone numbers purchased for all 3 brands?
- [ ] Is Vapi.ai account set up? Voice AI is Phase 3 but needs account provisioning now
- [ ] What payment processor for CleanJet subscriptions — Stripe or other?
- [ ] Are project photos available for AKF Construction portfolio?
- [ ] What is the target domain for each site?
