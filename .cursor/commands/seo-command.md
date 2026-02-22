# SEO Command - Search Engine Optimization

Search Engine Optimization (SEO) is the practice of improving a website's visibility in organic search results on Google, Bing, and other search engines. This command governs the full SEO lifecycle — technical audits, keyword research, on-page optimization, schema markup, local SEO, backlink strategy, and performance reporting.

This command works alongside `/aeo` (Answer Engine Optimization). SEO drives ranking in traditional search results; AEO drives citation inside AI-generated answers. Use both for full search visibility.

**Related command:** `SEO&AEO/aeo-command.md` — for AI search and LLM citation optimization

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before any SEO task begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before acting, fast subagents scan the project and target site to establish an SEO baseline:

> **Recommended subagent types:**
> - `web-scraper-fast` — audit live page content, heading structure, meta tags, and schema
> - `codebase-scanner-fast` — scan local site files for existing meta tags, schema, sitemap, robots.txt

1. **Identify the target:** Which website, page, or domain is being optimized?
2. **Scan on-page signals** (live URL or local files):
   - Title tags — present, length (50–60 chars), keyword placement
   - Meta descriptions — present, length (150–160 chars), compelling?
   - Heading structure — single H1, logical H2/H3 hierarchy
   - Content length — word count per page
   - Internal links — quantity and anchor text quality
   - Image alt text — present and descriptive?
   - Schema.org markup — type, completeness
3. **Check technical signals:**
   - `robots.txt` — is it configured, are key pages blocked?
   - `sitemap.xml` — present and submitted?
   - Canonical tags — present and correct?
   - Page speed indicators (any render-blocking scripts or unoptimized images visible in source?)
4. **Return Discovery Summary:**
   ```
   ## SEO Discovery Summary
   Target: [website/domain/page]
   Task: [audit | keywords | meta | content | schema | technical | local | backlinks | report | strategy]
   Title tags: [optimized | missing | too long | too short | N/A]
   Meta descriptions: [optimized | missing | too long | too short | N/A]
   Heading structure: [correct | multiple H1s | missing H1 | flat | N/A]
   Schema markup: [found — types | missing | partial | N/A]
   robots.txt: [found | missing | blocking key pages | N/A]
   Sitemap: [found | missing | N/A]
   Content depth: [thin <300 words | adequate 300–800 | strong >800 | N/A]
   ```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent reviews the Discovery Summary and:

1. **Confirms the task type** from the user's request (see Workflow below)
2. **Assesses SEO gap** — where does the site currently underperform?
3. **Prioritizes by impact** — Technical fixes first (indexability), then on-page, then off-page
4. **Writes an execution plan** — lists exactly what will be produced in Phase 3

> **Gate:** Do not proceed to Phase 3 until the task, target, and execution plan are confirmed.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly writes or edits files. It uses the `Task` tool to spawn subagents for all file operations.

**Delegation map:**

| Task | Subagent |
|------|----------|
| Page content audit and scraping | `web-scraper-fast` |
| Content rewriting and optimization | `documentation-manager-fast` |
| Schema.org markup generation | `file-operations-fast` |
| Report and strategy writing | `documentation-manager-fast` |
| Keyword list and meta tag files | `file-operations-fast` |
| Site file scanning | `codebase-scanner-fast` |

---

## Agentic Skills — Applied Automatically

When `/seo-optimize` is invoked, the following skill is activated:

| Skill | Trigger | Mandate |
|-------|---------|---------|
| `seo-optimization` | Always | Technical audit, on-page optimization, keyword mapping, schema, local signals |

---

## Workflow — Task Types

### `audit` — Full SEO Audit

```
/seo-optimize audit https://example.com
/seo-optimize audit https://example.com/services
```

A comprehensive SEO health check across all four pillars: Technical, On-Page, Content, and Off-Page.

**Technical SEO:**
- Is the page indexed? (check via `site:example.com` logic or robots.txt)
- Are canonical tags present and pointing to the correct URL?
- Is the page mobile-friendly?
- Are there render-blocking scripts in the `<head>`?
- Is `robots.txt` configured correctly?
- Is `sitemap.xml` present and linked in `robots.txt`?
- Are there broken internal links?
- HTTP vs HTTPS — is the site fully on HTTPS?
- Redirect chains — are there 301/302 chains that waste link equity?

**On-Page SEO:**
- Title tag: 50–60 characters, primary keyword near the start, unique per page
- Meta description: 150–160 characters, includes keyword, has a call-to-action
- H1: Single, contains the primary keyword, matches search intent
- H2/H3: Logical hierarchy, includes secondary and semantic keywords
- Image alt text: Descriptive, includes keywords where natural
- Internal links: At least 2–3 internal links per page, keyword-rich anchor text
- URL structure: Short, readable, keyword-based (no `?id=123` patterns)

**Content SEO:**
- Word count appropriate for the topic (1,000+ for competitive informational terms)
- Keyword density: Primary keyword appears naturally, not stuffed
- Semantic keywords: Related terms present (LSI keywords)
- Content freshness: Date signals where relevant
- E-E-A-T signals: Author bios, credentials, source citations

**Off-Page SEO:**
- Backlink profile: Number of referring domains, domain authority of linkers
- Anchor text distribution: Brand vs. exact match vs. generic
- Link quality: No toxic or spammy links

**Output:** `SEO&AEO/seo-audit-[domain]-[date].md` — scored report with specific, prioritized fixes.

---

### `keywords` — Keyword Research & Mapping

```
/seo-optimize keywords [topic or business description]
/seo-optimize keywords "electrician Auckland residential commercial"
```

Generates a keyword strategy with search intent classification and page mapping.

**Keyword categories produced:**
- **Primary keywords:** High-volume, high-intent terms the homepage or main service pages should target
- **Secondary keywords:** Supporting terms for service/product sub-pages
- **Long-tail keywords:** Low-competition, high-conversion phrases for blog posts or FAQs
- **Local modifiers:** Location-based variants (e.g., "[service] + [suburb/city]")
- **Question keywords:** "How to…", "What is…", "Best…" queries for FAQ and blog content

**For each keyword:**
- Search intent: `informational | navigational | commercial | transactional`
- Recommended page type: homepage / service page / blog post / FAQ / landing page
- Competitor gap: Is this keyword owned by a competitor but not the brand?

**Output:** `SEO&AEO/keyword-map-[topic]-[date].md` — full keyword map organized by page assignment.

---

### `meta` — Generate Optimized Meta Tags

```
/seo-optimize meta https://example.com
/seo-optimize meta [page name or description] [primary keyword]
```

Generates optimized `<title>` and `<meta name="description">` tags for one or more pages.

**Title tag rules:**
- 50–60 characters (never exceed 60 — Google truncates)
- Primary keyword within the first 30 characters where possible
- Brand name at the end, separated by ` | ` or ` — `
- Unique — no two pages share the same title
- Matches the page's primary search intent

**Meta description rules:**
- 150–160 characters
- Includes the primary keyword naturally
- Includes a specific benefit or differentiator
- Ends with an implicit or explicit call-to-action
- Unique — no two pages share the same description

**Output:** Meta tags delivered inline as HTML snippets, or saved to `SEO&AEO/meta-tags-[domain]-[date].md`.

---

### `content` — On-Page Content Optimization

```
/seo-optimize content https://example.com/services [primary keyword]
/seo-optimize content [paste content] [primary keyword]
```

Rewrites or improves existing page content for higher organic ranking.

**Optimization rules:**
1. **Keyword placement:** Primary keyword in title, H1, first 100 words, at least 2–3 times in body, and in meta description
2. **Semantic coverage:** Include 5–10 related terms (LSI) the search engine expects on a page about this topic
3. **Content structure:** H2 sections for each major subtopic, H3 for subsections
4. **Word count:** Match or exceed the average of the top 3 ranking pages for the target keyword
5. **E-E-A-T signals:** Mention credentials, experience, or data sources where relevant
6. **Internal linking:** Add 2–3 contextual internal links with keyword-relevant anchor text
7. **CTA placement:** Strong call-to-action in the first screen and at the bottom of the page

**Output:** Optimized content delivered inline or saved to `SEO&AEO/content-[page-slug]-[date].md`.

---

### `schema` — Generate Schema.org Markup

```
/seo-optimize schema [business type] [page type]
/seo-optimize schema LocalBusiness homepage
/seo-optimize schema Service services-page
/seo-optimize schema FAQPage faq
/seo-optimize schema Article blog-post
```

Generates complete, valid Schema.org JSON-LD for Google Rich Results.

**Schema types supported:**

| Type | When to use | Rich Result |
|------|------------|-------------|
| `Organization` | Brand identity, all sites | Knowledge Panel |
| `LocalBusiness` | Location-based businesses | Local Pack, Maps |
| `Service` | Individual service pages | Service carousel |
| `FAQPage` | FAQ sections or pages | FAQ accordions in SERPs |
| `Product` | E-commerce product pages | Product rich results |
| `Review` / `AggregateRating` | Review sections | Star ratings in SERPs |
| `Article` / `BlogPosting` | Blog posts | Top Stories, article snippets |
| `BreadcrumbList` | All pages with navigation depth | Breadcrumbs in SERPs |
| `HowTo` | Step-by-step guide pages | HowTo rich result |
| `WebSite` | Homepage | Sitelinks Search Box |

**Output:** Complete `<script type="application/ld+json">` blocks ready to paste into the page `<head>`.

---

### `technical` — Technical SEO Fixes

```
/seo-optimize technical https://example.com
/seo-optimize technical generate robots.txt [domain]
/seo-optimize technical generate sitemap [list of pages]
```

Generates or fixes technical SEO files and configurations.

**What this produces:**
- `robots.txt` — configured to allow all key pages, block admin/staging/duplicate URLs
- `sitemap.xml` — complete XML sitemap with all indexable pages, `<lastmod>`, `<changefreq>`, `<priority>`
- Canonical tag recommendations — which pages need `<link rel="canonical">`
- Redirect map — which URLs need 301 redirects and where to
- Hreflang tags — for multi-language sites
- Core Web Vitals recommendations — based on observed page structure (render-blocking scripts, unoptimized images)

**Output:** Files or recommendations saved to `SEO&AEO/technical-seo-[domain]-[date].md`.

---

### `local` — Local SEO

```
/seo-optimize local [business name] [location] [category]
/seo-optimize local "Prime Electrical" "Auckland NZ" "electrical contractor"
```

Optimizes for local search visibility — Google Maps, Local Pack, and geo-modified queries.

**What local SEO covers:**

1. **Google Business Profile (GBP) optimization:**
   - Business name, category, description (750 chars, keyword-rich)
   - Service areas and opening hours
   - Photo recommendations (exterior, interior, team, work samples)
   - Q&A seeding — 10 common questions to pre-populate
   - Post frequency recommendation (weekly Google Posts)

2. **Local Schema:**
   - `LocalBusiness` JSON-LD with NAP (Name, Address, Phone), `geo`, `openingHoursSpecification`
   - `sameAs` — GBP URL, Facebook, LinkedIn, relevant directories

3. **NAP Consistency:**
   - Business name, address, and phone must be identical across all citations
   - Generates a citation checklist: directories to list the business on

4. **Local citation targets:**
   - Google Business Profile, Bing Places, Apple Maps, Yelp, Yellow Pages
   - Industry-specific: Trusted Traders (NZ), Master Trades (NZ), Angi (US/AU)
   - Local directories: Chamber of Commerce, local business associations

5. **Local content strategy:**
   - Suburb/city landing pages for each service area
   - Location-modified keywords for each key service

**Output:** `SEO&AEO/local-seo-[business]-[date].md`

---

### `backlinks` — Backlink Strategy

```
/seo-optimize backlinks [domain or category]
```

Develops a link-building strategy to increase domain authority and referral traffic.

**What this covers:**
1. **Link opportunity categories:**
   - Industry directories and associations (high trust, low effort)
   - Guest posting targets — publications covering the industry
   - Resource page link building — "best [category]" lists to pitch for inclusion
   - Testimonial links — give testimonials to suppliers/tools in exchange for a link
   - Local press and community sponsorships
   - Broken link building — find competitor broken links and offer the brand's page as replacement

2. **Anchor text strategy:**
   - Brand: 40–50% (e.g., "Prime Electrical")
   - Partial match: 20–30% (e.g., "Auckland electrician")
   - Exact match: 5–10% max (e.g., "residential electrician Auckland")
   - Generic: 20–30% (e.g., "click here", "this article")

3. **Links to avoid:**
   - Link farms, PBNs, irrelevant directories
   - Over-optimized exact match anchor text
   - Paid links without `rel="nofollow"` or `rel="sponsored"`

**Output:** `SEO&AEO/backlink-strategy-[domain]-[date].md`

---

### `report` — SEO Performance Report

```
/seo-optimize report [domain]
```

Generates a structured SEO performance report.

**Report sections:**
- Organic traffic trend (from analytics if available, or estimated from rankings)
- Top ranking pages and their keywords
- Pages that dropped — root cause analysis
- Technical issues resolved vs. outstanding
- Backlinks gained this period
- Top 5 opportunities for next 30 days
- Actions taken and their estimated impact

**Output:** `SEO&AEO/seo-report-[domain]-[date].md`

---

### `strategy` — Full SEO Strategy

```
/seo-optimize strategy [domain or business description]
```

Creates a comprehensive, phased SEO strategy.

**Strategy phases:**
1. **Foundation (Week 1–2):** Technical fixes — robots.txt, sitemap, canonical tags, schema, page speed
2. **On-Page (Week 2–4):** Title tags, meta descriptions, H1/H2 optimization, internal linking for all key pages
3. **Content (Month 1–3):** Fill keyword gaps with new pages, improve thin content, add FAQ sections
4. **Local (Month 1–2, if applicable):** GBP optimization, citations, local schema, suburb pages
5. **Off-Page (Ongoing):** Directory submissions, guest posts, testimonial links, community presence
6. **Monitoring (Ongoing):** Monthly rank tracking, quarterly audits, content refresh cycle

**Output:** `SEO&AEO/seo-strategy-[brand]-[date].md`

---

## SEO vs. AEO Quick Reference

| Dimension | SEO | AEO |
|-----------|-----|-----|
| Goal | Rank in blue links (position 1–10) | Be cited inside AI answers |
| Primary metric | Keyword ranking position | AI Share of Voice |
| Content format | Keyword-optimized, long-form | 40–60 word direct answers + bullets |
| Tracking tool | Google Search Console, Ahrefs, SEMrush | Mentions.so, manual LLM testing |
| Entity signals | Backlinks + schema | Schema + third-party mentions |
| Query type | Keywords (short and long-tail) | Conversational prompts |
| Time to result | 3–6 months | 4–8 weeks (faster AI adoption) |

> Run both `/seo-optimize` and `/aeo` for maximum search visibility — they reinforce each other.

---

## Usage

```
/seo-optimize audit https://example.com
/seo-optimize keywords "electrical contractor Auckland"
/seo-optimize meta https://example.com/services "residential electrician Auckland"
/seo-optimize content https://example.com/about "electrician Auckland"
/seo-optimize schema LocalBusiness homepage
/seo-optimize technical generate robots.txt example.com
/seo-optimize local "Prime Electrical" "Auckland NZ" "electrical contractor"
/seo-optimize backlinks example.com
/seo-optimize report example.com
/seo-optimize strategy "Prime Electrical — residential and commercial electrician in Auckland"
```

## Next Steps

After any `/seo-optimize` task:
- Validate schema with Google's Rich Results Test (search.google.com/test/rich-results)
- Submit updated sitemap in Google Search Console
- Verify robots.txt allows all key pages (search.google.com/search-console/robots-testing-tool)
- Set up Google Search Console if not already configured
- Run `/aeo` alongside SEO for AI search visibility
- Use `/scrape` to pull competitor pages for gap analysis
