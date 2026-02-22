import { createClient } from '@/lib/supabase-server'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ data: sites }, { data: agents }] = await Promise.all([
    supabase
      .from('sites')
      .select('id, name, url, is_active')
      .eq('is_active', true)
      .order('name'),
    supabase.from('agents').select('id, name, type, is_active').order('name'),
  ])

  return (
    <DashboardContent
      sites={sites ?? []}
      agents={agents ?? []}
      rangeLabel="7 days"
    />
  )
}
