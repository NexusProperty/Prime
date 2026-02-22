'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Fieldset,
  Field,
  Label,
  FieldGroup,
} from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { Textarea } from '@/components/catalyst/textarea'
import { Select } from '@/components/catalyst/select'
import { Button } from '@/components/catalyst/button'
import { AppPicker, SUPPORTED_APPS } from './AppPicker'

interface Site {
  id: string
  name: string
}

interface ConnectionFormProps {
  sites: Site[]
  connectionId?: string
  initialSiteId?: string
  initialAppSlug?: string
  initialAppName?: string
  initialConfig?: Record<string, unknown>
}

export default function ConnectionForm({
  sites,
  connectionId,
  initialSiteId = '',
  initialAppSlug = '',
  initialAppName = '',
  initialConfig = {},
}: ConnectionFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [siteId, setSiteId] = useState(initialSiteId)
  const [appSlug, setAppSlug] = useState(initialAppSlug)
  const [appName, setAppName] = useState(initialAppName)
  const [apiKey, setApiKey] = useState('')
  const [webhookUrl, setWebhookUrl] = useState(
    (initialConfig.webhook_url as string) ?? ''
  )
  const [configJson, setConfigJson] = useState(
    Object.keys(initialConfig).length > 0
      ? JSON.stringify(initialConfig, null, 2)
      : ''
  )

  const isEdit = Boolean(connectionId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (!siteId || !appSlug || !appName) {
        setError('Site and app are required')
        return
      }

      let config: Record<string, unknown> = {}
      if (webhookUrl) config.webhook_url = webhookUrl
      if (configJson.trim()) {
        try {
          config = { ...config, ...JSON.parse(configJson) }
        } catch {
          setError('Invalid JSON in config')
          return
        }
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const { createClient } = await import('@/lib/supabase-browser')
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        setError('Not authenticated')
        return
      }

      const url = connectionId
        ? `${supabaseUrl}/functions/v1/mc-connections/${connectionId}`
        : `${supabaseUrl}/functions/v1/mc-connections`

      const body: Record<string, unknown> = {
        site_id: siteId,
        app_slug: appSlug,
        app_name: appName,
        config,
      }
      if (apiKey) body.api_key = apiKey

      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `HTTP ${res.status}`)
      }

      const json = (await res.json()) as { id?: string }
      if (json.id) {
        router.push(`/connections/${json.id}`)
      } else if (connectionId) {
        router.push(`/connections/${connectionId}`)
      } else {
        router.push('/connections')
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
              onChange={(e) => setSiteId(e.target.value)}
              disabled={isEdit}
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
            <Label>App *</Label>
            <AppPicker
              value={appSlug}
              onChange={(slug, name) => {
                setAppSlug(slug)
                setAppName(name)
              }}
              apps={SUPPORTED_APPS}
            />
          </Field>

          <Field>
            <Label>API Key</Label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isEdit ? '•••••••• (leave blank to keep existing)' : 'Stored securely in Vault'}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Stored securely in Vault. Leave blank when editing to keep existing key.
            </p>
          </Field>

          <Field>
            <Label>Webhook URL (optional)</Label>
            <Input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://..."
            />
          </Field>

          <Field>
            <Label>Additional config (optional JSON)</Label>
            <Textarea
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              placeholder='{"scope": "read", ...}'
              rows={4}
            />
          </Field>
        </FieldGroup>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Button type="submit" color="dark/zinc" disabled={submitting}>
            {submitting
              ? isEdit
                ? 'Saving…'
                : 'Creating…'
              : isEdit
                ? 'Save'
                : 'Create Connection'}
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
