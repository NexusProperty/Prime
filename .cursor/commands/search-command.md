# SEARCH OPTIMIZE Command - Unified SEO + AEO

Modern search happens in two places simultaneously: **Google blue links** (traditional SEO) and **AI-generated answers** (AEO — Answer Engine Optimization). This command optimizes for both in a single pass.

The key insight: SEO and AEO share the same core signals. Well-structured content that ranks on Google is also the content AI models cite. Schema markup that earns Google Rich Results is also the entity clarity that makes AI models confident recommending a brand. Run one unified workflow instead of two separate ones.

**Individual commands (for deeper single-focus work):**
- `SEO&AEO/seo-command.md` — `/seo-optimize` for traditional search ranking only
- `SEO&AEO/aeo-command.md` — `/aeo` for AI search citation only

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before any task begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Fast subagents scan the target to establish a baseline across both SEO and AEO dimensions simultaneously:

> **Recommended subagent types:**
> - `web-scraper-fast` — audit live page content, heading structure, meta tags, and schema
> - `codebase-scanner-fast` — scan local site files for existing meta tags, schema, sitemap, and robots.txt

**Unified baseline scan — assess all signals in one pass:**

| Signal | SEO Impact | AEO Impact |
|--------|-----------|-----------|
| Title tag | Ranking signal | Entity identification |
| Meta description | CTR (indirect ranking) | Brand description |
| H1 and heading structure | On-page ranking | Content scannability for AI |
| Content format (paragraph vs. bullets) | Readability, dwell time | AI citation readiness |
| Schema.org markup | Rich Results eligibility | Entity clarity for AI |
| Source footprint (backlinks, citations) | Domain authority | AI trust signals |
| Conversational prompt coverage | Long-tail keyword targeting | Direct AI prompt matching |
| robots.txt / sitemap | Crawlability | Indexability for AI web crawlers |

**Return a Dual Discovery Summary:**
```
## Dual Discovery Summary
Target: [website/domain/page]
Task: [audit | content | schema | local | report | strategy | prompts | keywords | technical | backlinks]

SEO Status:
  Title tag: [optimized | missing | too long/short]
  Meta description: [optimized | missing | too long/short]
  Heading structure: [correct | multiple H1s | missing H1 | flat]
  Schema markup: [found — types | missing | partial]
  robots.txt: [found | missing | blocking key pages]
  Sitemap: [found | missing]
  Content depth: [thin <300w | adequate 300-800w | strong >800w]

AEO Status:
  Content format: [AEO-ready (bullets + 40-60w leads) | dense | N/A]
  Entity clarity in schema: [explicit | vague | missing]
  Source footprint: [strong | weak | unknown]
  Conversational prompts mapped: [yes — N | no]
  AI tracking active (Mentions.so): [yes | no | unknown]
```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent reviews the Dual Discovery Summary and:

1. **Maps gaps to both dimensions** — identifies which issues hurt only SEO, only AEO, or both
2. **Identifies shared fixes** — content structure and schema changes that close both gaps simultaneously
3. **Sequences work** — technical fixes first, then on-page, then content, then off-page
4. **Writes a unified execution plan** — one plan covering both SEO and AEO deliverables

> **Gate:** Do not proceed to Phase 3 until the execution plan is written and covers both SEO and AEO deliverables.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly writes or edits files. It uses the `Task` tool to spawn subagents for all file operations.

**Delegation map:**

| Work Type | Subagent |
|-----------|---------|
| Page content audit and live scraping | `web-scraper-fast` |
| Content rewriting (serves both SEO + AEO) | `documentation-manager-fast` |
| Schema.org markup generation | `file-operations-fast` |
| Technical files (robots.txt, sitemap) | `file-operations-fast` |
| Report and strategy writing | `documentation-manager-fast` |
| Keyword + prompt library files | `file-operations-fast` |
| Local site file scanning | `codebase-scanner-fast` |

---

## Agentic Skills — Applied Automatically

When `/search-optimize` is invoked, the following skill is activated:

| Skill | Trigger | Mandate |
|-------|---------|---------|
| `search-optimization` | Always | Unified single-pass workflow covering all SEO and AEO signals simultaneously |

---

## How SEO + AEO Align: The Shared Signal Map

Every optimization in this command is evaluated against both dimensions:

| Action | SEO Win | AEO Win |
|--------|---------|---------|
| Rewrite content with 40–60 word lead answers | Improved featured snippet eligibility | Exact format AI models extract answers from |
| Add H2/H3 question-format headings | Targets PAA (People Also Ask) boxes | Question-format headings match conversational prompts |
| Generate LocalBusiness schema | Google Local Pack + Rich Results | AI entity clarity — brand category and location explicit |
| Generate FAQPage schema | FAQ accordions in SERPs | AI can extract Q&A pairs as citation sources |
| Build source footprint (backlinks, citations) | Domain authority and ranking | AI trust signals — brand validated by third parties |
| Keyword research + conversational prompt mapping | Long-tail keyword targeting | Builds the exact prompts to test in Mentions.so |
| Local citations (GBP, directories) | Local Pack ranking | Third-party mentions AI reads as brand validation |

---

## Workflow — Task Types

### `audit` — Unified SEO + AEO Audit

```
/search-optimize audit https://example.com
/search-optimize audit https://example.com/services
```

A single-pass health check across all search visibility dimensions — both traditional and AI.

**Technical (SEO-primary):**
- robots.txt present and configured correctly?
- sitemap.xml present and linked?
- Canonical tags on duplicate/parameter URLs?
- HTTPS enforced sitewide?
- No accidental noindex on key pages?
- Redirect chains (A→B→C should be A→C)?

**On-Page (shared SEO + AEO):**
- Title tag: 50–60 chars, primary keyword in first 30 chars (SEO) + brand/entity named (AEO)
- Meta description: 150–160 chars, keyword + CTA (SEO) + brand description signal (AEO)
- Single H1 with primary keyword (SEO) + content scans as having a clear topic entity (AEO)
- H2/H3 as questions where applicable — targets PAA boxes (SEO) + matches conversational prompts (AEO)
- Content lead: Does each section open with a direct 40–60 word answer? (AEO + featured snippet SEO)
- Content follows with bullets: 3–5 points after each lead answer? (AEO + readability/dwell time for SEO)

**Schema (shared — highest cross-signal value):**
- `Organization` or `LocalBusiness` JSON-LD — Rich Results (SEO) + entity clarity (AEO)
- `FAQPage` schema — FAQ accordion in SERPs (SEO) + Q&A citation source for AI (AEO)
- `Service` schema — Service carousel (SEO) + what the brand offers (AEO)

**Source Footprint (shared):**
- Backlink profile quality and quantity (domain authority for SEO)
- Third-party mentions on review sites, forums, directories (AI trust signal for AEO)
- Google Business Profile presence (Local Pack for SEO + GBP mention = AI citation source)

**AI Prompt Coverage (AEO-primary):**
- Have conversational queries been mapped for the brand's category and location?
- Has the brand been tested in ChatGPT, Claude, or Perplexity for relevant queries?

**Output:** `SEO&AEO/unified-audit-[domain]-[date].md` — dual-scored audit with every issue flagged as SEO-only, AEO-only, or shared.

---

### `content` — Unified Content Optimization

```
/search-optimize content https://example.com/services [primary keyword]
/search-optimize content [paste content] [primary keyword]
```

Rewrites content once to serve both Google ranking and AI citation simultaneously. This is the highest-leverage single action in the unified workflow.

**Unified content rules (every rule serves both):**

1. **Lead with a 40–60 word direct answer**
   - SEO: Eligible for Google Featured Snippets
   - AEO: Exact format AI models extract and cite

2. **Follow with 3–5 bullet points**
   - SEO: Improves readability and reduces bounce rate
   - AEO: AI models prefer structured, scannable content

3. **Question-format H2/H3 headings**
   - SEO: Targets Google People Also Ask (PAA) boxes
   - AEO: Directly matches conversational user prompts

4. **Brand + category + location in first 100 words**
   - SEO: Geographic and topical relevance signals
   - AEO: Entity signal so AI knows who the brand is and what they do

5. **Primary keyword in title, H1, first 100 words, meta description**
   - SEO: Core on-page ranking signals
   - AEO: Helps AI classify the page's topic

6. **FAQ section with 5–8 Q&As, each answer 40–60 words**
   - SEO: FAQPage schema eligibility + long-tail keyword coverage
   - AEO: Direct citation source for AI answering category questions

7. **One E-E-A-T signal per page (credential, data, or source citation)**
   - SEO: Experience, Expertise, Authority, Trust ranking factor
   - AEO: AI models favor content from credible, authoritative sources

**Output:** Rewritten content inline or saved to `SEO&AEO/content-[page-slug]-[date].md`

---

### `schema` — Unified Schema Markup

```
/search-optimize schema [business type] [page type]
/search-optimize schema LocalBusiness homepage
/search-optimize schema Service services-page
/search-optimize schema FAQPage faq
```

Generates Schema.org JSON-LD that simultaneously earns Google Rich Results and provides AI entity clarity.

**Why schema is the highest-ROI unified action:**
- A complete `LocalBusiness` schema tells Google who the business is (Rich Results eligibility) AND tells AI models what the business does and where (AEO entity clarity)
- `FAQPage` schema creates FAQ accordions in Google SERPs AND gives AI models structured Q&A pairs to cite
- `sameAs` links to GBP, social profiles, and directories are backlink signals for SEO AND third-party validation for AEO

**Schema priority order (unified impact):**

| Priority | Schema Type | SEO Benefit | AEO Benefit |
|----------|------------|-------------|-------------|
| 1 | `LocalBusiness` / `Organization` | Knowledge Panel, Local Pack | Entity identity for AI |
| 2 | `FAQPage` | FAQ accordions in SERPs | AI Q&A citation source |
| 3 | `Service` | Service rich results | What the brand offers |
| 4 | `BreadcrumbList` | Breadcrumbs in SERPs | Content hierarchy signal |
| 5 | `Article` / `BlogPosting` | Top Stories, article snippets | Authoritative content source |

**Output:** Complete `<script type="application/ld+json">` blocks for all relevant schema types.

---

### `local` — Unified Local Search Optimization

```
/search-optimize local [business name] [location] [category]
/search-optimize local "Prime Electrical" "Auckland NZ" "electrical contractor"
```

Optimizes for local search visibility across both Google Local Pack and AI local recommendations.

**Why local is highly unified:**
- Google Business Profile earns Local Pack placement (SEO) AND is one of the first sources AI checks when recommending local businesses (AEO)
- Local citations on directories are ranking signals (SEO) AND third-party brand validation that AI trusts (AEO)
- NAP consistency matters for Google local ranking AND for AI models needing a consistent, unambiguous brand entity

**Unified local deliverables:**
1. Google Business Profile content: description (750 chars, keyword-rich), category, services, Q&As (10 pre-seeded), photo checklist, weekly Post template
2. `LocalBusiness` Schema.org JSON-LD with complete NAP, geo-coordinates, opening hours, `sameAs` links
3. NAP consistency verification — identical across website, GBP, and all directories
4. Citation target list (prioritized by AI + SEO impact):
   - Google Business Profile — #1 for both
   - Bing Places — SEO signal + Bing AI source
   - Apple Maps — AI assistant source
   - Industry directories (Trusted Traders, Master Trades NZ) — authority signals for both
   - Review platforms (Google Reviews, Facebook Reviews) — backlink + AI social proof
5. Suburb/area landing pages plan — targets geo-modified keywords (SEO) AND local AI recommendations (AEO)

**Output:** `SEO&AEO/local-search-[business]-[date].md`

---

### `keywords` — Unified Keyword + Prompt Research

```
/search-optimize keywords [topic or business description]
/search-optimize keywords "electrical contractor Auckland residential commercial"
```

Maps both traditional search keywords AND conversational AI prompts in a single research pass — because they often map to the same pages.

**Unified output per topic:**

| Topic | Traditional Keyword (SEO) | Conversational Prompt (AEO) | Target Page |
|-------|--------------------------|----------------------------|------------|
| Residential wiring | "residential electrician Auckland" | "Who is the best residential electrician in Auckland?" | /services/residential |
| EV charger install | "EV charger installation Auckland" | "Who installs EV chargers for homes in Auckland?" | /services/ev-chargers |
| Emergency callout | "emergency electrician Auckland 24 7" | "Who offers 24/7 emergency electrical services in Auckland?" | /emergency |

**Output:** `SEO&AEO/keyword-prompt-map-[topic]-[date].md` — unified map with keyword + prompt + page assignment per topic.

---

### `technical` — Technical Search Foundation

```
/search-optimize technical https://example.com
/search-optimize technical generate robots.txt [domain]
/search-optimize technical generate sitemap [pages]
```

Generates and fixes the technical files that affect both Google crawling (SEO) and AI web indexing (AEO). Google and AI models both use web crawlers — a correctly configured `robots.txt` and `sitemap.xml` matters for both.

**Deliverables:**
- `robots.txt` — allow all key pages, block admin/staging/duplicate paths
- `sitemap.xml` — all indexable pages with `<lastmod>`, `<changefreq>`, `<priority>`
- Canonical tag recommendations
- Redirect map (301s to consolidate duplicate URL variations)
- Core Web Vitals recommendations

**Output:** Technical files or recommendations saved to `SEO&AEO/technical-[domain]-[date].md`

---

### `meta` — Unified Meta Tags

```
/search-optimize meta https://example.com
/search-optimize meta [page description] [primary keyword]
```

Generates `<title>` and `<meta name="description">` tags optimized for click-through on Google SERPs and for brand entity recognition by AI models.

**Unified meta tag rules:**
- Title (50–60 chars): Primary keyword near start (SEO ranking) + brand name (AEO entity)
- Description (150–160 chars): Keyword + benefit + CTA (SEO CTR) + location + category signal (AEO entity)

---

### `backlinks` — Off-Page Authority (SEO + AEO Source Footprint)

```
/search-optimize backlinks [domain]
```

Builds off-page authority that simultaneously improves Google domain authority (SEO) and the brand's third-party source footprint that AI models read as credibility (AEO).

**Unified off-page targets (ranked by dual impact):**

| Source Type | SEO Benefit | AEO Benefit |
|-------------|-------------|-------------|
| Industry directory listings | Niche authority backlinks | AI-readable brand citations |
| Google Business Profile | Local authority | #1 AI local source |
| Review platforms (Google, Facebook) | Review schema + trust | Social proof AI models cite |
| Guest posts on industry sites | Topical authority links | Third-party editorial mentions |
| Local press / community | Local authority links | AI cites local news and community sources |
| Reddit / forum presence | Traffic + brand mentions | AI trains on Reddit — being there matters |

**Output:** `SEO&AEO/off-page-strategy-[domain]-[date].md`

---

### `report` — Unified Search Performance Report

```
/search-optimize report [domain]
```

A single report covering both SEO and AEO performance — traditional organic rankings alongside AI citation visibility.

**Report sections:**
1. **SEO performance:** Keyword rankings, organic traffic trend, top pages, technical issues resolved
2. **AEO performance:** AI citation rate per prompt, Share of Voice per model, sentiment classification
3. **Shared wins:** Actions taken that improved both (schema added, content reformatted)
4. **Top 5 gaps remaining:** Whether SEO, AEO, or both — ranked by business impact
5. **Next 30 days:** Prioritized action list

**Output:** `SEO&AEO/search-report-[domain]-[date].md`

---

### `strategy` — Unified Search Strategy

```
/search-optimize strategy [domain or business description]
```

A single phased strategy covering both search channels — no more running separate SEO and AEO strategies.

**Unified strategy phases:**

**Phase 1 — Technical Foundation (Week 1–2):**
- Technical SEO: robots.txt, sitemap, canonical tags, HTTPS, redirect chains
- AEO foundation: Schema.org markup (LocalBusiness + FAQPage), NAP consistency

**Phase 2 — On-Page & Content (Week 2–4):**
- SEO + AEO shared: Rewrite top 5 pages with unified content format (40–60 word leads + bullets + question H2s)
- SEO: Title tags, meta descriptions, internal linking, word count expansion
- AEO: FAQ sections, entity signals in first 100 words

**Phase 3 — Keyword + Prompt Mapping (Week 3–5):**
- SEO: Keyword map for all key pages and planned content
- AEO: Conversational prompt library (20–30 prompts) — test in ChatGPT, Claude, Perplexity; set up Mentions.so tracking

**Phase 4 — Local & Off-Page (Month 1–3):**
- SEO + AEO shared: GBP optimization, citation building, review generation
- SEO: Guest posts, broken link outreach
- AEO: Reddit/forum presence, third-party article pitching

**Phase 5 — Content Expansion (Month 2–4):**
- SEO: New pages targeting keyword gaps; blog posts for informational keywords
- AEO: New FAQ content for high-frequency AI prompts; knowledge base article format

**Phase 6 — Monitoring (Ongoing):**
- SEO: Monthly rank tracking, quarterly technical audits
- AEO: Weekly Mentions.so prompt tracking, monthly AI citation report
- Unified: Monthly `/search-optimize report` — one report covers both

**Output:** `SEO&AEO/search-strategy-[brand]-[date].md`

---

## The Decision Framework: Which Command to Use

| Situation | Use |
|-----------|-----|
| Starting fresh — optimize everything | `/search-optimize` (this command) |
| Deep dive into Google ranking only | `/seo-optimize` |
| Deep dive into AI citation only | `/aeo` |
| Generating AEO tracking prompts only | `/aeo prompts` |
| Schema only (one pass, both goals) | `/search-optimize schema` |
| Full unified strategy | `/search-optimize strategy` |
| Auditing both channels at once | `/search-optimize audit` |

---

## Usage

```
/search-optimize audit https://example.com
/search-optimize content https://example.com/services "residential electrician Auckland"
/search-optimize schema LocalBusiness homepage
/search-optimize local "Prime Electrical" "Auckland NZ" "electrical contractor"
/search-optimize keywords "electrical contractor Auckland"
/search-optimize technical generate robots.txt example.com
/search-optimize meta https://example.com/services "residential electrician Auckland"
/search-optimize backlinks example.com
/search-optimize report example.com
/search-optimize strategy "Prime Electrical — residential and commercial electrician in Auckland"
```

## Next Steps

After any `/search-optimize` task:
- Validate schema: search.google.com/test/rich-results
- Submit sitemap: Google Search Console → Sitemaps
- Test AI citation: paste prompts from keyword map into ChatGPT, Claude, and Perplexity
- Set up Mentions.so with the generated prompt library for daily AI monitoring
- Set up Google Search Console if not configured
- Use `/scrape` to pull competitor pages for content gap analysis
- Run `/search-optimize report [domain]` monthly to track both channels
