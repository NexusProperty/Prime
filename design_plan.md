# Design Plan — United Trades (3 Websites)

> **Governing rule:** `.cursor/rules/demo-ui.mdc`
> **Component base:** Tailwind Salient (`tailwind-plus-salient/salient-ts/`)
> **Reference sites:** theprimeelectrical.co.nz · akfconstruction.co.nz · purepower.nz · lifemaideasy.nz

---

## Design Philosophy (All 3 Sites)

**The gap we are closing:** Every Auckland competitor site in `Websites.md` is either dated (WordPress with stock photos), over-designed (too much happening), or under-converted (no clear CTA hierarchy). The 3 Prime Group sites will be:

- **Modern but familiar** — clients who know the old sites will recognise the brand, not feel lost
- **Content-first** — hero section answers "what do you do, where, and why you?" in under 3 seconds
- **Conversion-obsessed** — every section has one primary CTA; mobile sticky bar eliminates dead scroll
- **Shared DNA** — same font stack and layout grid, different color palette per brand, unified footer strip

---

## Site 1 — The Prime Electrical

### Brand Analysis (from theprimeelectrical.co.nz)
**What exists:**
- Blue brand color (retained) — customers already associate it with Prime
- Services listed: Electrical, Heat Pumps, Solar, Smart Home Automation, Healthy Homes Assessment
- Financing already offered: Q Mastercard, GEM Visa, ANZ, Westpac Warm Up Loan
- Real testimonials exist (Aman Grewal, Chaiwala, Lorraine Coller, Hayden Debenham etc.)
- Stats counter exists but has bug ("0+" showing instead of real numbers)
- Real phone: **09-390-3620**
- Address: **Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013**
- Heat pump products shown: Panasonic Z25VKR ($1,067.20), GREE Lomo ($919), Daikin FTXV35U ($1,133.59)

**What to keep from old site:**
- Blue as primary brand color
- Services structure (Electrical / Heat Pumps / Solar / Smart Home)
- Financing section
- Testimonials (real ones, from the site)
- Stats (fix to show real numbers)

**What to upgrade:**
- Hero: Replace generic "#keeping you wired" with punchy outcome-led headline
- Remove the clunky sliding testimonial widget → static 3-column Salient grid
- Remove the product price grid (heat pumps) from homepage → move to dedicated service page
- Fix stat counters to real numbers
- Add mobile sticky CTA bar (huge gap in current site)

### Color System

```css
/* prime-electrical/src/styles/tailwind.css @theme */
--color-brand-primary: oklch(0.52 0.26 255);    /* Electric blue — matches existing brand */
--color-brand-primary-hover: oklch(0.47 0.26 255);
--color-brand-accent: oklch(0.82 0.19 90);       /* Warm yellow — solar/energy associations */
--color-brand-dark: oklch(0.16 0.04 255);        /* Near-black with blue tint */
--color-brand-light: oklch(0.96 0.02 255);       /* Light blue tint for bg sections */
--color-brand-muted: oklch(0.60 0.10 255);       /* Softer blue for secondary text */
```

### Typography
| Role | Font | Weight | Size |
|------|------|--------|------|
| H1 Hero | Lexend (`font-display`) | 500 | `text-5xl` → `text-7xl` |
| H2 Section | Lexend (`font-display`) | 500 | `text-3xl` → `text-5xl` |
| H3 Card | Lexend (`font-display`) | 500 | `text-lg` |
| Body | Inter (`font-sans`) | 400 | `text-base` (`1rem / 1.75rem`) |
| Label / Badge | Inter (`font-sans`) | 600 | `text-sm uppercase tracking-widest` |

### Section-by-Section Design Spec

#### 1. Announcement Bar (new — above header)
```
bg: amber-50  border-b: amber-200
"💳 Finance from $0 upfront — Q Mastercard & GEM Visa accepted   [Learn More →]"
text-sm font-medium text-amber-800 | hidden on mobile (conserve space)
```

#### 2. Header / Nav
```
bg: white  shadow: shadow-sm  position: sticky top-0 z-50
Logo: "Prime Electrical" wordmark — replace with SVG logo when available
Nav links: Services · Solar & Heat Pumps · Smart Home · Reviews · [Get a Free Quote →]
CTA button: bg-blue-600 text-white rounded-full px-4 py-2 "Get a Free Quote"
Mobile: hamburger → Headless UI Popover panel (existing pattern)
```

#### 3. Hero Section
```
Layout: centered text, max-w-4xl headline
bg: white

H1: "Auckland's Solar & Smart Home Electricians"
    Underline decoration on "Solar & Smart Home" (existing Salient SVG wave, blue-300/70)
Subheadline: "10+ years powering Auckland homes. From emergency electrical to solar
              installs, heat pumps, and full smart home automation — one trusted team."

CTAs:
  Primary:   [Get a Free Solar Quote] — bg-blue-600 rounded-full
  Secondary: [📞 09-390-3620] — outline-slate rounded-full

Financing badge: rounded-2xl bg-amber-50 ring-1 ring-amber-200
  "💳 Finance your solar install from $0 upfront — Q Mastercard & GEM Visa accepted"

Stats bar (3 columns, below CTAs):
  10+  Years Experience   |   500+  Solar Installs   |   5★  Google Rating
  font-display text-4xl text-blue-600

Certification strip:
  "Certified & accredited"
  Pill badges: [MENZ] [SEANZ] [REI] [Xero]
  bg-slate-100 rounded-lg px-4 text-xs font-semibold uppercase text-slate-600
```

#### 4. Services (PrimaryFeatures — tabbed)
```
bg: blue-600  (dark blue — existing Salient pattern, retained)
Section title: "Everything your home needs — one trusted team."

Tab 1 — Electrical Services
  Bullets: Switchboard upgrades · Lighting (internal & external) · Safety inspections · Healthy Homes assessments · Emergency callouts
Tab 2 — Solar & Heat Pumps
  Bullets: Solar panel systems (SEANZ certified) · Battery storage (Tesla Powerwall, Enphase) · Heat pump supply & install · EV charger installation
Tab 3 — Smart Home & Automation
  Bullets: Smart lighting & scenes · Security cameras & alarms · Whole-home automation · AV & network wiring
```

#### 5. Why Choose Us (SecondaryFeatures — 3 columns)
```
bg: white

Col 1 — Heat Pumps
  Icon: thermometer SVG (blue icon box)
  Title: "Heat Pump Specialists"
  Summary: "Daikin, Panasonic & Mitsubishi — best price guaranteed"

Col 2 — Solar & EV
  Icon: solar panel SVG
  Title: "Solar & EV Ready"
  Summary: "SEANZ certified installers, finance from $0 upfront"

Col 3 — Smart Home
  Icon: home SVG
  Title: "Smart Home Experts"
  Summary: "Apple HomeKit, Google Home & Alexa compatible installs"
```

#### 6. Financing Banner (CallToAction variant)
```
bg: slate-900
"Looking for finance options?"
Body: "ANZ interest-free heat pump loans · Westpac Warm Up Loan · GEM Visa 6 months interest-free · Q Mastercard 3+ months zero interest"
CTA: [Talk to Us About Finance] — white solid button
```

#### 7. Testimonials
```
bg: slate-50
Heading: "Trusted by Auckland homeowners"
Use real testimonials from the existing site:

Card 1 — Chaiwala:
  "Max and team are a bunch of professional young guys with solid expertise...
   Competent pricing, probably the best in the market."

Card 2 — Hayden Debenham:
  "Very thorough and reasonable priced... couldn't recommend them more,
   and will continue to use them for electrical work."

Card 3 — Lorraine Coller:
  "Came to fit the heat pump very quickly. Arrived on time. Very well priced
   and efficient. I have already recommended this company to others."
```
> Note: Fix the typos from the original site — "Competant" → "Competent", "recommen" → "recommend"

#### 8. FAQ
```
bg: slate-50 (with faint background image)
Heading: "Frequently asked questions"

Q1: How much does solar cost in Auckland?
Q2: How long does a heat pump installation take?
Q3: Do you offer a workmanship guarantee?
Q4: Can you finance a solar system for me?
Q5: What smart home systems do you work with?
Q6: Do you handle emergency electrical callouts?
```

#### 9. Final CTA
```
bg: blue-600
"Never miss a job again"
"Our AI voice receptionist answers your calls 24/7 — taking bookings while you're on the tools."
CTAs: [Get a Free Solar Quote] · [📞 09-390-3620]
```

#### 10. Footer
```
bg: slate-50
Logo wordmark | Nav links | Social icons (Facebook)
Prime Group strip: "Part of the Prime Group: AKF Construction · CleanJet"
Copyright: "© 2026 Prime Electrical Ltd. All rights reserved."
Address: "Unit 2, 41 Smales Road, East Tāmaki, Auckland 2013"
```

#### 11. Mobile Sticky Bar
```
[📞 Call Now — 09-390-3620]   [📅 Book Online]
bg-blue-600 / bg-slate-900  |  sm:hidden
```

---

## Site 2 — AKF Construction

### Brand Analysis (from akfconstruction.co.nz)
**What exists:**
- Logo: AKF wordmark (existing logo file available)
- Color: Currently a light/neutral palette — feels dated
- Services: Deck Construction, Fence Construction, Painting, New Build, Home Renovation, Landscaping
- Testimonials: Priya S. (renovation), Sarah K. (deck), Jonathan T. (fence)
- Real phone: **09-951-8763**
- Email: **info@akfconstruction.co.nz**
- Address: **2/41 Smales Road, East Tāmaki, Auckland 2013** (same as Prime)
- Business hours: Mon–Fri 8am–5pm

**What to keep:**
- "Built on Trust. Driven by Quality." tagline
- The 6 service categories
- Real testimonials (all 3)

**What to upgrade:**
- Whole visual identity needs lifting — current Wix site looks like a template
- Dark/premium palette to match the quality of work
- Portfolio section is critical — the site shows services but no photos of completed work
- No mobile sticky bar on current site (missed calls)

### Color System

```css
/* akf-construction/src/styles/tailwind.css @theme */
--color-brand-primary: oklch(0.32 0.03 240);    /* Deep slate — professional, solid */
--color-brand-primary-hover: oklch(0.28 0.03 240);
--color-brand-accent: oklch(0.65 0.14 55);       /* Warm amber/timber — craft, warmth */
--color-brand-accent-hover: oklch(0.60 0.14 55);
--color-brand-dark: oklch(0.13 0.02 240);        /* Near-black for hero overlay */
--color-brand-light: oklch(0.97 0.01 55);        /* Warm off-white for light sections */
```

### Section-by-Section Design Spec

#### 1. Header / Nav
```
bg: white  position: sticky top-0 z-50  shadow: shadow-sm
Logo: AKF wordmark (dark slate)
Nav: Projects · Services · Decks & Fencing · About · [Get a Quote →]
CTA button: bg-slate-900 text-white rounded-full "Get a Quote"
```

#### 2. Hero Section
```
Layout: Full-bleed dark overlay hero with project photo background
bg: slate-900 + overlay (use CSS bg-cover on real project photo)
Overlay gradient: from-slate-900/70 to-slate-900/85

Eyebrow: "Auckland — Established 2010"
         text-amber-400 font-semibold uppercase tracking-widest

H1: "Built to last."
    "Designed to impress."
    font-display text-5xl→text-7xl text-white
    "Designed to impress." in text-amber-400

Subheadline (text-slate-300):
  "Renovations, decks, and fencing that Auckland homeowners are proud of.
   Premium materials, exceptional craftsmanship, on-time delivery."

CTAs:
  Primary:   [View Our Projects] — bg-white text-slate-900 rounded-full
  Secondary: [Get a Free Quote] — outline-white rounded-full

Stats bar (border-t border-white/10):
  15+  Years Building Auckland  |  200+  Projects Completed  |  5★  Google Rating
  font-display text-4xl text-amber-400
```

#### 3. Services Tabs (PrimaryFeatures)
```
bg: slate-800 (dark — premium feel)
Section title: "Craftsmanship that speaks for itself."

Tab 1 — Renovations
  Bullets: Kitchen & bathroom renovations · Open-plan conversions ·
           Council consent management · End-to-end project management

Tab 2 — Decks & Outdoor
  Bullets: Custom deck design & build · Pergolas & shade structures ·
           Composite & hardwood decking · 10-year structural guarantee

Tab 3 — Fencing & Landscaping
  Bullets: Horizontal slat privacy fencing · Pool fencing (compliance certified) ·
           Retaining walls · Automated gate installation · Landscape design
```

#### 4. Process Timeline (SecondaryFeatures — repurposed)
```
bg: white
Section title: "How it works"
Subheading: "A clear, professional process from first call to final handover."

Step 01 — Consultation:    "We visit your site, listen to your vision, quote within 48 hours."
Step 02 — Design & Consent: "Plans that meet Auckland Council requirements. We handle consent."
Step 03 — Build:            "On time. On budget. Weekly progress updates. Site kept clean."
Step 04 — Handover & Clean: "Post-build CleanJet clean included. Move back in from day one."
           → "Powered by CleanJet →" cross-sell link in amber-600

Desktop: horizontal steps with connector line
Mobile: vertical stacked cards
```

#### 5. Testimonials
```
bg: slate-50
Heading: "What Auckland homeowners say"

Card 1 — Priya S., East Tamaki:
  "We recently had our home renovated by AKF Construction, and the experience was seamless
   from start to finish. Exceptional workmanship. Highly recommend!"

Card 2 — Sarah K., Manukau:
  "I hired AKF Construction for a deck extension and couldn't be happier. Transparent with
   pricing, great design suggestions, and the final result looks fantastic."

Card 3 — Jonathan T., Flat Bush:
  "The AKF team built our new fence and driveway, completed on time and within budget.
   Friendly, efficient, and cleaned up thoroughly. Highly reliable!"
```

#### 6. Get a Quote CTA
```
bg: slate-900
"Ready to transform your home?"
"Free, no-obligation consultation and written quote within 48 hours. We come to you, anywhere in Auckland."
CTAs: [Get a Free Quote] · [View Our Projects]
```

#### 7. FAQ
```
Q1: Do you handle Auckland Council consents?
Q2: What materials do you use for decks?
Q3: Do you offer a structural guarantee?
Q4: Can you give me an online quote?
Q5: Do you do landscaping as well as construction?
Q6: How long does a renovation take?
```

#### 8. Footer
```
bg: slate-900 (dark footer — premium feel)
Logo | Nav | Social (Facebook, Instagram, LinkedIn)
Prime Group strip (border-t border-white/10): "Part of the Prime Group: Prime Electrical · CleanJet"
Contact: 09-951-8763 · info@akfconstruction.co.nz
Hours: Mon–Fri 8am–5pm
Copyright: "© 2026 AKF Construction Ltd."
```

#### 9. Mobile Sticky Bar
```
[📞 Call — 09-951-8763]   [📋 Get a Quote]
bg-slate-900 / bg-amber-600  |  sm:hidden
```

---

## Site 3 — CleanJet (New Build — No Existing Site)

### Design Direction (from competitor research)
**Reference: lifemaideasy.nz**
- Key pattern: Quick Estimate calculator as primary hero CTA
- Flat pricing listed clearly on pricing page
- Trust signals: 97-point system, insured, 98% applicant rejection rate
- Service categories: Ongoing, Deep Clean, End of Tenancy, Builders Clean

**What CleanJet needs (differentiated):**
- Faster booking than Life Maid Easy (60 seconds vs. contact form)
- Live pricing calculator (they have a calculator page; we put it IN the hero)
- Weekly subscription model prominently promoted (Life Maid Easy buries this)
- Connected to AKF for post-build cleans (unique cross-sell advantage)
- Friendlier, more energetic tone vs. the slightly corporate Life Maid Easy

### Color System

```css
/* cleanjet/src/styles/tailwind.css @theme */
--color-brand-primary: oklch(0.60 0.20 225);     /* Sky blue — clean, fresh, trustworthy */
--color-brand-primary-hover: oklch(0.55 0.20 225);
--color-brand-accent: oklch(0.68 0.18 145);      /* Fresh green — eco, clean associations */
--color-brand-accent-hover: oklch(0.63 0.18 145);
--color-brand-dark: oklch(0.18 0.06 225);        /* Deep navy for footer/dark sections */
--color-brand-light: oklch(0.96 0.03 225);       /* Very light blue for alternating sections */
```

### Section-by-Section Design Spec

#### 1. Announcement Bar
```
bg: sky-50  border-b: sky-200
"🎉 First clean 20% off — book before Friday  |  No lock-in contract. Cancel any time."
text-sm font-medium text-sky-700
```

#### 2. Header / Nav
```
bg: white  sticky top-0 z-50
Logo: CleanJet wordmark — sky-600 (design: spark/water drop icon + wordmark)
Nav: Services · Pricing · How It Works · Reviews · [Book Now →]
CTA button: bg-sky-600 text-white rounded-full "Book Now"
```

#### 3. Hero Section
```
Layout: centered, with embedded live pricing calculator card below headline
bg: white

Promo pill: "🎉 First clean 20% off — book before Friday"
            bg-sky-50 ring-1 ring-sky-200 text-sky-700 rounded-full inline-flex

H1: "Auckland Home Cleaning —"
    "Book in 60 Seconds"
    Wave underline on "60 Seconds" in sky-300/70

Subheadline (text-slate-700):
  "Vetted, insured cleaners. Eco-friendly products. 100% satisfaction guarantee.
   Your sparkling home, without the hassle."

Live Pricing Calculator card (bg-white shadow-xl ring-1 ring-slate-900/10 rounded-2xl p-6):
  Label: "How many bedrooms?"
  Options: [1–2 bed] [3–4 bed] [5+ bed]  (pill toggle buttons, sky-600 when selected)

  Label: "How often?"
  Options: [One-off clean]  [Weekly — Save ~20%]  (pill toggle)

  Price display: "$149 NZD" — font-display text-3xl
  Sub: "Per visit · includes GST"

  CTA: [Book This Clean →] — bg-sky-600 rounded-full

Note below: "No obligation. Cancel or reschedule any time."

Trust icons row (3 columns):
  ✅ Vetted cleaners   🌿 Eco-friendly   💯 Satisfaction guarantee
```

#### 4. Services Tabs (PrimaryFeatures)
```
bg: sky-600 (vibrant — energetic)
Section title: "The right clean for every home."

Tab 1 — Regular Clean
  Bullets: All rooms vacuumed & mopped · Bathrooms scrubbed & sanitised ·
           Kitchen surfaces & appliance exteriors · Beds made (on request)
  Best for: Weekly / fortnightly maintenance

Tab 2 — Deep Clean
  Bullets: Everything in Regular + · Inside oven & fridge ·
           Window sills & tracks · Skirting boards & ceiling fans
  Best for: Spring clean, post-renovation, new tenants

Tab 3 — End of Tenancy
  Bullets: Full deep clean · Oven, fridge & dishwasher interior ·
           Carpet steam clean (optional add-on) · Photo report provided
  Best for: Bond-back guarantee
```

#### 5. Why Choose CleanJet (SecondaryFeatures — 3 columns)
```
bg: white

Col 1 — Vetted & Insured
  Icon: shield-check SVG (sky-600 icon box)
  Title: "Vetted & fully insured"
  Summary: "Background-checked cleaners. Full liability insurance. Your home is in safe hands."

Col 2 — Eco Products
  Icon: leaf SVG
  Title: "Eco-friendly products"
  Summary: "Non-toxic, family and pet safe cleaning products. Good for your home and the planet."

Col 3 — Guaranteed
  Icon: badge-check SVG
  Title: "100% satisfaction guarantee"
  Summary: "Not happy? We'll reclean for free — no questions asked. Every single time."
```

#### 6. Pricing Section (Pricing.tsx — with billing toggle)
```
bg: slate-900 (dark — makes prices pop)
Heading: "Simple, transparent pricing."
Subheading: "No hidden fees. Choose your home size and how often you want us."

Toggle: [One-off clean]  ←→  [Weekly — Save ~20%]

Tier 1 — 1–2 Bedrooms:  One-off $99 / Weekly $79
Tier 2 — 3–4 Bedrooms:  One-off $149 / Weekly $119  (featured — sky-600 bg)
Tier 3 — 5+ Bedrooms:   One-off $199 / Weekly $159

Each tier CTA: [Book This Clean]
Footer note: "All prices include GST. Weekly plans billed fortnightly."
```

#### 7. Testimonials
```
bg: slate-50
Heading: "Auckland families love CleanJet"
Subheading: "100% satisfaction guarantee — or we reclean for free."

(Placeholder testimonials — to be replaced with real ones after launch)
Card 1 — Sarah M., Remuera:
  "I've been using CleanJet weekly for 3 months and my house has never been cleaner.
   The team are punctual, professional, and use lovely-smelling products."

Card 2 — James T., Flat Bush:
  "Booked online in under a minute. The cleaner arrived on time and did a
   thorough job. Already booked my next clean."

Card 3 — Priya K., Henderson:
  "Had them in after our AKF renovation — the post-build clean was incredible.
   Couldn't even tell builders had been there. Highly recommend the bundle."
```
> Note: Card 3 is a natural AKF cross-sell proof point — leave it in.

#### 8. First Clean CTA
```
bg: sky-600
Promo badge: "🎉 Limited offer — book this week"
Heading: "First clean 20% off"
Body: "Try CleanJet risk-free. Not happy? We'll reclean for free — no questions asked."
CTA: [Book My First Clean →] — white solid button
```

#### 9. AKF Cross-Sell Banner
```
bg: slate-100  (subtle, between testimonials and FAQ)
"Had renovation work done recently?"
"We specialise in post-build cleans. Ask about our AKF Construction bundle."
Link: [Learn About Our AKF Bundle →] in sky-600
```

#### 10. FAQ
```
Q1: Do you bring your own cleaning products?
Q2: Are your cleaners police-checked and insured?
Q3: Can I skip or reschedule a clean?
Q4: What's included in a regular clean?
Q5: Do you offer a bond-back guarantee for end of tenancy?
Q6: Do you clean after building or renovation work?
```

#### 11. Footer
```
bg: slate-50
Logo | Nav | Social (Facebook, Instagram)
Prime Group strip: "Part of the Prime Group: Prime Electrical · AKF Construction"
Contact: phone TBC · email TBC
Copyright: "© 2026 CleanJet Ltd. All rights reserved."
```

#### 12. Mobile Sticky Bar
```
[📞 Call Now]   [📅 Book Online]
bg-sky-600 / bg-slate-900  |  sm:hidden
```

---

## Shared Design System

### Font Loading (all 3 sites — `src/app/layout.tsx`)
```tsx
import { Lexend, Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })

// Apply both to <html> className
```
> This is the correct pattern from `salient-ts/src/app/layout.tsx` — Lexend maps to `--font-display`, Inter to `--font-sans`

### Spacing System
| Token | Value | Use case |
|-------|-------|----------|
| Section padding | `py-20 sm:py-32` | Every major section top/bottom |
| Container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | All content within sections |
| Card gap | `gap-6 sm:gap-8` | Grid of cards |
| Button padding | `py-2 px-4` (sm) / `py-3 px-6` (lg) | All buttons |

### Button System (from `Button.tsx`)
| Usage | Variant + Color | Example |
|-------|----------------|---------|
| Primary CTA | `solid` + `blue` / site color | "Get a Quote" |
| Secondary CTA | `outline` + `white` or `slate` | "View Projects" |
| On dark bg | `solid` + `white` | CTA sections |
| On light bg outline | `outline` + `slate` | Secondary actions |

### Accessibility Checklist (per demo-ui.mdc)
- [ ] All interactive elements minimum 44×44px touch target
- [ ] All images have descriptive `alt` text (`alt=""` for decorative)
- [ ] Focus rings visible (Tailwind `focus-visible:outline-2`)
- [ ] `aria-label` on all icon-only buttons
- [ ] Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- [ ] Color contrast: all text ≥ 4.5:1 against background (WCAG AA)

### Image Strategy
| Site | Hero | Services | Testimonials |
|------|------|----------|-------------|
| Prime Electrical | Photo of electrician working on solar panels / switchboard | Service screenshots → real work photos | Headshots of real customers (optional) |
| AKF Construction | Stunning completed deck or renovation project | Before/After per service tab | Customer property photos |
| CleanJet | Bright, clean kitchen after clean OR cleaner at work | Service type icons + clean room photos | Happy homeowner photos |

All images: `next/image` with `loading="lazy"` (below fold), `priority` (hero/above fold only).

---

## Implementation Order

### Step 1 — Update layout.tsx for font loading (all 3 sites)
Fix the Lexend + Inter font loading in each site's `src/app/layout.tsx`. Currently inherited from template but may have wrong variable names.

### Step 2 — Update real content in components (all 3 sites)
Per this plan:
- `Faqs.tsx` — replace TaxPal placeholder Q&A with trade-specific questions
- `Testimonials.tsx` — replace placeholder content with real testimonials
- `SecondaryFeatures.tsx` — Prime Electrical & CleanJet (still using template content)
- Phone numbers, addresses, emails in `Header.tsx`, `Footer.tsx`, `MobileStickyBar.tsx`

### Step 3 — Add announcement bars (all 3 sites)
New thin banner component above `<Header>` in each `page.tsx`.

### Step 4 — Source and add images
- **Prime Electrical:** Request job site photos from Max (solar installs, heat pump installs, switchboard work)
- **AKF Construction:** Request project portfolio photos (decks, renovations, fencing)
- **CleanJet:** Source stock or commission fresh, bright cleaning photos

### Step 5 — Add AKF cross-sell banner to CleanJet
New simple banner component between Testimonials and FAQ.

### Step 6 — Run and review all 3 sites locally
```bash
cd prime-electrical && npm run dev    # localhost:3000
cd akf-construction && npm run dev    # localhost:3001
cd cleanjet && npm run dev            # localhost:3002
```

### Step 7 — Mobile review (resize to 375px)
Check: sticky bar visible · hero readable · calculator usable · tabs scrollable

---

## Content Still Needed From Client

| Item | Prime Electrical | AKF Construction | CleanJet |
|------|-----------------|-----------------|---------|
| Logo SVG | ✅ Has existing logo | ✅ AKF LOGO.png exists | ❌ New logo needed |
| Phone number | ✅ 09-390-3620 | ✅ 09-951-8763 | ❌ TBC |
| Email | ❌ Not on site | ✅ info@akfconstruction.co.nz | ❌ TBC |
| Project photos | ❌ Needed | ❌ Needed | ❌ Needed |
| Real testimonials | ✅ 10 on site | ✅ 3 on site | ❌ Needed post-launch |
| Domain | theprimeelectrical.co.nz | akfconstruction.co.nz | ❌ TBC (cleanjet.co.nz?) |
| Booking system | ❌ TBC | ❌ TBC | ❌ TBC |
