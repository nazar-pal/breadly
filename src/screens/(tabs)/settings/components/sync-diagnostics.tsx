import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import type { SyncStatus } from '@powersync/react-native'
import { useStatus } from '@powersync/react-native'
import { format, formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type SyncState =
  | 'error'
  | 'connecting'
  | 'syncing'
  | 'online'
  | 'waiting'
  | 'offline'
  | 'signed-out'

interface StateConfig {
  icon: 'dot' | 'spinner'
  color: string
  bgColor: string
  title: string
  message: string
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getRelativeTime(date: Date | null | undefined) {
  if (!date) return null
  return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
}

function getAbsoluteTime(date: Date | null | undefined) {
  if (!date) return null
  return format(date, 'HH:mm:ss')
}

function getLastSyncMessage(lastSyncedAt: Date | null | undefined) {
  const rel = getRelativeTime(lastSyncedAt)
  const abs = getAbsoluteTime(lastSyncedAt)
  return rel ? `${rel} (${abs})` : 'Never synced'
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function SyncDiagnostics() {
  const status = useStatus()
  const [showDetails, setShowDetails] = useState(false)

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
  const hasError = dataFlowStatus?.downloadError || dataFlowStatus?.uploadError
  const syncPercent = downloadProgress
    ? Math.round((downloadProgress.downloadedFraction || 0) * 100)
    : null

  // Determine current state
  const getState = (): SyncState => {
    if (hasError) return 'error'
    if (connecting) return 'connecting'
    if (downloading) return 'syncing'
    if (connected && isSynced) return 'online'
    if (connected && !isSynced) return 'waiting'
    return 'offline'
  }

  const state = getState()
  const lastSyncMsg = getLastSyncMessage(lastSyncedAt)

  // State-based configuration
  const configs: Record<SyncState, StateConfig> = {
    error: {
      icon: 'dot',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      title: dataFlowStatus?.downloadError ? 'Sync Error' : 'Upload Error',
      message: hasError?.message || 'An error occurred'
    },
    connecting: {
      icon: 'spinner',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      title: isSynced ? 'Reconnecting…' : 'Connecting…',
      message: isSynced
        ? `Last sync: ${lastSyncMsg}`
        : 'Establishing connection'
    },
    syncing: {
      icon: 'spinner',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      title: syncPercent != null ? `Syncing ${syncPercent}%` : 'Syncing…',
      message: `Last sync: ${lastSyncMsg}`
    },
    online: {
      icon: 'dot',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/20',
      title: 'Online',
      message: `Last sync: ${lastSyncMsg}`
    },
    waiting: {
      icon: 'dot',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      title: 'Connected',
      message: 'Waiting for first sync'
    },
    offline: {
      icon: 'dot',
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-muted border-border/30',
      title: 'Offline',
      message: isSynced ? `Last sync: ${lastSyncMsg}` : 'No previous sync'
    },
    'signed-out': {
      icon: 'dot',
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-muted border-border/30',
      title: 'Not signed in',
      message: 'Sign in to enable sync'
    }
  }

  const config = configs[state]

  return (
    <>
      <SignedOut>
        <StatusCard config={configs['signed-out']}>
          <DebugPanel
            status={status}
            showDetails={showDetails}
            onToggle={() => setShowDetails(!showDetails)}
          />
        </StatusCard>
      </SignedOut>

      <SignedIn>
        <StatusCard config={config}>
          <DebugPanel
            status={status}
            showDetails={showDetails}
            onToggle={() => setShowDetails(!showDetails)}
          />
        </StatusCard>
      </SignedIn>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CARD
// ─────────────────────────────────────────────────────────────────────────────

function StatusCard({
  config,
  children
}: {
  config: StateConfig
  children?: React.ReactNode
}) {
  return (
    <View className={cn('rounded-xl border p-3', config.bgColor)}>
      <View className="flex-row items-center gap-2">
        {config.icon === 'spinner' ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          <View
            className={cn('h-2.5 w-2.5 rounded-full', {
              'bg-red-500': config.color.includes('red'),
              'bg-green-500': config.color.includes('green'),
              'bg-amber-500': config.color.includes('amber'),
              'bg-blue-500': config.color.includes('blue'),
              'bg-gray-400': config.color.includes('gray')
            })}
          />
        )}
        <Text className={cn('font-semibold', config.color)}>
          {config.title}
        </Text>
      </View>
      <Text className="text-muted-foreground mt-1 text-xs">
        {config.message}
      </Text>
      {children}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG PANEL
// ─────────────────────────────────────────────────────────────────────────────

function DebugPanel({
  status,
  showDetails,
  onToggle
}: {
  status: SyncStatus
  showDetails: boolean
  onToggle: () => void
}) {
  const df = status.dataFlowStatus || {}
  const pr = status.downloadProgress
  const entries = status.priorityStatusEntries || []

  const quickStats = [
    { label: 'Connected', value: status.connected, good: true },
    { label: 'Synced', value: status.hasSynced, good: true },
    { label: 'Downloading', value: df.downloading, good: null },
    { label: 'Uploading', value: df.uploading, good: null }
  ]

  return (
    <View className="border-border/30 mt-3 border-t pt-3">
      {/* Quick Stats Grid */}
      <View className="flex-row flex-wrap gap-2">
        {quickStats.map(({ label, value, good }) => (
          <View
            key={label}
            className="bg-background/50 flex-row items-center gap-1.5 rounded-md px-2 py-1"
          >
            <View
              className={cn('h-1.5 w-1.5 rounded-full', {
                'bg-green-500': value === true && good,
                'bg-red-500': value === false && good,
                'bg-blue-500': value === true && good === null,
                'bg-gray-400': value === false && good === null,
                'bg-amber-500': value === undefined
              })}
            />
            <Text className="text-muted-foreground text-[10px]">{label}</Text>
          </View>
        ))}
      </View>

      {/* Errors */}
      {(df.downloadError || df.uploadError) && (
        <View className="mt-2 rounded-md bg-red-500/10 p-2">
          <Text className="text-[10px] font-medium text-red-600 dark:text-red-400">
            {df.downloadError?.message || df.uploadError?.message}
          </Text>
        </View>
      )}

      {/* Download Progress */}
      {pr && (
        <View className="mt-2">
          <View className="bg-background/50 h-1.5 overflow-hidden rounded-full">
            <View
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${(pr.downloadedFraction || 0) * 100}%` }}
            />
          </View>
          <Text className="text-muted-foreground mt-1 text-[10px]">
            {pr.downloadedOperations}/{pr.totalOperations} operations
          </Text>
        </View>
      )}

      {/* Toggle Details */}
      <Pressable
        onPress={onToggle}
        className="mt-2 flex-row items-center gap-1 active:opacity-70"
      >
        <Icon
          name={showDetails ? 'ChevronUp' : 'ChevronDown'}
          size={12}
          className="text-muted-foreground"
        />
        <Text className="text-muted-foreground text-[10px] font-medium">
          {showDetails ? 'Hide raw data' : 'Show raw data'}
        </Text>
      </Pressable>

      {/* Raw Details */}
      {showDetails && (
        <View className="bg-background/50 mt-2 rounded-md p-2">
          {/* Priority Entries */}
          {entries.length > 0 && (
            <View className="mb-2">
              <Text className="text-foreground mb-1 text-[10px] font-medium">
                Priority Queues:
              </Text>
              {entries.map((entry: any) => {
                const lastSync = getLastSyncMessage(entry.lastSyncedAt)
                return (
                  <Text
                    key={entry.priority}
                    className="text-muted-foreground font-mono text-[9px]"
                  >
                    P{entry.priority}: synced={String(entry.hasSynced)}, last=
                    {lastSync}
                  </Text>
                )
              })}
            </View>
          )}

          {/* Raw JSON */}
          <Text className="text-foreground text-[10px] font-medium">
            Raw Status:
          </Text>
          <Text
            className="text-muted-foreground mt-1 font-mono text-[9px]"
            selectable
          >
            {serializeStatus(status)}
          </Text>
        </View>
      )}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

function serializeStatus(status: SyncStatus): string {
  try {
    return JSON.stringify(
      status,
      (_, value) => {
        if (typeof value === 'function') return undefined
        if (value instanceof Error)
          return { name: value.name, message: value.message }
        if (value instanceof Date) return value.toISOString()
        return value
      },
      2
    )
  } catch {
    return 'Unable to serialize'
  }
}
