# Project Brief

> A concise overview of the United Trades ecosystem.

## Project Name
United Trades — AI-Powered Multi-Brand Trade Services Ecosystem

## One-Line Description
A hub-and-spoke system connecting three trade/service companies (Prime Electrical, AKF Construction, CleanJet) through a shared AI brain that cross-sells services and automates lead management.

## Goals

1. Rebuild and rescue The Prime Electrical website (fix bugs, improve UX, mobile optimization)
2. Build new sites for AKF Construction and CleanJet on Next.js + Salient template
3. Deploy an AI cross-sell engine (GPT-4o) that detects opportunities across all 3 brands
4. Deploy AI Voice Receptionist (Vapi.ai) for after-hours call handling on all 3 numbers
5. Create a central Supabase staging database ("Golden Record") linking customers across all 3 brands
6. Integrate the staging database with existing job management software (Simpro/Fergus)

## Scope

### In Scope
- 3 Next.js websites built on Tailwind Salient template
- AI cross-sell logic engine (OpenAI GPT-4o)
- Voice AI receptionist (Vapi.ai + Twilio, 3 phone numbers)
- Smart email/form parser with automated upsell replies
- Central Supabase staging database with customer "Golden Record"
- Make.com automation workflows
- Supabase → Simpro/Fergus webhook integration

### Out of Scope
- Mobile app development
- Custom CRM build (using existing Simpro/Fergus)
- Social media management

## Companies
| Brand | Type | Status |
|-------|------|--------|
| The Prime Electrical | Electrical services | Existing site — needs rescue & redesign |
| AKF Construction | Construction/renovation | New build |
| CleanJet | Cleaning services | New build |

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + Tailwind CSS (Salient template) |
| AI Brain | OpenAI GPT-4o (via API) |
| Automation | Make.com |
| Voice AI | Vapi.ai + Twilio |
| Database | Supabase |
| Job Management | Simpro / Fergus / Tradify (TBC) |

## Timeline
| Phase | Milestone | Target |
|-------|-----------|--------|
| Phase 1 | Prime Electrical rescue (fixes + mobile CTA + SMS backup) | Weeks 1-2 |
| Phase 2 | Central DB + 3 site builds + AI prompt training | Weeks 3-6 |
| Phase 3 | Cross-sell connections + Voice AI deployment | Weeks 7-9 |
| Phase 4 | Job management software sync | Week 10 |
