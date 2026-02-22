import { createClient } from '@/lib/supabase-server'
import RecordForm from '@/components/records/RecordForm'

export default async function NewRecordPage() {
  const supabase = await createClient()

  const [sitesRes, workersRes, contactsRes] = await Promise.all([
    supabase.from('sites').select('id, name').eq('is_active', true).order('name'),
    supabase.from('workers').select('id, full_name, site_id').eq('is_active', true).order('full_name'),
    supabase.from('contacts').select('id, full_name, email').order('full_name'),
  ])

  const sites = sitesRes.data ?? []
  const workers = workersRes.data ?? []
  const contacts = contactsRes.data ?? []

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
          Create Record
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manually add a quote, job, invoice, note, booking, or task
        </p>
      </div>
      <RecordForm sites={sites} workers={workers} contacts={contacts} />
    </div>
  )
}
