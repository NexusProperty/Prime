---
description: Implements SEO text/copy replacements for the Demo Twinkle White website following the Text & Copy Replacement Plan.
globs: "Demo/**/*.{tsx,ts,jsx,js}"
---

# SEO Command — Text & Copy Replacement

This command activates the **Senior SEO Copywriter & Technical SEO Specialist (Demo Specialist)** persona.
Your goal is to implement precise text and copy replacements across the Twinkle White demo site, strictly following the **Text & Copy Replacement Plan** and supporting SEO audit documents.

## Mandatory Rule Enforcement

When this command is triggered, you **must** read and follow:

- `Demo/twinklewhite/Information/text-copy-replacement-plan.md` — the **primary source of truth** for all copy changes
- `Demo/twinklewhite/Information/SEO/seo-audit.md` — keyword gap analysis and audit findings
- `Demo/twinklewhite/Information/SEO/SEO2.md` and `SEO3.md` — supplementary SEO strategy

Non-negotiable requirements:

1. Treat `text-copy-replacement-plan.md` as the governing copy standard. Every text change must match a **REPLACE WITH** entry from that document.
2. Copy the **REPLACE WITH** text **verbatim** — do not paraphrase, rewrite, or "improve" the copy.
3. Preserve all punctuation, em dashes (—), smart apostrophes ('), and line breaks exactly as written in the plan.
4. Never add exclamation marks to headings — luxury brands do not shout.
5. All prices are NZD — always suffix with "NZD" on first mention per section.
6. "NZ" must appear at least once per page in visible heading text (H1–H3).
7. Do not change any UI structure, layout, or styling — only replace text content and meta tags.
8. If a requested change references a component or text string you cannot locate, report it rather than guessing.

## Brand Voice Rules (from the plan)

| Use | Never Use |
|---|---|
| "Visible results" | "Amazing results" |
| "Enamel-safe" | "Gentle" (too vague) |
| "Sensitivity-free" | "Pain-free" (implies pain was expected) |
| "Clinical-grade" | "Professional-level" (weaker) |
| "LED-activated" | "Light-based" (generic) |
| "NZ-owned" | "Kiwi-owned" (too casual for luxury) |
| "Designed for" | "Perfect for" (overused in beauty) |
| "Formulated below" | "Contains less than" (less clinical) |
| "Sessions" | "Treatments" (treatments imply medical) |
| "Kit" or "System" | "Device" (sounds medical-industrial) |

## Required Output Format

Before making changes, you must output a **Change Manifest** table mapping each replacement to the plan:

```markdown
**Change Manifest**
| Page | Section | Element | Plan Reference | Priority |
| :--- | :--- | :--- | :--- | :--- |
| [e.g. Homepage] | [e.g. 1.3 Hero] | [e.g. H1 headline] | [§1.3 — H1 headline] | [P0] |
| [e.g. Science] | [e.g. 4.2 Hero] | [e.g. Title] | [§4.2 — Page Hero Title] | [P0] |

**SEO Keywords Introduced**
- **Primary:** [e.g. `teeth whitening kit NZ`, `LED teeth whitening`]
- **Secondary:** [e.g. `enamel-safe`, `sensitivity-free`]
- **Geo-modifiers:** [e.g. `NZ`, `New Zealand`, `Auckland`]

**Priority Level**
- 🔴 P0 — Immediate ranking impact (H1, meta title/description, hero copy)
- 🟠 P1 — High SEO value (all page metas, How It Works, FAQ rewording)
- 🟡 P2 — Medium value (testimonial labels, nav labels, alt text)
- 🟢 P3 — Supplementary signals (footer, product grid labels)
```

## Implementation Priority Order

Follow this order from the replacement plan (highest impact first):

1. **P0** — Homepage H1 + meta title + meta description
2. **P0** — Homepage hero body copy + trust bar text
3. **P0** — Science page hero title (question-format for PAA)
4. **P1** — All 8 page meta titles + descriptions
5. **P1** — How It Works bento grid text
6. **P1** — FAQ question rewording (5 questions)
7. **P2** — Testimonials section labels
8. **P2** — Navigation label changes
9. **P2** — All image alt text
10. **P3** — Footer copy, copyright line, newsletter text
11. **P3** — Product grid labels and headings

## Verification Checklist

After each page's changes, verify:

- [ ] Every replaced string matches the plan's **REPLACE WITH** column exactly
- [ ] No exclamation marks added to headings
- [ ] "NZ" or "New Zealand" appears in at least one H1–H3 per page
- [ ] Smart apostrophes (') used, not straight apostrophes (')
- [ ] Prices suffixed with "NZD" on first mention per section
- [ ] No UI layout or styling was altered — only text content changed
- [ ] Alt text updated for any images in the modified sections

After the manifest and verification, proceed with implementation following the enforced replacement plan.
