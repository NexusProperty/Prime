# Phase A Execution Summary: Multi-Brand UI Redesign

**Project:** The Nexus Property "Hub-and-Spoke" Website Ecosystem (Prime Electrical, AKF Construction, CleanJet)
**Date:** February 2026
**Framework:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Headless UI

---

## 1. Executive Summary

Phase A of the project focused on the complete UI/UX build and iterative redesign of three distinct Next.js web applications operating within a single monorepo architecture. The primary objective was to establish a high-performance "Hub-and-Spoke" model while giving each brand a distinctly premium, industry-authentic visual identity that outperforms local competitors in the Auckland, NZ market.

## 2. The Design Evolution Journey

The design process underwent several rapid iterations to hone the perfect aesthetic for each brand:

1. **Initial Foundation (Demo UI):** Built out the initial component architecture (`Hero`, `Header`, `PrimaryFeatures`, `CallToAction`) using the `@UI-Blocks` and `@tailwind-plus-commit` design systems as a solid foundation.
2. **Competitive Alignment:** Redesigned the sites referencing top-tier competitors (e.g., *Mitsubishi Comfort* for Prime, *Solid Build* for AKF, and *MyClean* for CleanJet) to establish market credibility.
3. **The "Masterclass" Overhaul:** Pushed the creative boundaries by introducing bespoke micro-interactions (e.g., "The Demolition Reveal" for AKF, the "Interactive Solar Map" for Prime, and the "Dirt to Shine" animation for CleanJet).
4. **The Pivot to "Ruthless Minimalism" (Final Polish):** Addressed feedback that the designs felt too "app-like" or "cartoony." Executed an aggressive pivot for AKF Construction and Prime Electrical, stripping away soft elements (excessive rounded corners, pastel glows, standard cards) in favor of heavy, grounded, industry-authentic interfaces. CleanJet's sterile aesthetic was deemed perfect and explicitly "locked in."

---

## 3. Detailed Website Breakdowns

### 🏗️ AKF Construction: "The Drafting Table"
**Objective:** To feel robust, trustworthy, grounded, and engineered.
**Aesthetic:** Brutalist minimalism, stark architectural lines, heavy typography, and high-contrast photography.

*   **Header:** Shifted to a sharp, high-contrast utility bar with heavy `border-b-4`. Removed soft shadows; implemented a stark, square logo block.
*   **Hero Section:** Replaced generic CTA buttons with a minimalist "hairline underline" interaction. Utilized a massive `font-display` brutalist headline ("We Build Auckland.") set against a pure white background with a right-aligned, grayscale architectural photograph. Added coordinate stamps (Auckland, NZ // EST 2010).
*   **Primary Features (Capabilities):** Removed standard "cards." Implemented a typographic accordion list on the left. The right side features a persistent "Drafting Grid" texture; hovering over a list item reveals a high-res project image overlaid with a blueprint blue multiply effect.
*   **Featured Projects:** A stark portfolio list. Removed grid gaps and card borders. Heavy typography acts as the primary visual element, with project imagery revealing only on desktop hover (greyscale images translating into view).
*   **Call To Action:** "Industrial Grade Trust." Utilized caution striping patterns, diagonal skew lines, and sharp, uppercase CTA buttons (`CALL 09-951-8763`).

### ⚡ Prime Electrical: "The Minimal Schematic"
**Objective:** To feel precise, clinical, intelligent, and highly technical.
**Aesthetic:** Clean white/slate backgrounds, "conductive trace" UI elements, terminal-style interactions, and technical HUD (Heads-Up Display) overlays.

*   **Header:** Transformed into a "Top Telemetry Bar" featuring a pulsing green `SYSTEM NOMINAL` light. The main navigation resembles a clinical interface with uppercase `font-mono` tracking, removing standard soft hover states in favor of sharp underline reveals.
*   **Hero Section:** A clinical split-screen layout. The right side features high-res macro photography of electrical components overlaid with a subtle technical grid. The left side uses a pulsing terminal input (`> INITIATE DIAGNOSTIC`) instead of a traditional CTA button, paired with stamped "Master Electrician" trust credentials.
*   **Primary Features (System Architecture):** Replaced standard feature checklists with an interactive "Conductive Trace Lines" UI. Selecting a service (Solar, Mains, Automation) updates a hard-edged "Data Display Panel" that outputs specific system metrics (e.g., `Latency: <10ms`, `Capacity: 100A per phase`) resembling a system diagnostic screen.
*   **Call To Action:** "Commence Operations." Uses a dark blue-950 background with a subtle circuit board SVG pattern overlay. Financing options are displayed in stark, border-defined blocks, leading to a final "Submit Schematics" CTA.

### 🧼 CleanJet: "The Sterile Execution" (Locked In)
**Objective:** To feel pristine, frictionless, hygienic, and instantly trustworthy.
**Aesthetic:** White and sky-blue color palette, clinical grid layouts, sharp corners, and highly structured, legible forms.

*   **Hero Section:** A pristine architectural background image overlaid with a clinical-grade grid. Features a "Clinical Booking Form" directly in the hero with sharp corners and clear toggles, driving immediate conversions without "app-like" fluff.
*   **Features & Trust Signals:** Removed playful "Dirt to Shine" scroll animations in favor of a static, highly legible layout highlighting "Clinical Verification" and "Eco-Sterile Solutions."
*   **Design Lock:** The user explicitly approved this sterile, highly professional aesthetic, and it was locked in without undergoing the aggressive minimalist pivot applied to the other two brands.

---

## 4. Technical & Operational Achievements

1.  **Monorepo Deployment:** Successfully configured and deployed all three Next.js applications independently to Vercel via the Vercel CLI from a single Git repository.
2.  **Git History Scrubbing:** Encountered a GitHub file size limit error (141MB `.node` binary in `node_modules`). Resolved this by implementing a comprehensive `.gitignore` and executing a `git filter-branch` history rewrite to permanently purge the large file from the repository, enabling a successful force push to the `main` branch.
3.  **Linter Compliance:** Continuously monitored and resolved Tailwind CSS v4 deprecation warnings (e.g., updating `bg-gradient-to-r` to `bg-linear-to-r` and fixing aspect ratio utility syntax) during the component rewrite process.

## 5. Next Steps

With Phase A (UI Redesign & Build) completed, the code pushed to GitHub, and live URLs established on Vercel, the project is primed for the next phase. Potential next steps include:
*   Integrating a headless CMS (e.g., Sanity or Contentful) for dynamic portfolio and service content.
*   Implementing backend API routes (e.g., connecting the "Clinical Booking Form" or "Submit Schematics" CTAs to email or a CRM).
*   Finalizing SEO metadata, sitemaps, and analytics integration.