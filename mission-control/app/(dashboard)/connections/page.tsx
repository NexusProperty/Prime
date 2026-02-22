'use client'

import { useConnections } from '@/hooks/useConnections'
import { useSite } from '@/lib/site-context'
import { ConnectionCard } from '@/components/connections/ConnectionCard'
import { Button } from '@/components/catalyst/button'

export default function ConnectionsPage() {
  const { data: connections, loading, error, updateConnection, deleteConnection } = useConnections()
  const { sites } = useSite()

  const siteMap = new Map(sites.map((s) => [s.id, s.name]))

  async function handleToggle(id: string, enabled: boolean) {
    try {
      await updateConnection(id, { is_enabled: enabled })
    } catch (err) {
      console.error('Failed to toggle connection:', err)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this connection? This cannot be undone.')) return
    try {
      await deleteConnection(id)
    } catch (err) {
      console.error('Failed to delete connection:', err)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Connections
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage third-party API integrations for your sites
          </p>
        </div>
        <Button href="/connections/new" color="dark/zinc" data-testid="add-connection">
          Add Connection
        </Button>
      </div>

      {loading && (
        <div className="rounded-xl border border-zinc-950/10 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading connections…</p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {!loading && !error && connections && connections.length === 0 && (
        <div className="rounded-xl border border-zinc-950/10 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No connections yet. Add your first integration to get started.
          </p>
          <Button href="/connections/new" color="dark/zinc" className="mt-4">
            Add Connection
          </Button>
        </div>
      )}

      {!loading && !error && connections && connections.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-1">
          {connections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              siteName={siteMap.get(conn.site_id)}
              onToggleEnabled={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
