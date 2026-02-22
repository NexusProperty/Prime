import { createClient } from '@/lib/supabase-server'
import AgentsPageContent from '@/components/agents/AgentsPageContent'

export default async function AgentsPage() {
  const supabase = await createClient()

  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, type, is_active, description')
    .order('name')

  return (
    <AgentsPageContent agents={agents ?? []} />
  )
}
