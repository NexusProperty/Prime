import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import SiteHealthTable from '@/components/dashboard/SiteHealthTable'
import StatCard from '@/components/dashboard/StatCard'

export default async function SitePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: site } = await supabase
    .from('sites')
    .select('id, name, url, is_active')
    .eq('id', id)
    .single()

  if (!site) notFound()

  const { data: recentContacts } = await supabase
    .from('contacts')
    .select('id, full_name, email, lead_score, created_at')
    .eq('source_site', id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: recentEvents } = await supabase
    .from('events')
    .select('id, event_type, processed, created_at')
    .eq('site_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">{site.name}</h1>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm text-indigo-400 hover:text-indigo-300"
        >
          {site.url} ↗
        </a>
      </div>

      {/* Stats */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Recent Contacts"
          value={(recentContacts?.length ?? 0).toLocaleString()}
        />
        <StatCard
          label="Recent Events"
          value={(recentEvents?.length ?? 0).toLocaleString()}
        />
        <StatCard
          label="Unprocessed Events"
          value={(
            recentEvents?.filter((e) => !e.processed).length ?? 0
          ).toLocaleString()}
        />
      </dl>

      {/* Site health */}
      <SiteHealthTable sites={[site]} />

      {/* Recent contacts */}
      {recentContacts != null && recentContacts.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-sm font-semibold text-white">Recent Contacts</h2>
          </div>
          <div className="divide-y divide-white/10">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between px-6 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {contact.full_name || '(unnamed)'}
                  </p>
                  <p className="text-xs text-gray-400">{contact.email}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(contact.created_at).toLocaleDateString('en-NZ', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}