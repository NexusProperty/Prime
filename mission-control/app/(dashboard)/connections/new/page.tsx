import { createClient } from '@/lib/supabase-server'
import ConnectionForm from '@/components/connections/ConnectionForm'

export default async function NewConnectionPage() {
  const supabase = await createClient()

  const { data: sites } = await supabase
    .from('sites')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
          Add Connection
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Connect a third-party app (Zapier, HubSpot, Xero, Slack, or custom)
        </p>
      </div>
      <ConnectionForm sites={sites ?? []} />
    </div>
  )
}
