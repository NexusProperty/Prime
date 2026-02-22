# SCRAPE Command - Website Page Data Extraction

Visits one or more URLs and extracts structured page data. Supports single-page scraping, multi-URL batch scraping, sitemap crawling, and targeted extraction modes. Output can be markdown, JSON, or CSV.

---

## Mandatory Pre-Execution Protocol (Discovery → Review → Execute)

> **This protocol is a prerequisite wrapper.** It must complete before the standard Workflow (below) begins. No phase may be skipped or reordered.

### Phase 1: Discovery (Fast Subagents)

Before any scraping begins, fast subagents are dispatched to validate targets and plan extraction:

> **Recommended subagent types:**
> - `web-scraper-fast` — validates URL accessibility, checks robots.txt, detects page type and site structure
> - `codebase-scanner-fast` — if scraping a known project site, scan local config for base URLs or sitemaps

1. **Validate each target URL:**
   - Confirm the URL is reachable (HTTP 200)
   - Check `robots.txt` for crawl restrictions
   - Detect page type: static content, SPA, e-commerce, blog, docs, etc.
   - Identify if a sitemap exists at `/sitemap.xml`
2. **Plan extraction scope:**
   - Single URL → direct page scrape
   - Multiple URLs → batch sequential scrape
   - Sitemap mode → parse `sitemap.xml`, extract all URLs, queue for batch scrape
3. **Return Discovery Summary:**
   ```
   ## Discovery Summary
   Mode: [single | batch | sitemap]
   Target URLs: [list]
   Robots.txt status: [allowed | restricted | not found]
   Page types detected: [static | SPA | e-commerce | blog | docs | other]
   Sitemap found: [yes — N pages | no]
   Estimated extraction volume: [small <10 pages | medium 10–50 | large >50]
   Recommended extract mode: [full | headings | links | text]
   ```

> **Subagent constraint:** Discovery subagents are **read-only**. They must not create, edit, or delete any files.

### Phase 2: Review (Main Agent)

The Main Agent receives the Discovery Summary and:

1. **Confirms scope** — verifies which URLs are in scope and which are restricted by robots.txt
2. **Selects extraction mode** based on user request:
   - `full` — title, meta, headings, body text, links, images, structured data
   - `headings` — H1, H2, H3 hierarchy only
   - `links` — all internal and external links
   - `text` — clean readable body text only
   - `structured` — JSON-LD / schema.org data only
3. **Selects output format:**
   - `markdown` — human-readable report per page
   - `json` — structured JSON per page, array for batch
   - `csv` — flat table for bulk analysis
4. **Writes execution plan** — lists each URL, extraction mode, and output destination

> **Gate:** Do not proceed to Phase 3 until scope, extraction mode, and output format are confirmed.

### Phase 3: Execution (Delegated by Main Agent)

> **MANDATORY DELEGATION RULE:** The Main Agent never directly navigates browsers or writes files. It uses the `Task` tool to spawn subagents for all scraping and file operations.

1. **Delegate to `web-scraper-fast`** for each URL (or batch):
   - Pass: target URL(s), extraction mode, output format
   - Receive: structured scrape output per page
2. **Delegate to `file-operations-fast`** to write output:
   - Default output path: `scrape-output/[domain]-[timestamp].[ext]`
   - User can specify a custom output path
3. **Main Agent verifies** output files are complete and correctly structured
4. **Follow-up loop** — if any URL failed or returned empty content, spawn a new `web-scraper-fast` with retry instructions

---

## Agentic Skills — Applied Automatically

When `/scrape` is invoked, the following skill is automatically activated:

| Skill | Trigger | Mandate |
|-------|---------|---------|
| `web-scraping` | Always | Browser navigation protocol, content extraction, robots.txt compliance |

---

## Workflow

### Mode: Single Page

```
/scrape https://example.com
```

1. Phase 1: Validate URL, check robots.txt, detect page type
2. Phase 2: Default to `full` extraction, `markdown` output
3. Phase 3: Scrape page, write to `scrape-output/example-com-[date].md`

### Mode: Multiple URLs

```
/scrape https://example.com/about https://example.com/services https://example.com/contact
```

1. Phase 1: Validate all URLs
2. Phase 2: Batch plan — sequential scrape of each URL
3. Phase 3: Each URL scraped and written as individual file or combined JSON

### Mode: Sitemap Crawl

```
/scrape sitemap https://example.com
```

1. Phase 1: Fetch `sitemap.xml`, extract all URLs
2. Phase 2: Review total page count, confirm scope (auto-cap at 50 pages unless overridden)
3. Phase 3: Batch scrape all pages, write combined output

### Mode: Targeted Extraction

```
/scrape https://example.com --extract headings
/scrape https://example.com --extract links
/scrape https://example.com --extract text
/scrape https://example.com --extract structured
```

Limits extraction to the specified data type. Faster and smaller output.

### Mode: Custom Output

```
/scrape https://example.com --format json
/scrape https://example.com --format csv
/scrape https://example.com --output MissionControl/scraped-data.json
```

---

## Output Formats

### Markdown (default)

```markdown
## Scrape Report — https://example.com
Scraped: 2026-02-22

**Title:** Example Domain
**Meta Description:** This domain is for use in illustrative examples.

### Headings
- H1: Example Domain

### Body Text
This domain is for use in illustrative examples in documents.

### Links
**Internal:** (none)
**External:**
- https://www.iana.org/domains/reserved

### Images
(none)

### Structured Data
(none)
```

### JSON

```json
{
  "url": "https://example.com",
  "scraped_at": "2026-02-22T12:00:00Z",
  "title": "Example Domain",
  "meta_description": "...",
  "headings": { "h1": ["Example Domain"], "h2": [], "h3": [] },
  "body_text": "...",
  "links": { "internal": [], "external": ["https://www.iana.org/domains/reserved"] },
  "images": [],
  "structured_data": null
}
```

---

## Environment & Dependencies

| Dependency | Purpose | Required |
|-----------|---------|----------|
| `cursor-ide-browser` MCP | Browser navigation and page access | Yes |
| `web-scraper-fast` agent | Extraction and structuring | Yes |
| `file-operations-fast` agent | Writing output files | Yes (if saving to disk) |

No additional npm packages or API keys required. The `cursor-ide-browser` MCP is used directly for browser access.

---

## Usage

```
/scrape https://example.com
/scrape https://site1.com https://site2.com https://site3.com
/scrape sitemap https://example.com
/scrape https://example.com --extract headings
/scrape https://example.com --extract links --format json
/scrape https://example.com --output MissionControl/competitor-data.json
```

## Next Steps

After `/scrape` completes:
- Review output in `scrape-output/` or the specified output path
- Use `/mission-control build` to ingest scraped data into the Mission Control database
- Use scraped link data to discover additional pages for a follow-up `/scrape sitemap`
- Feed scraped content into a RAG pipeline with `/vapi` for knowledge base population
