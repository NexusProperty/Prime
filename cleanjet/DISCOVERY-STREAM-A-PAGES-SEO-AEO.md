# Stream A — Pages, Content, SEO & AEO Discovery Report

**Project:** CleanJet  
**Scan Date:** 2026-02-23  
**Scope:** `F:/Prime/cleanjet` + `F:/Prime/websiteinfo/cleanjet`

---

## 1. Page Inventory

### 1.1 Implemented Pages (App Router)

| Route | File | Layout | Notes |
|-------|------|--------|------|
| `/` | `src/app/page.tsx` | Root | Single-page marketing site (SPA-style) |
| `/login` | `src/app/(auth)/login/page.tsx` | SlimLayout | Auth placeholder |
| `/register` | `src/app/(auth)/register/page.tsx` | SlimLayout | Auth placeholder |
| 404 | `src/app/not-found.tsx` | SlimLayout | Custom not-found |

**Total implemented routes:** 3 (+ 404)

### 1.2 Content Files (websiteinfo/cleanjet)

| Content File | Target URL | Status |
|--------------|------------|--------|
| `home.md` | `/` | ✅ Content exists — partially implemented on home |
| `regular-clean.md` | `/regular-clean` | ❌ 404 — page not built |
| `deep-clean.md` | `/deep-clean` | ❌ 404 — page not built |
| `end-of-tenancy.md` | `/end-of-tenancy` | ❌ 404 — page not built |
| `post-build-clean.md` | `/post-build-clean` | ❌ 404 — page not built |
| `about-us.md` | `/about-us` | ❌ 404 — page not built |
| `faq.md` | `/faq` | ❌ 404 — FAQ section exists on home only |
| `pricing.md` | `/pricing` | ❌ 404 — pricing section exists on home only |
| `how-it-works.md` | `/how-it-works` | ❌ 404 — section exists on home only |
| `great-clean-guarantee.md` | `/great-clean-guarantee` | ❌ 404 — page not built |
| `websiteinfo.md` | — | Master reference (business details, schema, keywords) |
| `Costest/Invoice.md` | — | Internal reference |

**Content files:** 12 markdown files in `websiteinfo/cleanjet/`  
**Pages derived from content:** 10 target pages (excluding master + internal)

---

## 2. Navigation vs. Implemented Pages

### 2.1 Header Navigation (Desktop + Mobile)

| Label | Target | Implemented? |
|-------|--------|--------------|
| Services | `#services` | ✅ Section on home |
| Pricing | `#pricing` | ✅ Section on home |
| How It Works | `#how-it-works` | ✅ Section on home |
| Reviews | `#testimonials` | ✅ Section on home |
| Book Now | `#booking` | ✅ Section on home |

All header links are **anchor links** to sections on the single home page. No dedicated pages.

### 2.2 Footer Navigation

| Link | Target | Implemented? |
|------|--------|--------------|
| Regular Clean | `#services` | ❌ Should be `/regular-clean` |
| Deep Clean | `#services` | ❌ Should be `/deep-clean` |
| End of Tenancy | `#services` | ❌ Should be `/end-of-tenancy` |
| Post-Build Clean | `#services` | ❌ Should be `/post-build-clean` |
| Pricing | `#pricing` | ✅ Section on home |
| How It Works | `#how-it-works` | ✅ Section on home |
| Reviews | `#testimonials` | ✅ Section on home |
| FAQ | `#faq` | ✅ Section on home |
| About Us | `#` | ❌ Dead link — should be `/about-us` |
| Great Clean Guarantee | `#why-cleanjet` | ❌ Should be `/great-clean-guarantee` |

**Footer links:** 5 point to `#` or wrong anchors; 4 service pages + About Us + Great Clean Guarantee are missing.

---

## 3. SEO Status

### 3.1 Root Layout Metadata (`layout.tsx`)

| Field | Value |
|-------|-------|
| `title.template` | `%s - CleanJet` |
| `title.default` | `CleanJet — Auckland Home Cleaning. Book in 60 Seconds.` |
| `description` | `Professional home cleaning services across Auckland. Vetted, insured cleaners. Eco-friendly products. 100% satisfaction guarantee. First clean 20% off. Book online in under a minute.` |

**Missing:**
- `openGraph` (og:title, og:description, og:image, og:url)
- `twitter` (twitter:card, twitter:title, etc.)
- `keywords` (optional but sometimes used)
- `robots` (index/follow — Next.js default is fine, but not explicit)
- Canonical URL

### 3.2 Page-Level Metadata

| Page | Title | Description |
|------|-------|-------------|
| Home | Uses default | Uses default |
| Login | `Sign In` | Inherits layout (no page-specific description) |
| Register | `Sign Up` | Inherits layout (no page-specific description) |

**websiteinfo/home.md** recommends:
- **Title:** `House Cleaning Auckland | Book in 60 Seconds | CleanJet` (56 chars)
- **Description:** `CleanJet — vetted, insured home cleaning across Auckland from $79. Eco-friendly products. 100% satisfaction guarantee. Book online now.` (136 chars)

Current layout title/description differ from optimised versions in `home.md`.

### 3.3 JSON-LD Schema

**Status:** ❌ **Not implemented**

`websiteinfo.md` specifies schema for:
- LocalBusiness + FAQPage (Home)
- Service + FAQPage (Regular, Deep, End of Tenancy, Post-Build)
- LocalBusiness + ItemList + FAQPage (Pricing)
- HowTo (How It Works)
- LocalBusiness + Organization (About Us)
- FAQPage (Great Clean Guarantee)

**Grep result:** No `application/ld+json` or schema markup in the app.

### 3.4 Sitemap & Robots

**Status:** ❌ **Not found**

- No `sitemap.ts` / `sitemap.xml`
- No `robots.ts` / `robots.txt`
- `next.config.js` has no sitemap/robots configuration

---

## 4. AEO Status (Answer Engine Optimization)

### 4.1 Conversational Prompts (from websiteinfo.md)

| Prompt | Target Page | Status |
|--------|-------------|--------|
| "Who offers home cleaning in Auckland?" | Home | ✅ Home exists; content present |
| "What is the best home cleaning company in Auckland?" | Home / About | ⚠️ About page missing |
| "How much does a cleaner cost in Auckland?" | Pricing / FAQ | ✅ Sections on home |
| "Who does end of tenancy cleaning in Auckland?" | End of Tenancy | ❌ Page missing |
| "What is included in an end of tenancy clean in NZ?" | End of Tenancy / FAQ | ⚠️ FAQ on home only |
| "How do I get my bond back in New Zealand?" | End of Tenancy | ❌ Page missing |
| "Who does post-build cleaning in Auckland?" | Post-Build | ❌ Page missing |
| "What is a deep clean of a house?" | Deep Clean / FAQ | ❌ Page missing |
| "How much does carpet cleaning cost in Auckland?" | Pricing / FAQ | ⚠️ Add-on pricing on home |

### 4.2 Entity Clarity

- **Business NAP:** In `websiteinfo.md` (address, phone, email, GST). **Not** in schema on site.
- **Structured data:** Absent — reduces AEO discoverability.
- **FAQ content:** Present in `Faqs.tsx` (6 FAQs) but no FAQPage schema.

---

## 5. Missing Pages Summary

| Page | Content File | Priority |
|------|-------------|----------|
| `/regular-clean` | `regular-clean.md` | High — SEO keyword target |
| `/deep-clean` | `deep-clean.md` | High — SEO keyword target |
| `/end-of-tenancy` | `end-of-tenancy.md` | High — bond/tenancy queries |
| `/post-build-clean` | `post-build-clean.md` | High — builders clean |
| `/pricing` | `pricing.md` | Medium — standalone pricing page |
| `/how-it-works` | `how-it-works.md` | Medium — HowTo schema |
| `/about-us` | `about-us.md` | Medium — E-E-A-T, trust |
| `/faq` | `faq.md` | Medium — comprehensive FAQ |
| `/great-clean-guarantee` | `great-clean-guarantee.md` | Lower — trust/guarantee |

---

## 6. Recommendations

1. **Create service pages** for Regular, Deep, End of Tenancy, Post-Build using `websiteinfo/cleanjet/*.md`.
2. **Add JSON-LD schema** per `websiteinfo.md` (LocalBusiness, Service, FAQPage, HowTo).
3. **Align metadata** with `home.md` (title, description).
4. **Add Open Graph and Twitter** meta tags for sharing.
5. **Implement `sitemap.ts` and `robots.ts`** for Next.js.
6. **Fix footer links** — point to `/regular-clean`, `/about-us`, etc., once pages exist.
7. **Update phone** — Footer/Header use `0800 000 000`; `websiteinfo.md` has `(09) 215-2900`.

---

## 7. Context for Phase 2

- **Content source:** `F:/Prime/websiteinfo/cleanjet/*.md` — ready for page implementation.
- **Architecture:** Single home page with sections; service pages will be new routes.
- **Layout:** Root layout + SlimLayout for auth/404. Service pages can use main Header/Footer.
- **Derived pages:** 9 pages from content files + navigation expectations.
