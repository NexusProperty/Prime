import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardShell from '@/components/layout/DashboardShell'
import type { Site } from '@/lib/site-context'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all sites (Mission Control sees all sites — RLS grants access to authenticated users)
  const { data: sitesData } = await supabase
    .from('sites')
    .select('id, name, url')
    .eq('is_active', true)
    .order('name')

  const sites: Site[] = sitesData ?? []

  return (
    <DashboardShell sites={sites} userEmail={user.email ?? ''}>
      {children}
    </DashboardShell>
  )
}
