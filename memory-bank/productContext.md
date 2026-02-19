# Product Context

> AI agents read this to understand what we're building.

## Problem Statement
Three separate trade/service companies (Prime Electrical, AKF Construction, CleanJet) operate independently, losing cross-selling revenue when customers don't know they can bundle services. Leads are also lost to missed calls and no after-hours coverage.

## Solution
A hub-and-spoke ecosystem where:
1. Three independent, high-performance websites serve their niche audiences
2. A shared AI brain (GPT-4o) detects cross-sell opportunities from every lead
3. A Voice AI receptionist (Vapi.ai) handles after-hours calls for all 3 numbers
4. A central Supabase database provides a "Golden Record" view of every customer

## Companies

### The Prime Electrical
- **Type:** Electrical services
- **Status:** Existing site — needs rescue and redesign onto Salient template
- **Immediate fixes:** Hardcode "10+ Years Experience" counter, fix typos ("Competent", "Recommend"), auto-format prices to $1,200.00
- **New features:** Mobile sticky footer (Call Now / Book Online), financing banner (Q Mastercard / GEM Visa), Hub Footer ("Part of the Prime Group")

### AKF Construction
- **Type:** Construction and renovation
- **Status:** New build on Salient template
- **Key UI:** Before/After sliders, Timeline Visualizer (Consultation → Build → Clean → Handover)

### CleanJet
- **Type:** Cleaning services
- **Status:** New build on Salient template
- **Key UI:** Instant booking (Select Rooms → Date → Pay), Subscription toggle (One-off vs Weekly -20%)

## Cross-Sell Logic ("Cross-Pollination Engine")
Every inbound lead triggers a Dependency Check:
- Electrical work → Does it need wall/ceiling access? → AKF opportunity
- Electrical work → Does it create dust/mess? → CleanJet opportunity
- Construction work → Does it need electrical rough-in? → Prime opportunity
- Construction work → Post-build clean? → CleanJet opportunity
- Cleaning enquiry → Electrical inspection? → Prime opportunity

## User Personas

### Persona 1: The Homeowner
- **Role:** Residential customer needing trade services
- **Needs:** Fast response, transparent pricing, trustworthy tradespeople
- **Pain Points:** Getting quotes from multiple companies, missed calls, no after-hours response

### Persona 2: The Business Owner (Commercial)
- **Role:** Commercial property or small business needing trade services
- **Needs:** Bundled service capability, single point of contact, reliability
- **Pain Points:** Coordinating multiple contractors for a single project

### Persona 3: The Receptionist / Admin (Internal)
- **Role:** Staff managing incoming leads and bookings
- **Needs:** All leads captured, no missed calls, leads auto-routed to job management software
- **Pain Points:** Manual data entry, leads falling through the cracks

## Key Features
1. **AI Voice Receptionist** — Vapi.ai on 3 Twilio numbers, emergency triage mode, cross-sell suggestions during calls
2. **Smart Form Parser** — AI reads contact form submissions, detects cross-sell opportunities, sends automated upsell replies
3. **Central Staging Database** — Supabase "Golden Record" linking customers across all 3 brands
4. **Cross-Sell Email Automation** — Make.com triggers personalized follow-up emails with bundle offers
5. **Job Management Sync** — Confirmed jobs push from Supabase to Simpro/Fergus via webhooks
6. **Hub Footer** — Cross-linking between all 3 sites for SEO benefit

## Success Metrics
- Zero missed leads (voice + form)
- Cross-sell conversion rate > 15% on eligible leads
- Lead-to-quote time < 2 hours (automated response)
- All 3 sites passing Core Web Vitals
- Single customer record visible across all 3 brands in Supabase
