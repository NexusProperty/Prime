---
name: seo-optimization
description: Optimize websites for Google search ranking through technical SEO, on-page optimization, keyword mapping, schema markup, local SEO, and backlink strategy.
when_to_use: When improving a website's organic search visibility — auditing technical health, writing optimized meta tags, mapping keywords to pages, generating Schema.org markup, building local SEO signals, or developing a link-building strategy.
evidence: User mentions SEO, search ranking, Google ranking, keyword research, meta tags, backlinks, organic traffic, Google Search Console, sitemap, robots.txt, local SEO, Google Business Profile, schema markup, on-page optimization, or content for search.
---

# SEO Optimization Skill

## Overview

This skill implements a comprehensive Search Engine Optimization methodology covering the full SEO lifecycle: technical health, on-page signals, content quality, local signals, and off-page authority. SEO targets organic ranking in traditional search results (Google, Bing) and works in tandem with AEO (`SEO&AEO/aeo-optimization/SKILL.md`) for complete search visibility.

The four core SEO pillars this skill addresses:
1. **Technical SEO** — crawlability, indexability, speed, and structure
2. **On-Page SEO** — title tags, meta descriptions, headings, and keyword placement
3. **Content SEO** — depth, semantic coverage, E-E-A-T, and internal linking
4. **Off-Page SEO** — backlinks, domain authority, and local citations

## Prerequisites

- Target website URL or local site files to analyze
- Business name, category, and location (for local SEO and schema)
- Primary keyword(s) to target
- Access to Google Search Console (recommended for reporting tasks)
- For live audits: `web-scraper-fast` agent available in `agents/`

## Steps

### Step 1 — Technical SEO Health Check

Assess the site's technical foundation before any on-page work:

**Crawlability:**
- `robots.txt` present? Does it allow Googlebot on all key pages?
- `sitemap.xml` present at `[domain]/sitemap.xml`?
- No accidental `noindex` tags on important pages?
- No broken internal links (404s)?

**Indexability:**
- Canonical tags present and pointing to the preferred URL version?
- No duplicate content (www vs. non-www, HTTP vs. HTTPS, trailing slash vs. no trailing slash)?
- HTTPS enforced sitewide?
- Redirect chains — A → B → C chains waste link equity; should be A → C directly

**Performance signals:**
- Are large unoptimized images visible in the source?
- Are render-blocking scripts loaded in `<head>` without `defer` or `async`?
- Does the page load in under 3 seconds? (estimate from visible code patterns)

**Generate fixes for any issues found:**

| Issue | Fix |
|-------|-----|
| Missing robots.txt | Generate one — allow all, block `/admin/`, `/wp-admin/`, `/staging/` |
| Missing sitemap | Generate XML sitemap with all indexable page URLs |
| Missing canonical | Add `<link rel="canonical" href="[preferred URL]">` to `<head>` |
| HTTP not redirecting to HTTPS | Add 301 redirect at server/CDN level |
| Multiple H1s | Reduce to single H1, demote others to H2 |

**Success Criteria:** All critical technical issues identified and a fix generated for each.

---

### Step 2 — On-Page Optimization

Optimize the signals search engines read most directly:

**Title Tag:**
- Length: 50–60 characters (count carefully — truncation at ~580px width)
- Structure: `[Primary Keyword] — [Secondary Signal] | [Brand]`
- Keyword position: Primary keyword in first 30 characters where possible
- Uniqueness: No two pages share a title

**Meta Description:**
- Length: 150–160 characters
- Must include: primary keyword, a specific benefit, implicit CTA
- Not a ranking factor — but higher CTR from compelling description indirectly helps rankings
- Uniqueness: No two pages share a description

**Heading Structure:**
- Single `<h1>` per page — contains primary keyword, matches search intent
- `<h2>` for major subtopics — include secondary keywords
- `<h3>` for sub-sections under H2s
- Headings should read as a logical outline of the page

**Keyword Placement Checklist:**
- [ ] Primary keyword in title tag
- [ ] Primary keyword in H1
- [ ] Primary keyword in first 100 words of body content
- [ ] Primary keyword in meta description
- [ ] Primary keyword in at least one H2 or H3
- [ ] Primary keyword in URL slug (if page hasn't launched yet)
- [ ] 2–3 secondary/semantic keywords distributed through body

**Internal Linking:**
- Every page should link to at least 2–3 other relevant pages on the same site
- Anchor text should be descriptive (not "click here" — use the keyword of the destination page)
- Orphan pages (no internal links pointing to them) should be linked from relevant pages

**Success Criteria:** All on-page elements optimized and validated against the checklist.

---

### Step 3 — Content Depth & Semantic Coverage

Ensure the content is comprehensive enough to rank for competitive terms:

**Content Depth:**
- Check word count of the top 3 ranking pages for the target keyword (estimate from visible content if scraping)
- Target page should match or exceed the average
- Minimum thresholds by page type:
  - Homepage: 500–800 words
  - Service page: 800–1,200 words
  - Blog post / guide: 1,500–3,000 words (for competitive informational terms)
  - FAQ page: 300–500 words per question group

**Semantic Keyword Coverage:**
Generate 10–15 related terms (LSI keywords) that should appear naturally on the page. These are terms Google expects to see alongside the primary keyword:
- Synonyms and variations of the primary keyword
- Related concepts and subtopics
- Tools, brands, or methods commonly associated with the topic
- Questions users ask about this topic

**E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trustworthiness):**
- Mention specific credentials, years of experience, or qualifications
- Include specific data, statistics, or case studies where relevant
- Cite third-party sources for factual claims
- Author bios on blog posts
- Trust signals: license numbers, certifications, association memberships

**Content Freshness:**
- Add or update a visible date on time-sensitive pages
- For evergreen content: review and update annually

**Success Criteria:** Content meets depth threshold for the target keyword. 10+ semantic keywords identified and confirmed present. At least one E-E-A-T signal per page.

---

### Step 4 — Schema.org Markup Generation

Generate machine-readable structured data for Google Rich Results:

**Always generate for any business site:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "description": "[150-160 char description with primary keyword]",
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
    "[LinkedIn URL]"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "[Service Name]",
          "description": "[Service description]"
        }
      }
    ]
  }
}
```

**Add FAQPage schema for any FAQ content:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Direct answer — 40–100 words]"
      }
    }
  ]
}
```

**Validate:** All generated schema must be syntactically valid JSON. Test at search.google.com/test/rich-results before deploying.

**Success Criteria:** `LocalBusiness` (or appropriate type) schema generated and valid. `FAQPage` schema generated if FAQ content exists.

---

### Step 5 — Local SEO Setup

For location-based businesses:

**Google Business Profile (GBP):**
Generate optimized GBP content:
- Business description: 750 characters, keyword-rich, includes primary service + location + differentiator
- Category selection: Primary category (most specific available) + secondary categories
- Services list: All services with descriptions
- Q&A: 10 pre-seeded Q&As the business should post on its own GBP profile
- Photo checklist: exterior, interior, team headshots, project/work photos (minimum 10)
- Google Posts: Weekly post template (offer, update, or event format)

**NAP Consistency:**
Name, Address, Phone must be identical character-for-character across:
- Website footer and contact page
- Google Business Profile
- All directory listings
- Schema.org markup

**Citation checklist — submit to these directories:**
- Google Business Profile (mandatory)
- Bing Places
- Apple Maps (via Apple Maps Connect)
- Yellow Pages (New Zealand: yellowpages.co.nz / AU: yellowpages.com.au)
- Localist (NZ local business directory)
- Neighbourly (NZ community platform)
- Industry-specific: Trusted Traders, Master Trades (NZ trades)
- Facebook Business Page

**Success Criteria:** GBP content generated. NAP verified consistent. Citation list produced with at least 8 targets.

---

### Step 6 — SEO Readiness Validation

Before delivering any SEO output, run this final self-check:

**Technical:**
- [ ] robots.txt allows all key pages
- [ ] sitemap.xml present or generated
- [ ] No duplicate content issues identified
- [ ] Canonical tags present on paginated or parameter URLs
- [ ] HTTPS enforced

**On-Page:**
- [ ] Each page has a unique, 50–60 character title tag with primary keyword
- [ ] Each page has a unique, 150–160 character meta description
- [ ] Single H1 per page containing the primary keyword
- [ ] Internal links from at least 2 other pages to each key page

**Content:**
- [ ] Word count meets threshold for keyword competitiveness
- [ ] 10+ semantic/LSI keywords present in the content
- [ ] At least one E-E-A-T signal visible on the page
- [ ] FAQ section present if targeting question-format queries

**Schema:**
- [ ] JSON-LD is syntactically valid
- [ ] `LocalBusiness` or appropriate schema type on homepage
- [ ] `FAQPage` schema on FAQ content
- [ ] `sameAs` URLs are live and correct

**Success Criteria:** All checklist items pass before output is delivered.

## Verification

After applying this skill, verify:
- [ ] Technical: robots.txt, sitemap, canonicals assessed and fixed
- [ ] On-Page: title, description, H1, internal links all optimized
- [ ] Content: depth, semantic coverage, and E-E-A-T signals present
- [ ] Schema: valid JSON-LD generated and ready to deploy
- [ ] Local: GBP content and citation list produced (if applicable)
- [ ] No keyword stuffing — content reads naturally for human readers

## Related

- Command: `SEO&AEO/seo-command.md` and `commands/seo-optimize.md` — the `/seo-optimize` command
- Skill: `SEO&AEO/aeo-optimization/SKILL.md` — companion AEO skill for AI search citation
- Command: `/aeo` — Answer Engine Optimization for LLM citation
- Command: `/scrape` — use to pull competitor pages for gap analysis
- Command: `/mission-control build` — ingest SEO data into Mission Control
- Tool: Google Search Console — monitor rankings and indexation
- Tool: Google Rich Results Test — validate schema markup
