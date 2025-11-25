import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import type { SyncStatus } from '@powersync/react-native'
import { useStatus } from '@powersync/react-native'
import { format, formatDistanceToNow } from 'date-fns'
import React from 'react'
import { Text, View } from 'react-native'
import { PowerSyncStatusCard } from './power-sync-status-card'

function getRelativeTime(date: Date | null | undefined) {
  if (!date) return null
  return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
}

function getAbsoluteTime(date: Date | null | undefined) {
  if (!date) return null
  return format(date, 'HH:mm:ss')
}

export function PowerSyncStatusContent({ className }: { className?: string }) {
  const status = useStatus()

  const {
    connected,
    connecting,
    hasSynced,
    lastSyncedAt,
    dataFlowStatus,
    downloadProgress
  } = status

  const isSynced = hasSynced === true
  const downloading = Boolean(dataFlowStatus?.downloading)
  const uploading = Boolean(dataFlowStatus?.uploading)
  const downloadError = dataFlowStatus?.downloadError
  const uploadError = dataFlowStatus?.uploadError

  const lastSyncRelative = getRelativeTime(lastSyncedAt)
  const lastSyncAbsolute = getAbsoluteTime(lastSyncedAt)

  const lastSyncedMessage = lastSyncRelative
    ? `Last synced ${lastSyncRelative}${lastSyncAbsolute ? ` (${lastSyncAbsolute})` : ''}`
    : undefined

  const syncingPercent = downloadProgress
    ? Math.round((downloadProgress.downloadedFraction || 0) * 100)
    : undefined

  type CardConfig = {
    color: 'red' | 'blue' | 'green' | 'yellow' | 'gray'
    iconType?: 'dot' | 'spinner'
    iconColor?: string
    title: string
    titleColor: string
    message?: string
    messageColor?: string
  }

  function renderCard(config: CardConfig) {
    return (
      <PowerSyncStatusCard
        color={config.color}
        iconType={config.iconType}
        iconColor={config.iconColor}
        title={config.title}
        titleColor={config.titleColor}
        message={config.message}
        messageColor={config.messageColor}
        className={className}
      >
        <StatusDetails status={status} uploading={uploading} />
        <AdvancedDetails status={status} />
      </PowerSyncStatusCard>
    )
  }

  // Error state
  if (downloadError || uploadError) {
    return renderCard({
      color: 'red',
      iconType: 'dot',
      title: downloadError ? 'Connection Error' : 'Upload Error',
      titleColor: 'text-red-700',
      message: isSynced ? lastSyncedMessage : undefined,
      messageColor: 'text-red-600'
    })
  }

  // Connecting
  if (connecting) {
    return renderCard({
      color: 'blue',
      iconType: 'spinner',
      iconColor: '#3B82F6',
      title: isSynced ? 'Reconnecting…' : 'Connecting…',
      titleColor: 'text-blue-700',
      message: isSynced ? lastSyncedMessage : 'No previous sync',
      messageColor: 'text-blue-600'
    })
  }

  // Syncing in progress
  if (downloading) {
    return renderCard({
      color: 'blue',
      iconType: 'spinner',
      iconColor: '#3B82F6',
      title:
        syncingPercent != null ? `Syncing… ${syncingPercent}%` : 'Syncing…',
      titleColor: 'text-blue-700',
      message: `Connected • ${lastSyncedMessage ?? 'First sync'}`,
      messageColor: 'text-blue-600'
    })
  }

  // Online and synced
  if (connected && isSynced) {
    return renderCard({
      color: 'green',
      iconType: 'dot',
      title: 'Online',
      titleColor: 'text-green-700',
      message: lastSyncedMessage,
      messageColor: 'text-green-600'
    })
  }

  // Connected but not synced yet
  if (connected && !isSynced) {
    return renderCard({
      color: 'yellow',
      iconType: 'dot',
      title: 'Connected',
      titleColor: 'text-yellow-700',
      message: 'Waiting for first sync',
      messageColor: 'text-yellow-600'
    })
  }

  // Offline
  return (
    <>
      <SignedOut>
        {renderCard({
          color: 'gray',
          iconType: 'dot',
          title: 'Not signed in',
          titleColor: 'text-gray-700',
          message: 'Sign in to enable cloud sync',
          messageColor: 'text-gray-600'
        })}
      </SignedOut>
      <SignedIn>
        {renderCard({
          color: 'gray',
          iconType: 'dot',
          title: 'Offline',
          titleColor: 'text-gray-700',
          message: isSynced ? lastSyncedMessage : 'No previous sync',
          messageColor: 'text-gray-600'
        })}
      </SignedIn>
    </>
  )
}

function StatusDetails({
  status,
  uploading
}: {
  status: SyncStatus
  uploading: boolean
}) {
  const df = status.dataFlowStatus || {}
  const pr = status.downloadProgress
  const entries = status.priorityStatusEntries || []

  const rows: [string, string][] = [
    ['Connected', String(Boolean(status.connected))],
    ['Connecting', String(Boolean(status.connecting))],
    [
      'Has synced',
      status.hasSynced === undefined
        ? 'unknown'
        : String(Boolean(status.hasSynced))
    ],
    ['Downloading', String(Boolean(df.downloading))],
    ['Uploading', String(Boolean(uploading))],
    ['Download error', df.downloadError ? df.downloadError.message : 'none'],
    ['Upload error', df.uploadError ? df.uploadError.message : 'none']
  ]

  if (pr) {
    const percent = Math.round((pr.downloadedFraction || 0) * 100)
    rows.push([
      'Download progress',
      `${percent}% (${pr.downloadedOperations}/${pr.totalOperations})`
    ])
  }

  return (
    <View className="mt-2">
      {rows.map(([label, value]) => (
        <Text key={label} className="text-xs text-foreground">
          {label}: {value}
        </Text>
      ))}
      {entries.length > 0 && (
        <View className="mt-1">
          <Text className="text-xs font-medium text-foreground">
            Priorities:
          </Text>
          {entries.map((entry: any) => {
            const rel = getRelativeTime(entry.lastSyncedAt)
            const abs = getAbsoluteTime(entry.lastSyncedAt)
            const entryLast = rel ? `${rel} (${abs})` : 'never'
            return (
              <Text key={entry.priority} className="text-xs text-foreground">
                {`priority ${entry.priority}: hasSynced=${String(entry.hasSynced)}; lastSyncedAt=${entryLast}`}
              </Text>
            )
          })}
        </View>
      )}
    </View>
  )
}

function AdvancedDetails({ status }: { status: SyncStatus }) {
  const [open, setOpen] = React.useState(false)

  // Safely stringify status, omitting functions and expanding errors
  function serializeStatus(): string {
    try {
      return JSON.stringify(
        status,
        (key, value) => {
          if (typeof value === 'function') return undefined
          if (value instanceof Error) {
            return {
              name: value.name,
              message: value.message,
              stack: value.stack
            }
          }
          if (value instanceof Date) return value.toISOString()
          return value
        },
        2
      )
    } catch {
      return 'Unserializable status'
    }
  }

  return (
    <View className="mt-2">
      <Text
        className="text-[11px] font-medium text-foreground"
        onPress={() => setOpen(!open)}
      >
        {open ? 'Hide details' : 'Show details'}
      </Text>
      {open && (
        <View className="mt-1 rounded-md bg-background/50 p-2">
          {typeof (status as any).getMessage === 'function' && (
            <Text className="mb-1 text-[10px] text-foreground">
              {(status as any).getMessage()}
            </Text>
          )}
          <Text className="text-[10px] text-muted-foreground">
            {serializeStatus()}
          </Text>
        </View>
      )}
    </View>
  )
}
