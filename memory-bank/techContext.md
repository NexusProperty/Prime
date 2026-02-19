# Technology Context

> AI agents read this to understand the tooling and make correct implementation decisions.

## Environment
- **Runtime:** Node.js (LTS)
- **Package Manager:** npm
- **IDE:** Cursor (Windows 10, Git Bash)
- **Path separator:** \ (Windows)

## Frontend (Per Site)
- **Framework:** Next.js 15 (App Router)
- **React:** React 19
- **Language:** TypeScript (strict mode)
- **Template:** Tailwind Salient (`tailwind-plus-salient/salient-ts/`)
- **Styling:** Tailwind CSS v4 (IMPORTANT: config via `@theme {}` in CSS, NOT tailwind.config.js)
- **UI Library:** Headless UI (`@headlessui/react`)
- **Class merging:** `clsx`
- **Image optimization:** `next/image` with `sharp`
- **Form styling:** `@tailwindcss/forms`
- **Code formatting:** Prettier + `prettier-plugin-tailwindcss`

## Tailwind v4 Notes (CRITICAL)
- No `tailwind.config.js` — theme customization lives in `src/styles/tailwind.css`
- Use `@theme { --color-brand: ... }` for custom tokens
- PostCSS plugin: `@tailwindcss/postcss` (not `tailwindcss` directly)
- All Tailwind directives: `@import 'tailwindcss'` at top of CSS file

## Backend / Services
- **Database:** Supabase (PostgreSQL) — central staging database
- **Auth:** Supabase Auth (to be configured)
- **Supabase packages:** `@supabase/supabase-js`, `@supabase/ssr` (for Next.js App Router)
- **Automation:** Make.com (webhook-based, connects form submissions to DB and email)
- **AI API:** OpenAI GPT-4o (`openai` npm package)
- **Voice AI:** Vapi.ai (3 separate phone numbers via Twilio)
- **Telephony:** Twilio
- **Job Management:** Simpro or Fergus (TBC) — receives confirmed jobs via webhook

## State Management (To Be Added)
- **Server state:** TanStack Query (`@tanstack/react-query`) — recommended when Supabase added
- **Client state:** React useState / useReducer for local UI state
- **Form state:** React Hook Form (if needed for booking forms)

## Testing (To Be Configured)
- **Unit:** Vitest (recommended — works natively with Next.js)
- **E2E:** Playwright (recommended)
- **Status:** Not yet configured

## Deployment (To Be Configured)
- **Hosting:** Vercel (recommended for Next.js)
- **CI/CD:** GitHub Actions (recommended)
- **Status:** Not yet configured

## Site Directory Structure (Per Site)
```
[site-name]/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (auth)/
│   ├── components/
│   ├── images/
│   └── styles/
│       └── tailwind.css
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```

## Path Conventions
- Import alias: `@/*` → `./src/*`
- Component imports: `@/components/Button`
- Image imports: `@/images/logo.png`
- Styles: `@/styles/tailwind.css`

## APIs & Services

| Service | Purpose | Status |
|---------|---------|--------|
| Supabase | Central database + auth | Planned — not yet configured |
| OpenAI GPT-4o | Cross-sell logic AI brain | Planned — not yet configured |
| Vapi.ai | Voice AI receptionist | Planned — Vapi account status TBC |
| Twilio | Telephony (3 phone numbers) | Planned — numbers TBC |
| Make.com | Automation / webhook routing | Planned — not yet configured |
| Simpro/Fergus | Job management (destination) | TBC — which platform? |

## Environment Variables (Per Site — .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
VAPI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
MAKE_WEBHOOK_URL=
```

## Key Config Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript — strict mode, `@/*` alias |
| `next.config.js` | Next.js config (minimal) |
| `postcss.config.js` | Tailwind v4 via @tailwindcss/postcss |
| `src/styles/tailwind.css` | Tailwind theme + custom tokens |
