// ---------------------------------------------------------------------------
// PHASE2-001: Supabase Client Helpers
//
// Two clients:
//   supabase     — browser-safe anon client, RLS enforced (use in components)
//   createServiceClient() — server-side admin client, bypasses RLS
//                           ONLY use inside API routes (src/app/api/)
//                           NEVER import in client components
// ---------------------------------------------------------------------------
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/** Browser/client-side Supabase client. Safe to use in React components. */
export const supabase = createClient<Database>(url, anon)

/**
 * Server-side Supabase client using the service role key.
 * Bypasses Row Level Security — use only in Next.js API routes.
 */
export function createServiceClient() {
  return createClient<Database>(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
