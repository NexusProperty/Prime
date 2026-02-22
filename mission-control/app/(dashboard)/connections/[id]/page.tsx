'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useSite } from '@/lib/site-context'
import { Switch, SwitchField } from '@/components/catalyst/switch'
import { Badge } from '@/components/catalyst/badge'
import { Button } from '@/components/catalyst/button'
import { Fieldset, Field, Label } from '@/components/catalyst/fieldset'
import { Textarea } from '@/components/catalyst/textarea'
import { Input } from '@/components/catalyst/input'
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from '@/components/catalyst/dialog'
import type { Connection } from '@/hooks/useConnections'

export default function ConnectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { sites } = useSite()

  const [connection, setConnection] = useState<Connection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [configJson, setConfigJson] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [rotateOpen, setRotateOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState('')
  const [rotating, setRotating] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const siteName = connection ? sites.find((s) => s.id === connection.site_id)?.name : null

  useEffect(() => {
    let cancelled = false

    async function fetchConnection() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (cancelled) return

        if (!res.ok) {
          setError(await res.text() || `HTTP ${res.status}`)
          setConnection(null)
        } else {
          const json = (await res.json()) as { connection?: Connection }
          const conn = json.connection
          if (conn) {
            setConnection(conn)
            setConfigJson(
              Object.keys(conn.config || {}).length > 0
                ? JSON.stringify(conn.config, null, 2)
                : ''
            )
          } else {
            setError('Connection not found')
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchConnection()
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleToggleEnabled(enabled: boolean) {
    if (!connection) return
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_enabled: enabled }),
      })

      if (!res.ok) throw new Error(await res.text())

      setConnection((prev) => (prev ? { ...prev, is_enabled: enabled } : null))
    } catch (err) {
      console.error('Failed to update:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveConfig() {
    if (!connection) return
    setSaving(true)
    setError(null)
    try {
      let config: Record<string, unknown> = {}
      if (configJson.trim()) {
        try {
          config = JSON.parse(configJson)
        } catch {
          setError('Invalid JSON')
          return
        }
      }

      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      })

      if (!res.ok) throw new Error(await res.text())

      setConnection((prev) => (prev ? { ...prev, config } : null))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    if (!connection) return
    setTesting(true)
    setTestResult(null)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      })

      const text = await res.text()
      if (res.ok) {
        try {
          const json = JSON.parse(text) as { success?: boolean; message?: string }
          setTestResult(json.success ? 'Success' : json.message ?? text)
        } catch {
          setTestResult(text || 'Success')
        }
      } else {
        setTestResult(text || `HTTP ${res.status}`)
      }
    } catch (err) {
      setTestResult(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setTesting(false)
    }
  }

  async function handleRotateKey() {
    if (!connection || !newApiKey.trim()) return
    setRotating(true)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: newApiKey }),
      })

      if (!res.ok) throw new Error(await res.text())

      setRotateOpen(false)
      setNewApiKey('')
    } catch (err) {
      console.error('Failed to rotate key:', err)
    } finally {
      setRotating(false)
    }
  }

  async function handleDelete() {
    if (!connection) return
    setDeleting(true)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mc-connections/${id}`
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!res.ok) throw new Error(await res.text())

      router.push('/connections')
    } catch (err) {
      console.error('Failed to delete:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading connection…</p>
      </div>
    )
  }

  if (error && !connection) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          {error}
        </div>
        <Button plain onClick={() => router.push('/connections')}>
          Back to Connections
        </Button>
      </div>
    )
  }

  if (!connection) {
    return null
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* ConnectionHeader */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            {connection.app_name}
          </h1>
          {siteName && (
            <Badge color="zinc" className="mt-2">
              {siteName}
            </Badge>
          )}
        </div>
        <SwitchField>
          <span data-slot="label" className="text-sm font-medium text-zinc-950 dark:text-white">
            {connection.is_enabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch
            checked={connection.is_enabled}
            onChange={(checked) => handleToggleEnabled(checked)}
            disabled={saving}
          />
        </SwitchField>
      </div>

      {/* ConfigEditor */}
      <Fieldset>
        <Field>
          <Label>Configuration (JSON)</Label>
          <Textarea
            value={configJson}
            onChange={(e) => setConfigJson(e.target.value)}
            placeholder='{"webhook_url": "https://...", ...}'
            rows={8}
          />
          <Button
            type="button"
            outline
            className="mt-3"
            onClick={handleSaveConfig}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Config'}
          </Button>
        </Field>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </Fieldset>

      {/* CredentialSection */}
      <div className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
          Credentials
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          API key stored in Vault. Value is never displayed.
        </p>
        <Button
          type="button"
          outline
          className="mt-4"
          onClick={() => setRotateOpen(true)}
        >
          Rotate Key
        </Button>
      </div>

      {/* TestButton */}
      <div>
        <Button
          type="button"
          outline
          onClick={handleTest}
          disabled={testing}
        >
          {testing ? 'Testing…' : 'Test Connection'}
        </Button>
        {testResult && (
          <div
            className={`mt-3 rounded-lg px-4 py-2 text-sm ${
              testResult === 'Success'
                ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
            }`}
          >
            {testResult}
          </div>
        )}
      </div>

      {/* DangerZone */}
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 p-6">
        <h2 className="text-base font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Permanently delete this connection. This cannot be undone.
        </p>
        <Button
          type="button"
          color="red"
          className="mt-4"
          onClick={() => setDeleteConfirmOpen(true)}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete Connection'}
        </Button>
      </div>

      {/* Rotate Key Dialog */}
      <Dialog open={rotateOpen} onClose={() => setRotateOpen(false)}>
        <DialogTitle>Rotate API Key</DialogTitle>
        <DialogDescription>
          Enter a new API key. The old key will be replaced.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>New API Key</Label>
            <Input
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            type="button"
            color="dark/zinc"
            onClick={handleRotateKey}
            disabled={!newApiKey.trim() || rotating}
          >
            {rotating ? 'Rotating…' : 'Rotate'}
          </Button>
          <Button type="button" plain onClick={() => setRotateOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Connection</DialogTitle>
        <DialogDescription>
          Are you sure? This will permanently remove the {connection.app_name} connection.
        </DialogDescription>
        <DialogActions>
          <Button
            type="button"
            color="red"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
          <Button type="button" plain onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
