'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Fieldset,
  Legend,
  Field,
  Label,
  FieldGroup,
} from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { Select } from '@/components/catalyst/select'
import { Button } from '@/components/catalyst/button'
import { createClient } from '@/lib/supabase-browser'
import type { RecordType, RecordStatus } from '@/hooks/useRecords'

interface Site {
  id: string
  name: string
}

interface Worker {
  id: string
  full_name: string
  site_id: string
}

interface Contact {
  id: string
  full_name: string | null
  email: string | null
}

interface RecordFormProps {
  sites: Site[]
  workers: Worker[]
  contacts: Contact[]
}

const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'quote', label: 'Quote' },
  { value: 'job', label: 'Job' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'note', label: 'Note' },
  { value: 'booking', label: 'Booking' },
  { value: 'task', label: 'Task' },
]

const RECORD_STATUSES: { value: RecordStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const CURRENCIES = ['NZD', 'AUD', 'USD', 'EUR', 'GBP']

export default function RecordForm({
  sites,
  workers,
  contacts,
}: RecordFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [siteId, setSiteId] = useState('')
  const [recordType, setRecordType] = useState<RecordType>('note')
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<RecordStatus>('open')
  const [workerId, setWorkerId] = useState('')
  const [contactId, setContactId] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('NZD')
  const [dueAt, setDueAt] = useState('')
  const [contactSearch, setContactSearch] = useState('')

  const filteredContacts = contactSearch
    ? contacts.filter(
        (c) =>
          (c.full_name?.toLowerCase().includes(contactSearch.toLowerCase()) ??
            false) ||
          (c.email?.toLowerCase().includes(contactSearch.toLowerCase()) ?? false)
      )
    : contacts.slice(0, 20)

  const workersForSite = siteId
    ? workers.filter((w) => w.site_id === siteId)
    : workers

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (!siteId || !title) {
        setError('Site and title are required')
        return
      }

      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('records')
        .insert({
          site_id: siteId,
          record_type: recordType,
          title,
          status,
          worker_id: workerId || null,
          contact_id: contactId || null,
          amount: amount ? parseFloat(amount) : null,
          currency: amount ? currency : null,
          due_at: dueAt || null,
          payload: {},
        })
        .select('id')
        .single()

      if (insertError) {
        setError(insertError.message)
        return
      }

      if (data?.id) {
        router.push(`/records/${data.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Site *</Label>
            <Select
              required
              value={siteId}
              onChange={(e) => {
                setSiteId(e.target.value)
                setWorkerId('')
              }}
            >
              <option value="">Select site</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Record type *</Label>
            <Select
              required
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as RecordType)}
            >
              {RECORD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Title *</Label>
            <Input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quote for kitchen renovation"
            />
          </Field>

          <Field>
            <Label>Status</Label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as RecordStatus)}
            >
              {RECORD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Worker</Label>
            <Select
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
            >
              <option value="">None</option>
              {workersForSite.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.full_name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Contact</Label>
            <Input
              type="text"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Search by name or email"
            />
            <Select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="mt-2"
            >
              <option value="">None</option>
              {filteredContacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name ?? c.email ?? c.id}
                </option>
              ))}
            </Select>
          </Field>

          {(recordType === 'quote' || recordType === 'invoice') && (
            <>
              <Field>
                <Label>Amount</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-24"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>
            </>
          )}

          <Field>
            <Label>Due date</Label>
            <Input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </Field>
        </FieldGroup>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400"
          >
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Button type="submit" color="dark/zinc" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Record'}
          </Button>
          <Button
            type="button"
            plain
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </Fieldset>
    </form>
  )
}
