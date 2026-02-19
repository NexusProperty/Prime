# System Patterns

> AI agents read this to follow the project's architecture conventions.

## Architecture Overview
**Hub-and-spoke multi-site monorepo.**
- 3 independent Next.js 15 App Router sites (spokes)
- Shared Supabase database (hub — "Golden Record")
- Shared AI logic (GPT-4o cross-sell engine, called via Make.com)
- Shared Voice AI (Vapi.ai — 3 phone numbers, 1 AI brain)

```
                    ┌─────────────────────┐
                    │   Supabase DB (Hub)  │
                    │  "Golden Record"     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
   ┌──────────▼──────┐ ┌───────▼───────┐ ┌─────▼──────────┐
   │ Prime Electrical │ │AKF Construction│ │   CleanJet     │
   │  Next.js Site   │ │ Next.js Site  │ │ Next.js Site   │
   └──────────────────┘ └───────────────┘ └────────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     Make.com        │
                    │  (Automation Hub)   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
   ┌──────────▼──────┐ ┌───────▼───────┐ ┌─────▼──────────┐
   │  GPT-4o API     │ │  Vapi.ai      │ │ Simpro/Fergus  │
   │ (Cross-sell AI) │ │ (Voice AI)    │ │ (Job Mgmt)     │
   └─────────────────┘ └───────────────┘ └────────────────┘
```

## Frontend Patterns

### Component Structure
- Named exports: `export function Button(...)`
- PascalCase filenames: `Button.tsx`, `Hero.tsx`, `PrimaryFeatures.tsx`
- All components in `src/components/`
- Page components in `src/app/`
- Route groups for auth: `src/app/(auth)/login/page.tsx`

### Styling Pattern
```tsx
// Use clsx for conditional Tailwind classes
import clsx from 'clsx'

function Button({ variant = 'solid', color = 'slate', className, ...props }) {
  return (
    <button
      className={clsx(
        baseStyles[variant],
        variantStyles[variant][color],
        className
      )}
      {...props}
    />
  )
}
```

### Import Pattern
```tsx
// Always use @/ absolute imports
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import logoImage from '@/images/logo.png'
```

### Data Fetching (When Supabase Added)
```tsx
// Server Components — direct Supabase query
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data } = await supabase.from('leads').select('*')
  return <LeadList leads={data} />
}

// Client Components — TanStack Query
'use client'
import { useQuery } from '@tanstack/react-query'
```

## Lead Flow Pattern (Core Business Logic)
```
Inbound Lead (web form OR Vapi.ai call)
    ↓
Make.com webhook receives data
    ↓
GPT-4o Dependency Check:
  - Contains "ceiling/wall"? → Flag AKF opportunity
  - Contains "heat pump/dust"? → Flag CleanJet opportunity
  - Contains "sparking/fire/outage"? → EMERGENCY → SMS on-call electrician
    ↓
If synergy found:
  → Auto-reply email with bundle offer
  → Create Supabase lead record with cross-tags
If no synergy:
  → Standard lead processing
  → Create Supabase lead record (single tag)
    ↓
On job "Won":
  → Supabase webhook → Simpro/Fergus
```

## Supabase Database Schema (Planned)
```sql
-- Core tables
leads (id, created_at, brand, customer_id, source, status, tags[], ai_cross_sell_flags)
customers (id, created_at, name, email, phone, address, golden_record)
jobs (id, lead_id, customer_id, brand, status, value, external_job_id)
cross_sell_events (id, lead_id, from_brand, to_brand, offer_sent, converted)
```

## Routing Conventions
- App Router (Next.js 15)
- File-based routing in `src/app/`
- Route groups `(auth)` for layout isolation
- No `pages/` directory

## File Organization (Per Site)
```
src/
├── app/              # Pages and layouts (App Router)
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Homepage
│   └── (auth)/       # Auth routes
├── components/       # Reusable UI components
├── images/           # Static images (imported via next/image)
├── lib/              # Utilities, Supabase client, API helpers
│   ├── supabase/
│   │   ├── client.ts   # Browser client
│   │   └── server.ts   # Server client
│   └── openai.ts       # GPT-4o client
└── styles/
    └── tailwind.css  # Tailwind v4 theme + imports
```

## Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Button.tsx`, `Hero.tsx` |
| Pages | lowercase | `page.tsx`, `layout.tsx` |
| Utilities | camelCase | `formatPrice.ts`, `createClient.ts` |
| API routes | kebab-case | `route.ts` in `app/api/leads/` |
| CSS classes | Tailwind utility | `className="flex items-center gap-4"` |
| Database tables | snake_case | `leads`, `cross_sell_events` |

## Error Handling
- Next.js `error.tsx` files for route-level error boundaries
- Supabase errors: always check `{ data, error }` destructure
- AI API errors: wrap in try/catch, log to console, return fallback
- Voice AI errors: Vapi.ai handles retries; log failed calls to Supabase

## Testing Patterns (To Be Configured)
- Unit tests: Vitest, co-located or in `__tests__/`
- E2E tests: Playwright, in `e2e/` directory
- Test naming: `ComponentName.test.tsx`, `feature-name.spec.ts`
