---
name: search-optimization
description: Unified single-pass workflow that simultaneously optimizes for Google organic ranking (SEO) and AI model citation (AEO). Covers content, schema, technical, local, and off-page signals — once, for both channels.
when_to_use: When you need to improve visibility across both traditional search (Google blue links) and AI-generated answers (ChatGPT, Claude, Gemini, Perplexity). Use this instead of running seo-optimization and aeo-optimization separately — the shared signals mean one pass serves both goals.
evidence: User mentions search optimization, SEO and AEO together, unified search strategy, both Google and AI visibility, search visibility across channels, combined SEO AEO, or optimizing for Google and AI simultaneously.
---

# Search Optimization Skill — Unified SEO + AEO

## Overview

This skill implements a unified optimization workflow that serves both Search Engine Optimization (Google ranking) and Answer Engine Optimization (AI model citation) in a single pass. The core principle: SEO and AEO share the same underlying signals — content structure, schema markup, and source authority — so optimizing once for both is more efficient and more consistent than running two separate workflows.

**Individual skills (for single-channel deep work):**
- `SEO&AEO/seo-optimization/SKILL.md` — traditional search ranking only
- `SEO&AEO/aeo-optimization/SKILL.md` — AI citation only

**Shared signal map — every step serves both channels:**

| Step | SEO Impact | AEO Impact |
|------|-----------|-----------|
| 1. Technical audit | Crawlability, indexability | AI crawler access |
| 2. Content unification | Featured snippets, dwell time | AI citation format |
| 3. Schema generation | Rich Results, Local Pack | Entity clarity for AI |
| 4. Keyword + prompt map | Keyword targeting | Conversational prompt coverage |
| 5. Local signals | Local Pack | AI local recommendations |
| 6. Source footprint | Domain authority | AI third-party validation |

## Prerequisites

- Target website URL or local site files
- Business name, category, and location (for schema and local tasks)
- Primary keyword(s) to target
- For live audits: `web-scraper-fast` agent available in `agents/`
- For AI citation tracking: Mentions.so account (recommended) or access to ChatGPT, Claude, Perplexity for manual testing

## Steps

### Step 1 — Unified Technical Foundation

Establish the technical base that serves both Google crawlers and AI web indexers:

**robots.txt:**
- Allow all key pages (no accidental blocks on content, service, or product pages)
- Block: `/admin/`, `/wp-admin/`, `/staging/`, `/?s=` (search result pages), `/cart`, `/checkout`
- SEO: Controls Googlebot crawl budget
- AEO: Controls AI model crawlers (GPTBot, ClaudeBot, Google-Extended) — same file, same rules

**sitemap.xml:**
- Include all indexable pages with `<lastmod>`, `<changefreq>`, `<priority>`
- Exclude: admin pages, thank-you pages, search result pages, login pages
- SEO: Submitted to Google Search Console for crawl prioritization
- AEO: AI training crawlers use sitemaps to discover content

**Canonical tags:**
- Every page with a potential duplicate (www/non-www, HTTP/HTTPS, trailing slash, paginated) needs `<link rel="canonical">`
- SEO: Consolidates link equity to the preferred URL
- AEO: Eliminates AI model confusion about which URL is authoritative

**Redirect audit:**
- A → B → C chains should be collapsed to A → C
- SEO: Preserves link equity (each redirect loses ~10%)
- AEO: Ensures AI sees the correct, final page URL

**Success Criteria:** robots.txt, sitemap, canonicals, and redirects all assessed and corrected. No key pages accidentally blocked.

---

### Step 2 — Unified Content Optimization

Rewrite or optimize page content once, using rules that serve both Google ranking and AI citation:

**Rule 1 — 40–60 word direct lead answer per section**
Every H2/H3 section should open with a complete, standalone answer to the question that heading implies.
- SEO: Exact format Google extracts for Featured Snippets and AI Overviews
- AEO: The format AI models (ChatGPT, Claude, Perplexity) extract and cite in responses

**Rule 2 — 3–5 bullet points following each lead answer**
Supporting detail always in bullet or numbered list format after the lead.
- SEO: Structured content improves Featured Snippet eligibility and reduces bounce
- AEO: AI models strongly prefer extracting from structured lists vs. prose paragraphs

**Rule 3 — Question-format H2/H3 headings**
"What does [Brand] do?" beats "About [Brand]". "How much does [service] cost?" beats "Pricing".
- SEO: Directly targets Google People Also Ask (PAA) boxes
- AEO: Directly matches how users phrase queries to AI models

**Rule 4 — Entity signals in first 100 words**
Brand name + service category + location in the opening paragraph.
- SEO: Geographic and topical relevance for local and niche queries
- AEO: Tells AI what entity this page represents, enabling confident citation

**Rule 5 — Standard on-page keyword placement**
Primary keyword in: title tag, H1, first 100 words, meta description, at least one H2, URL slug.
- SEO: Core on-page ranking signals
- AEO: Topic classification for AI indexers

**Rule 6 — FAQ section (5–8 Q&As, 40–60 word answers)**
Every key page should have a FAQ section with direct, complete answers.
- SEO: FAQPage schema eligibility + long-tail keyword coverage + PAA targeting
- AEO: High-value citation source for AI — directly answerable questions

**Rule 7 — One E-E-A-T signal per page**
A credential, a data point, a certification number, years of experience, or source citation.
- SEO: Experience, Expertise, Authority, Trust ranking factor
- AEO: AI models favor authoritative, credible sources for citation

**Example transformation:**

BEFORE (neither SEO nor AEO ready):
> "At Prime Electrical, we offer a range of electrical services including residential wiring, commercial installations, and emergency callouts. Our team of qualified electricians is dedicated to providing high-quality service to customers throughout Auckland."

AFTER (serves both SEO + AEO):
> **Who is Prime Electrical?**
> Prime Electrical is an Auckland-based electrical contractor providing residential wiring, commercial installations, and 24/7 emergency callouts across Auckland and surrounding suburbs since 2010. All electricians are fully licensed with the Electrical Workers Registration Board (EWRB).
>
> - Residential: rewiring, switchboard upgrades, EV charger installation
> - Commercial: new builds, fit-outs, three-phase power
> - Emergency: 24/7 callout, same-day fault finding
> - Licensed: EWRB registered, Master Electricians member

**Success Criteria:** Every section has a 40–60 word lead answer + bullets. All headings are question-format where applicable. Entity signals in first 100 words. FAQ section present.

---

### Step 3 — Unified Schema Markup

Generate Schema.org JSON-LD once — it simultaneously earns Google Rich Results and provides AI entity clarity.

**Priority order (highest dual impact first):**

1. `LocalBusiness` (or `Organization`) — homepage
   - SEO: Google Knowledge Panel, Local Pack eligibility
   - AEO: Primary entity definition AI models use to identify and recommend the brand

2. `FAQPage` — FAQ sections on any page
   - SEO: FAQ accordion rich results in Google SERPs
   - AEO: Structured Q&A pairs AI models cite directly

3. `Service` — individual service pages
   - SEO: Service rich results, improved click-through
   - AEO: Explicit declaration of what the brand offers

4. `BreadcrumbList` — all pages with navigation depth
   - SEO: Breadcrumb display in SERPs
   - AEO: Content hierarchy signal for AI

5. `AggregateRating` / `Review` — if reviews are present
   - SEO: Star ratings in SERPs (major CTR improvement)
   - AEO: Social proof AI models factor into recommendations

**Unified LocalBusiness template:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "description": "[40-60 word description — brand + category + location + differentiator]",
  "url": "[https://domain.com]",
  "telephone": "[+64-xx-xxx-xxxx]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[street]",
    "addressLocality": "[city]",
    "addressRegion": "[region]",
    "postalCode": "[postcode]",
    "addressCountry": "NZ"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "[Google Business Profile URL]",
    "[Facebook URL]",
    "[LinkedIn URL]",
    "[Industry Directory URL]"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "[Service Name]" }
      }
    ]
  }
}
```

**Success Criteria:** `LocalBusiness` or `Organization` schema generated and valid. `FAQPage` schema generated for all FAQ content. All `sameAs` URLs are live.

---

### Step 4 — Unified Keyword + Prompt Mapping

Map traditional search keywords and conversational AI prompts together — they often target the same pages.

**For each topic or service, produce:**

| Field | Content |
|-------|---------|
| Traditional keyword | "residential electrician Auckland" |
| Search intent | transactional |
| Conversational prompt (AEO) | "Who is the best residential electrician in Auckland?" |
| Target AI models to test | ChatGPT, Perplexity, Claude |
| Target page | /services/residential |
| Content gap | [what's missing from the current page] |

**Keyword categories:**
- Primary: high-volume, high-intent (homepage and main service pages)
- Secondary: supporting terms for sub-service pages
- Long-tail: low-competition, high-conversion (blog posts, FAQs)
- Local modifiers: "[service] + [suburb/city]" (local landing pages)
- Question keywords: "How to…", "What is…" (FAQ and blog content — also top AEO prompts)

**Success Criteria:** 20+ keywords mapped with intent, page assignment, and matching conversational prompt. Prompt library ready for Mentions.so import.

---

### Step 5 — Unified Local Signals

For location-based businesses, local optimization serves both search channels with the same actions:

**Google Business Profile (highest-impact single action for both):**
- SEO: Local Pack and Google Maps ranking
- AEO: GBP is one of the first sources AI checks for local business recommendations
- Deliverable: Optimized description (750 chars), complete service list, 10 pre-seeded Q&As, photo checklist, weekly Post template

**NAP Consistency (identical Name, Address, Phone everywhere):**
- SEO: Local ranking signal — inconsistent NAP hurts local Pack position
- AEO: AI models need consistent entity signals across multiple sources to confidently recommend
- Deliverable: NAP audit — verify identical across website footer, GBP, all directories, and schema

**Citation building (same list serves both):**

| Directory | SEO Value | AEO Value |
|-----------|----------|----------|
| Google Business Profile | Local Pack | AI local source #1 |
| Bing Places | Bing organic local | Bing AI source |
| Apple Maps | iOS local search | Siri + Apple AI |
| Trusted Traders (NZ) | Industry authority link | AI recognizes vetted trades |
| Yellow Pages NZ | Citation backlink | AI reads as business directory |
| Neighbourly (NZ) | Community backlink | AI reads community mentions |
| Google Reviews | Review schema | AI uses review count as quality signal |

**Success Criteria:** GBP content generated. NAP verified consistent. Citation list of 8+ targets produced with platform + action per target.

---

### Step 6 — Unified Source Footprint

Off-page signals that build Google domain authority (SEO) and AI third-party validation (AEO) simultaneously:

**Priority actions by dual impact:**

1. **Earn Google Reviews** — Google Maps ranking + AI reads review count as trust signal
2. **Industry directory listings** — Niche backlinks + AI-indexed brand citations
3. **Guest posts / editorial mentions** — Topical authority links + AI reads as third-party endorsement
4. **Reddit and forum presence** — Community backlinks + AI trains on Reddit; being mentioned matters
5. **Local news / community coverage** — Local authority links + AI cites local news as credible source

**Success Criteria:** At least 5 specific off-page actions identified with platform, action, and dual SEO+AEO impact noted per item.

---

### Step 7 — Unified Readiness Validation

Final self-check before delivering output:

**Technical:**
- [ ] robots.txt allows all key pages
- [ ] sitemap.xml generated or confirmed present
- [ ] Canonical tags on duplicate/parameter URLs
- [ ] No redirect chains (A→B→C)

**Content:**
- [ ] Every section opens with 40–60 word direct answer
- [ ] Supporting detail in bullets, not prose
- [ ] H2/H3 headings are question-format
- [ ] Brand + category + location in first 100 words
- [ ] FAQ section with 5–8 Q&As present
- [ ] One E-E-A-T signal per key page

**Schema:**
- [ ] `LocalBusiness` or `Organization` JSON-LD generated and valid
- [ ] `FAQPage` schema generated for all FAQ content
- [ ] All `sameAs` URLs are live

**Keyword + Prompt:**
- [ ] 20+ keywords mapped with intent, page, and matching conversational prompt
- [ ] Prompt library ready for Mentions.so

**Local:**
- [ ] GBP content generated
- [ ] NAP consistency verified
- [ ] Citation list of 8+ targets produced

**Success Criteria:** All checklist items pass. Every deliverable explicitly noted as serving SEO, AEO, or both.

## Verification

After applying this skill, verify:
- [ ] Technical: robots.txt, sitemap, canonicals, redirects all assessed
- [ ] Content: 40–60 word leads, bullets, question headings, FAQ, E-E-A-T — all present
- [ ] Schema: valid JSON-LD, `LocalBusiness` + `FAQPage` at minimum
- [ ] Keyword+Prompt map: 20+ items, each with SEO keyword + AEO conversational prompt
- [ ] Local: GBP content + NAP audit + citation list produced
- [ ] Off-page: 5+ specific actions with dual SEO+AEO impact noted
- [ ] Every deliverable labelled as serving SEO, AEO, or both

## Related

- Command: `SEO&AEO/search-command.md` — the `/search-optimize` command that uses this skill
- Skill: `SEO&AEO/seo-optimization/SKILL.md` — SEO-only deep dive
- Skill: `SEO&AEO/aeo-optimization/SKILL.md` — AEO-only deep dive
- Command: `/seo-optimize` — for traditional search ranking deep work
- Command: `/aeo` — for AI citation deep work
- Command: `/scrape` — pull competitor pages for gap analysis
- Tool: Google Rich Results Test — validate schema at search.google.com/test/rich-results
- Tool: Google Search Console — monitor rankings and indexation
- Tool: Mentions.so — daily AI prompt tracking and Share of Voice monitoring
