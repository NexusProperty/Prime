import { createClient } from '@/lib/supabase-server'
import OutboundQueueContent from '@/components/settings/OutboundQueueContent'
import type { OutboundQueueItem } from '@/components/settings/OutboundQueueContent'

export default async function OutboundQueuePage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('outbound_queue')
    .select(
      'id, site_id, delivery_type, destination_url, destination_email, status, attempt_count, max_attempts, last_attempted_at, next_attempt_at, error, created_at, sites(name)'
    )
    .order('created_at', { ascending: false })
    .limit(100)

  const normalized = (items ?? []).map((row) => ({
    ...row,
    sites: Array.isArray(row.sites) ? row.sites[0] ?? null : row.sites,
  })) as OutboundQueueItem[]

  return <OutboundQueueContent initialItems={normalized} />
}
