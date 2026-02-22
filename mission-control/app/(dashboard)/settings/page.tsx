import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SettingsPageContent from '@/components/settings/SettingsPageContent'
import type { WorkerRow } from '@/components/settings/SettingsPageContent'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: workers } = await supabase
    .from('workers')
    .select('id, site_id, full_name, email, role, created_at, sites(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const normalizedWorkers: WorkerRow[] = (workers ?? []).map((w) => ({
    ...w,
    sites: Array.isArray(w.sites) ? (w.sites[0] ?? null) : w.sites,
  }))

  return (
    <SettingsPageContent
      userEmail={user.email ?? ''}
      userDisplayName={user.user_metadata?.full_name ?? user.email ?? ''}
      workers={normalizedWorkers}
    />
  )
}
