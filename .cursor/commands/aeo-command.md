# AEO Command - Answer Engine Optimization

Answer Engine Optimization (AEO) is the practice of making your brand the source AI models cite when answering user queries. Unlike traditional SEO (ranking in blue links), AEO targets **Zero-Click Visibility** — becoming the reference point inside the AI's answer paragraph itself.

This command governs AEO strategy, content optimization, schema implementation, AI prompt tracking, and competitor benchmarking across all AI search platforms: ChatGPT, Claude, Gemini, Perplexity AI, Grok, DeepSeek, Meta AI, and Google AI Overviews.

**Methodology reference:** `SEO&AEO/AEO.md`

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before any AEO task begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before acting, fast subagents scan the project and target website to establish AEO baseline:

> **Recommended subagent types:**
> - `codebase-scanner-fast` — scan for existing content, schema markup, and site structure
> - `web-scraper-fast` — audit live page content, heading structure, and meta data

1. **Read the methodology reference:** `SEO&AEO/AEO.md`
2. **Identify the target:** Which website, page, or brand is being optimized?
3. **Scan existing content** (if project contains site files):
   - Heading structure (H1–H3 hierarchy)
   - Existing Schema.org markup (`application/ld+json`)
   - Meta descriptions and page titles
   - Content density (is body text in dense paragraphs vs. scannable format?)
4. **Check source footprint:** Note any existing third-party mentions, review sites, or forum presence referenced in the project
5. **Return Discovery Summary:**
   ```
   ## AEO Discovery Summary
   Target: [website/brand/page]
   Task: [audit | prompts | content | schema | competitors | report | strategy]
   Content format status: [scannable | dense — needs reformatting]
   Schema markup: [found — types present | missing | partial]
   Source footprint: [strong | weak | unknown]
   AI tracking prompts: [configured | none found]
   Competitor data: [available | unavailable]
   ```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent reviews the Discovery Summary and:

1. **Confirms the task type** from the user's request (see Workflow below)
2. **Assesses AEO gap** — where does the brand currently fail AI citation criteria?
3. **Prioritizes work** — which gap has the highest impact: content format, schema, or source footprint?
4. **Writes an execution plan** — lists exactly what will be produced in Phase 3

> **Gate:** Do not proceed to Phase 3 until the task type, target URL/brand, and execution plan are confirmed.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly writes or edits files. It uses the `Task` tool to spawn subagents for all file operations.

**Delegation map:**

| Task | Subagent |
|------|---------|
| Content audit and rewriting | `documentation-manager-fast` |
| Schema.org markup generation | `edge-function-developer-fast` or `file-operations-fast` |
| Strategy and report writing | `documentation-manager-fast` |
| Prompt list generation | `file-operations-fast` |
| Web page content scan | `web-scraper-fast` |
| File creation and saving | `file-operations-fast` |

---

## Agentic Skills — Applied Automatically

When `/aeo` is invoked, the following skill is activated:

| Skill | Trigger | Mandate |
|-------|---------|---------|
| `aeo-optimization` | Always | Content formatting for AI citation, entity clarity, source footprint analysis |

---

## Workflow — Task Types

### `audit` — AEO Content & Technical Audit

```
/aeo audit https://example.com
/aeo audit https://example.com/services
```

A full AEO health check of a page or domain across all four technical dimensions:

**1. Content Format Audit**
- Is the main answer to each topic stated in the first 40–60 words of a section?
- Are key points in bullet or numbered list format after the lead answer?
- Are paragraphs shorter than 4 lines? Dense wall-of-text content is invisible to AI.
- Does each section have a clear H2 or H3 that matches a conversational question?

**2. Entity & Schema Audit**
- Is there `Organization` or `LocalBusiness` Schema.org JSON-LD on the homepage?
- Are products, services, and FAQs marked up with Schema?
- Does the schema clearly name what the business IS and DOES (not just who it is)?
- Are NAP (Name, Address, Phone) signals consistent across all schema instances?

**3. Source Footprint Audit**
- Does the brand have presence on Reddit, industry forums, and review platforms?
- Are there third-party articles citing the brand from authoritative sources?
- Does the brand appear in "best of" or comparison content other sites have written?

**4. Conversational Prompt Coverage**
- Has the brand mapped the conversational queries users might ask AI about their category?
- Would the brand appear if an AI was asked: "What is the best [category] in [location]?"

**Output:** `SEO&AEO/audit-[domain]-[date].md` — a scored AEO report with specific, prioritized fixes.

---

### `prompts` — Generate AI Tracking Prompts

```
/aeo prompts [business type] [location] [target audience]
/aeo prompts "electrical contractor" "Auckland, NZ" "homeowners and small businesses"
```

Generate a library of conversational prompts that should return the brand as a cited answer. These are used for daily monitoring in tools like Mentions.so.

**Categories of prompts generated:**
- **Category prompts:** "What are the best [services] in [location]?"
- **Problem prompts:** "Who should I call if [specific problem]?"
- **Comparison prompts:** "What is the difference between [option A] and [option B]?"
- **How-to prompts:** "How do I find a reliable [service provider] in [location]?"
- **Brand validation prompts:** "Is [Brand Name] a good [service provider]?"

**Output:** `SEO&AEO/ai-tracking-prompts-[date].md` — a structured prompt library organized by category, ready to paste into Mentions.so or any AI model for manual testing.

---

### `content` — Rewrite Content for AI Citation

```
/aeo content [page URL or paste content]
/aeo content https://example.com/services
```

Rewrites existing page content to meet AEO citation standards:

**Rewriting Rules (non-negotiable):**
1. **Lead with the direct answer** — the first sentence of every section must state the answer in 40–60 words
2. **Follow with bullets** — supporting details go into 3–5 bullet points after the lead answer
3. **Use question-format H2/H3 headings** — "What is [X]?" beats "About [X]"
4. **One idea per paragraph** — no paragraph longer than 4 lines
5. **Include entity signals** — brand name, location, service category must appear naturally in the first 100 words
6. **Add a FAQ section** — 5–8 questions AI models commonly ask about this category, each with a direct 40–60 word answer

**Output:** Rewritten content delivered inline or saved to `SEO&AEO/content-[page-slug]-[date].md`

---

### `schema` — Generate Schema.org Markup

```
/aeo schema [business type] [page type]
/aeo schema "LocalBusiness" homepage
/aeo schema "Service" services-page
/aeo schema "FAQPage" faq
```

Generates complete, valid Schema.org JSON-LD markup for AI entity clarity.

**Schema types supported:**

| Type | When to use |
|------|------------|
| `Organization` | Brand identity and entity definition (all sites) |
| `LocalBusiness` | Location-based businesses |
| `Service` | Individual service pages |
| `FAQPage` | FAQ sections or pages |
| `Product` | E-commerce product pages |
| `Review` / `AggregateRating` | Review sections |
| `BreadcrumbList` | Navigation structure |
| `WebSite` | Site-level sitelinks search box |

**Output:** Complete `<script type="application/ld+json">` blocks ready to paste into the page `<head>`.

---

### `competitors` — AEO Competitor Analysis

```
/aeo competitors [category] [location]
/aeo competitors "electrical contractors" "Auckland NZ"
```

Analyzes which competitors dominate AI Share of Voice in the target category and why.

**What this produces:**
1. A list of 3–5 competitor brands and why AI models cite them (content format, schema, source footprint)
2. Content gap analysis — what topics they cover that the brand doesn't
3. Prompt coverage gap — which conversational queries they win that the brand loses
4. Actionable recommendations to close the gap

**Output:** `SEO&AEO/competitor-aeo-analysis-[date].md`

---

### `report` — AEO Performance Report

```
/aeo report [domain]
```

Generates a structured AEO performance report summarizing current status, actions taken, and next priorities.

**Report sections:**
- AI Share of Voice summary (which models cite the brand, for which prompts)
- Sentiment classification (Very Positive / Neutral / Negative per model)
- Content improvements made and their impact
- Source footprint growth (new third-party mentions)
- Top 5 remaining gaps
- Recommended next 30 days of AEO actions

**Output:** `SEO&AEO/aeo-report-[domain]-[date].md`

---

### `strategy` — Full AEO Strategy

```
/aeo strategy [domain or brand description]
```

Creates a comprehensive, phased AEO strategy for a brand starting from scratch or a weak baseline.

**Strategy phases:**
1. **Foundation (Week 1–2):** Schema markup, content format fixes for top 5 pages, NAP consistency
2. **Prompt Library (Week 2–3):** Build and test 20–30 AI tracking prompts in Mentions.so
3. **Content Expansion (Month 1–2):** Fill content gaps identified by competitor analysis, add FAQ pages
4. **Source Footprint (Ongoing):** Submit to directories, earn review site presence, pitch for third-party articles
5. **Monitoring (Ongoing):** Daily prompt tracking, monthly reports, quarterly strategy reviews

**Output:** `SEO&AEO/aeo-strategy-[brand]-[date].md`

---

## AEO vs. SEO Quick Reference

| Dimension | Traditional SEO | AEO |
|-----------|----------------|-----|
| Goal | Rank in blue links | Be cited inside AI answers |
| Metric | Position #1–10 | Share of Voice in AI responses |
| Content format | Keyword density | 40–60 word direct answers + bullets |
| Tracking | Google Search Console | Mentions.so or manual LLM testing |
| Entity signals | Backlinks | Schema markup + third-party mentions |
| Query type | Keywords | Conversational prompts |

---

## Usage

```
/aeo audit https://example.com
/aeo prompts "electrical contractor" "Auckland NZ" "homeowners"
/aeo content https://example.com/services
/aeo schema LocalBusiness homepage
/aeo competitors "electricians" "Auckland NZ"
/aeo report example.com
/aeo strategy "Prime Electrical — residential and commercial electrician in Auckland"
```

## Next Steps

After any `/aeo` task:
- Test tracking prompts manually in ChatGPT, Claude, and Perplexity to validate brand citation
- Set up Mentions.so with the generated prompt library for daily AI visibility monitoring
- Apply schema markup to all key pages and validate with Google's Rich Results Test
- Use `/scrape` to pull competitor content for gap analysis
- Schedule monthly `/aeo report` to track progress
