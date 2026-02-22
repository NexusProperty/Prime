---
name: web-scraping
description: Extract structured data from web pages using browser automation via the cursor-ide-browser MCP
when_to_use: When you need to visit a URL and extract page content — titles, headings, body text, links, images, or JSON-LD structured data. Use for competitive research, content audits, sitemap discovery, knowledge base population, or any task requiring live web data.
evidence: User mentions scraping, crawling, visiting URLs, extracting page data, reading website content, pulling links, or auditing site structure.
---

# Web Scraping Skill

## Overview

This skill provides the standard protocol for navigating to web pages and extracting structured data using the `cursor-ide-browser` MCP tools. It covers single-page scraping, batch URL scraping, sitemap crawling, and targeted extraction modes. All scraping is read-only and robots.txt compliant.

## Prerequisites

- `cursor-ide-browser` MCP must be available in the current Cursor workspace
- Target URLs must be publicly accessible (no login required)
- For the `/scrape` command: `web-scraper-fast` agent must be available in `agents/`

## Steps

### Step 1 — Check robots.txt

Before navigating to any content page, check the domain's robots.txt:

1. Navigate to `[domain]/robots.txt` using `browser_navigate`
2. Read the file for `Disallow:` rules matching your target path
3. If the path is disallowed: stop, report the restriction, do not proceed
4. If no robots.txt or path is allowed: proceed to Step 2

**Success Criteria:** robots.txt checked and access confirmed before any content page is visited.

### Step 2 — Navigate to the Target URL

```
browser_navigate(url: "https://example.com/page")
```

Wait 2 seconds after navigation. If the page is a known SPA or shows a loading state, wait an additional 2 seconds.

**Success Criteria:** Browser has navigated to the URL and the page has rendered (no loading spinner visible in snapshot).

### Step 3 — Take a Snapshot

```
browser_snapshot()
```

This captures the full DOM structure and visible text. Use the snapshot to:
- Confirm the page loaded correctly (title visible, main content present)
- Identify the structure of content containers
- Locate headings, links, images, and body text

**Success Criteria:** Snapshot returns a non-empty page with a visible title and body content.

### Step 4 — Extract Structured Data

From the snapshot, extract:

| Data Type | Source |
|-----------|--------|
| Title | `<title>` or first H1 |
| Meta description | `<meta name="description" content="...">` |
| Headings | All `<h1>`, `<h2>`, `<h3>` in document order |
| Body text | Main content container — strip nav, footer, sidebar |
| Internal links | `<a href>` where href starts with `/` or matches the domain |
| External links | `<a href>` where href is a different domain |
| Images | `<img src alt>` |
| Structured data | `<script type="application/ld+json">` content |

**Success Criteria:** All requested data types are extracted and none are empty/null without explanation.

### Step 5 — Handle Errors Gracefully

If a page returns an error or unexpected state:

| Situation | Action |
|-----------|--------|
| HTTP 404 | Log "Page not found", skip, continue batch |
| HTTP 403 | Log "Access denied", skip, continue batch |
| HTTP 500 | Log "Server error", retry once after 3 seconds, then skip |
| Empty body after 6 seconds | Log "Content did not load (possible auth wall or heavy SPA)", skip |
| Login wall detected | Log "Login required — cannot scrape", skip |

Never fail silently — every skipped URL must be reported.

**Success Criteria:** All errors are logged with reason; remaining URLs continue to be processed.

### Step 6 — Structure and Return Output

Format the extracted data according to the requested output format:
- `markdown` — human-readable Scrape Report (see `web-scraper-fast.md` for template)
- `json` — structured JSON object per page
- `csv` — flat row per page with columns: url, title, meta_description, h1, body_text_preview, internal_link_count, external_link_count

Return all output to the Main Agent — do not write files directly.

**Success Criteria:** Output is structured, complete, and ready for the Main Agent to write to disk or use downstream.

## Verification

After applying this skill, verify:
- [ ] robots.txt was checked for every domain before scraping
- [ ] No disallowed paths were scraped
- [ ] Every URL in the batch has a corresponding entry in the output (success or error)
- [ ] Output is in the requested format (markdown / json / csv)
- [ ] No credentials, passwords, or API tokens appear in the output
- [ ] All headings, links, and images are correctly classified

## Related

- Command: `commands/scrape.md` — the `/scrape` custom command that uses this skill
- Agent: `agents/web-scraper-fast.md` — the fast agent that executes this skill
- MCP: `cursor-ide-browser` — the browser automation layer
- Command: `/mission-control build` — use scraped data to populate the Mission Control database
- Command: `/vapi` — feed scraped content into a Vapi knowledge base for RAG
