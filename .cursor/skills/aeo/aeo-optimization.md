---
name: aeo-optimization
description: Optimize content, schema, and brand presence to be cited by AI models (ChatGPT, Claude, Gemini, Perplexity, Grok, DeepSeek, Meta AI, Google AI Overviews) in response to conversational queries.
when_to_use: When optimizing a page or brand for Answer Engine Optimization (AEO) — rewriting content for AI citation, generating Schema.org markup, building conversational prompt libraries, auditing source footprint, or analyzing AI Share of Voice.
evidence: User mentions AEO, AI SEO, LLM citation, AI search visibility, answer engine, AI share of voice, Mentions.so, being cited by AI, AI traffic, Perplexity ranking, ChatGPT recommendations, or zero-click visibility.
---

# AEO Optimization Skill

## Overview

This skill implements the complete Answer Engine Optimization methodology derived from `SEO&AEO/AEO.md`. AEO is the practice of making a brand the source AI models extract their answers from. Unlike traditional SEO (ranking in blue links), AEO targets **Zero-Click Visibility** — being cited inside the AI's answer paragraph across ChatGPT, Claude, Gemini, Perplexity AI, Grok, DeepSeek, Meta AI, and Google AI Overviews.

The skill covers four core optimization pillars:
1. **Content Format** — 40–60 word direct answers + bullet points
2. **Entity & Schema Clarity** — Schema.org JSON-LD that tells AI who the brand is and what it does
3. **Source Footprint** — third-party mentions that teach AI the brand is credible
4. **Prompt Coverage** — conversational queries the brand should appear in

## Prerequisites

- Target website URL or page content to analyze
- Business name, category, and location (for entity and schema generation)
- Access to `SEO&AEO/AEO.md` for methodology reference
- For live audits: `web-scraper-fast` agent available in `agents/`
- For schema generation: understanding of the site's CMS or how to insert `<script>` tags into `<head>`

## Steps

### Step 1 — Identify the AEO Gap

Assess the brand's current position across all four pillars:

**Content Format check:**
- Does every section lead with a direct answer in 40–60 words?
- Are supporting details in bullet or numbered list format?
- Are headings written as questions (H2: "What does [Brand] do?") rather than labels (H2: "About Us")?
- Are paragraphs 4 lines or fewer?

**Entity & Schema check:**
- Is there `Organization` or `LocalBusiness` JSON-LD on the homepage?
- Does the schema name the business, its category, location, and services explicitly?
- Are FAQs marked up with `FAQPage` schema?

**Source Footprint check:**
- Is the brand mentioned on Reddit, industry forums, Google Maps, or review sites?
- Are there third-party comparison articles that include the brand?
- Does the brand appear in "best of" or "top [category]" lists from other publishers?

**Prompt Coverage check:**
- Has the brand mapped 15–30 conversational queries users might ask AI about their category?
- Have these prompts been tested in ChatGPT, Claude, or Perplexity to check citation?

**Success Criteria:** All four pillars assessed. Gaps ranked by impact (content format is usually highest ROI first).

---

### Step 2 — Rewrite Content for AI Citation Format

For each target page or section:

1. **Identify the primary question** the page answers (e.g., "Who is [Brand] and what do they do?")
2. **Write the lead answer** — a direct, complete response in 40–60 words. This must:
   - Name the brand, category, and location in the first sentence
   - State the core value proposition clearly
   - Be readable as a standalone AI answer if extracted from the page
3. **Add supporting bullets** — 3–5 specific, factual points after the lead answer
4. **Rewrite headings as questions** — every H2/H3 becomes a question the section answers
5. **Add a FAQ section** with 5–8 Q&A pairs, each answer in 40–60 words

**Example transformation:**

Before (dense, AI-invisible):
> "At Acme Electrical, we have been providing residential and commercial electrical services to the Auckland region since 2005. Our team of qualified electricians is committed to delivering high-quality workmanship..."

After (AEO-optimized, AI-citable):
> **Who is Acme Electrical?**
> Acme Electrical is an Auckland-based electrical contractor specializing in residential and commercial electrical services since 2005. They offer wiring, panel upgrades, EV charger installation, and emergency callouts across the Auckland region, with a team of fully qualified, registered electricians.
>
> - Licensed and registered with the Electrical Workers Registration Board
> - Available for residential, commercial, and industrial projects
> - Emergency callout service available 24/7
> - Free quotes for all new projects

**Success Criteria:** Every section has a 40–60 word lead answer, followed by bullets. No dense paragraph exceeds 4 lines.

---

### Step 3 — Generate Schema.org Markup

Produce complete `application/ld+json` Schema.org markup for the business:

**Always include for any business:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "description": "[40-60 word description matching AEO content]",
  "url": "[website URL]",
  "telephone": "[phone]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[street]",
    "addressLocality": "[city]",
    "addressRegion": "[region]",
    "postalCode": "[postcode]",
    "addressCountry": "[country code]"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[lat]",
    "longitude": "[long]"
  },
  "openingHoursSpecification": [...],
  "sameAs": ["[Google Maps URL]", "[Facebook URL]", "[LinkedIn URL]"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "[Service 1]" } }
    ]
  }
}
```

Also generate `FAQPage` schema for FAQ content:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": { "@type": "Answer", "text": "[40-60 word answer]" }
    }
  ]
}
```

**Success Criteria:** Schema validates without errors in Google's Rich Results Test. All `sameAs` URLs are live. Entity name, category, and location are explicit in the schema.

---

### Step 4 — Build the Conversational Prompt Library

Generate 20–30 conversational prompts organized by category that should return the brand as a cited answer:

**Template categories:**
- Discovery: "What are the best [category] in [location]?"
- Problem-solving: "Who should I call when [specific problem] in [location]?"
- Comparison: "What is the difference between [A] and [B]?"
- Validation: "Is [Brand Name] a good [category] in [location]?"
- How-to: "How do I find a reliable [category] near me?"
- Cost: "How much does [service] cost in [location]?"
- Urgency: "Who offers emergency [service] in [location]?"

**For each prompt, include:**
- The prompt text (copy-paste ready for Mentions.so or manual testing)
- The category (discovery / problem / comparison / validation / how-to / cost / urgency)
- The target model to test first (ChatGPT, Perplexity, or Claude — whichever is most relevant for the category)

**Success Criteria:** 20+ prompts generated across at least 4 categories. Each prompt is conversational (not a keyword string). Prompts include location signals and category signals.

---

### Step 5 — Source Footprint Audit & Recommendations

Assess and expand where AI models can find third-party validation of the brand:

**Existing footprint check:**
- Google Business Profile (verified?)
- Industry-specific directories (e.g., Master Electricians NZ, Trusted Traders)
- Review platforms (Google Reviews, Facebook Reviews, Trustpilot)
- Social platforms (Reddit, LinkedIn, Facebook)
- Forum mentions (local Facebook groups, community forums)
- Third-party articles or press (local news, industry publications)

**Recommendations by footprint gap:**

| Gap | Recommended Action |
|-----|-------------------|
| No Google Business Profile | Create and verify GBP — highest AI signal |
| No industry directory listings | Submit to top 3 industry directories |
| Fewer than 20 Google Reviews | Launch a review generation campaign |
| No third-party articles | Pitch local media or write guest posts for industry sites |
| No Reddit/forum presence | Answer relevant questions on Reddit and local Facebook groups |

**Success Criteria:** At least 5 specific, actionable source footprint recommendations produced. Each recommendation includes the platform name and the specific action to take.

---

### Step 6 — Validate AEO Readiness

Before delivering output, run a final self-check:

- [ ] Every section has a 40–60 word lead answer (not buried mid-paragraph)
- [ ] All supporting detail is in bullets — no walls of text
- [ ] All headings are question-format where applicable
- [ ] Schema JSON-LD is syntactically valid (no missing commas, brackets, or quotes)
- [ ] Schema includes business name, category, location, and at least one service
- [ ] Prompt library contains 20+ prompts across at least 4 categories
- [ ] At least 5 source footprint recommendations are specific and actionable
- [ ] FAQ section present on target page with 5–8 Q&A pairs

**Success Criteria:** All checklist items pass. Output is ready to implement.

## Verification

After applying this skill, verify:
- [ ] Content format: every section leads with 40–60 word direct answer + bullets
- [ ] Schema: JSON-LD blocks are valid and complete
- [ ] Prompt library: 20+ conversational prompts generated
- [ ] Source footprint: gaps identified with specific actions
- [ ] FAQ: present with AEO-formatted answers
- [ ] No SEO keyword-stuffing pattern — AEO content reads naturally as a spoken answer

## Related

- Command: `SEO&AEO/aeo-command.md` and `commands/aeo.md` — the `/aeo` command that uses this skill
- Methodology: `SEO&AEO/AEO.md` — full AEO methodology reference (Mentions.so)
- Command: `/scrape` — use to pull competitor content for gap analysis
- Command: `/mission-control build` — ingest AEO performance data into Mission Control
- Tool: Mentions.so — recommended platform for daily AI prompt tracking and reporting
