'use client'

import { Switch, SwitchField } from '@/components/catalyst/switch'
import { Badge } from '@/components/catalyst/badge'
import { Button } from '@/components/catalyst/button'
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from '@/components/catalyst/dropdown'
import type { Connection } from '@/hooks/useConnections'

interface ConnectionCardProps {
  connection: Connection
  siteName?: string
  onToggleEnabled: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
}

function formatLastSync(lastSyncAt: string | null, lastSyncStatus: string | null): string {
  if (!lastSyncAt) return 'Never synced'
  const date = new Date(lastSyncAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function ConnectionCard({
  connection,
  siteName,
  onToggleEnabled,
  onDelete,
}: ConnectionCardProps) {
  const lastSyncLabel = formatLastSync(connection.last_sync_at, connection.last_sync_status)
  const syncStatusColor =
    connection.last_sync_status === 'success'
      ? 'green'
      : connection.last_sync_status === 'error'
        ? 'red'
        : 'zinc'

  return (
    <div
      data-testid={`connection-card-${connection.id}`}
      className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              {connection.app_name}
            </h3>
            {siteName && (
              <Badge color="zinc" data-testid={`connection-site-badge-${connection.id}`}>
                {siteName}
              </Badge>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{lastSyncLabel}</span>
            {connection.last_sync_status && (
              <Badge
                color={syncStatusColor}
                data-testid={`connection-sync-status-${connection.id}`}
              >
                {connection.last_sync_status}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <SwitchField>
            <span data-slot="label" className="text-sm font-medium text-zinc-950 dark:text-white">
              {connection.is_enabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch
              checked={connection.is_enabled}
              onChange={(checked) => onToggleEnabled(connection.id, checked)}
              data-testid={`connection-toggle-${connection.id}`}
            />
          </SwitchField>
          <Dropdown>
            <DropdownButton
              as={Button}
              outline
              className="min-w-0"
              data-testid={`connection-actions-${connection.id}`}
            >
              Actions
            </DropdownButton>
            <DropdownMenu anchor="bottom end">
              <DropdownItem href={`/connections/${connection.id}`}>Edit</DropdownItem>
              <DropdownItem href={`/connections/${connection.id}?test=1`}>Test</DropdownItem>
              <DropdownItem
                onClick={() => onDelete(connection.id)}
                className="text-red-600 dark:text-red-400"
                data-testid={`connection-delete-${connection.id}`}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
