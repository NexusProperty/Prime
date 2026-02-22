'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/catalyst/table'
import { Heading, Subheading } from '@/components/catalyst/heading'
import { Button } from '@/components/catalyst/button'
import { Badge } from '@/components/catalyst/badge'
import { Input } from '@/components/catalyst/input'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Dialog, DialogTitle } from '@/components/catalyst/dialog'
import Link from 'next/link'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export interface WorkerRow {
  id: string
  site_id: string
  full_name: string
  email: string
  role: string
  created_at: string
  sites: { name: string } | null
}

interface SettingsPageContentProps {
  userEmail: string
  userDisplayName: string
  workers: WorkerRow[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function SettingsPageContent({
  userEmail,
  userDisplayName,
  workers,
}: SettingsPageContentProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
      return
    }

    setPasswordSuccess(true)
    setNewPassword('')
    setTimeout(() => {
      setChangePasswordOpen(false)
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Heading level={1}>Settings</Heading>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your profile and site membership
        </p>
      </div>

      {/* Profile section */}
      <div className="space-y-4">
        <Subheading level={2}>Profile</Subheading>
        <div className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Display name
              </dt>
              <dd className="mt-1 text-sm text-zinc-950 dark:text-white">
                {userDisplayName || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Email
              </dt>
              <dd className="mt-1 text-sm text-zinc-950 dark:text-white">
                {userEmail}
              </dd>
            </div>
          </dl>
          <div className="mt-6">
            <Button
              outline
              onClick={() => setChangePasswordOpen(true)}
              data-testid="change-password-button"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Site membership */}
      <div className="space-y-4">
        <Subheading level={2}>Site Membership</Subheading>
        {workers.length === 0 ? (
          <div className="rounded-xl border border-zinc-950/10 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              You are not assigned to any sites yet
            </p>
          </div>
        ) : (
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>Site</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Joined</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.map((w) => (
                <TableRow key={w.id} data-testid={`worker-row-${w.id}`}>
                  <TableCell>
                    <span className="font-medium text-zinc-950 dark:text-white">
                      {w.sites?.name ?? 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge color="zinc">{w.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(w.created_at)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Outbound Queue link */}
      <div className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
        <Link
          href="/settings/outbound"
          className="flex items-center gap-2 text-sm font-medium text-zinc-950 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300"
          data-testid="outbound-queue-link"
        >
          Outbound Queue
          <ArrowRightOnRectangleIcon className="size-4" aria-hidden="true" />
        </Link>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Monitor and manage the outbound delivery queue
        </p>
      </div>

      {/* Change password dialog */}
      <Dialog open={changePasswordOpen} onClose={setChangePasswordOpen}>
        <DialogTitle>
            Change Password
          </DialogTitle>
          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <Field>
              <Label>New password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                data-testid="new-password-input"
              />
            </Field>
            {passwordError && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400" role="status">
                Password updated successfully
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit" color="dark/zinc" data-testid="submit-password">
                Update Password
              </Button>
              <Button
                type="button"
                outline
                onClick={() => setChangePasswordOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
      </Dialog>
    </div>
  )
}
