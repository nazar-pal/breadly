import { usePowerSyncState } from '@/lib/storage/powersync-store'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import React from 'react'
import { PowerSyncStatusCard } from './power-sync-status-card'

function getRelativeTime(date: Date | null) {
  if (!date) return null
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function PowerSyncStatusContent({ className }: { className?: string }) {
  const {
    isConnected,
    isConnecting,
    isSyncing,
    hasSynced,
    lastSyncedAt,
    error,
    downloadProgress
  } = usePowerSyncState()

  const lastSyncText = getRelativeTime(lastSyncedAt)

  if (error) {
    return (
      <PowerSyncStatusCard
        color="red"
        iconType="dot"
        title="Connection Error"
        titleColor="text-red-700"
        message={
          hasSynced && lastSyncText ? `Last synced ${lastSyncText}` : undefined
        }
        messageColor="text-red-600"
        className={className}
      />
    )
  }

  if (isConnecting) {
    return (
      <PowerSyncStatusCard
        color="blue"
        iconType="spinner"
        iconColor="#3B82F6"
        title={hasSynced ? 'Reconnecting…' : 'Connecting…'}
        titleColor="text-blue-700"
        message={
          hasSynced && lastSyncText
            ? `Last synced ${lastSyncText}`
            : !hasSynced
              ? 'No previous sync'
              : undefined
        }
        messageColor="text-blue-600"
        className={className}
      />
    )
  }

  if (isSyncing) {
    const percent =
      downloadProgress && downloadProgress.totalOperations > 0
        ? Math.round(
            (downloadProgress.downloadedOperations /
              downloadProgress.totalOperations) *
              100
          )
        : undefined
    return (
      <PowerSyncStatusCard
        color="blue"
        iconType="spinner"
        iconColor="#3B82F6"
        title={percent != null ? `Syncing… ${percent}%` : 'Syncing…'}
        titleColor="text-blue-700"
        className={className}
        message={`Connected • ${
          lastSyncText ? `Last synced ${lastSyncText}` : 'First sync'
        }`}
        messageColor="text-blue-600"
      />
    )
  }

  if (isConnected && hasSynced) {
    return (
      <PowerSyncStatusCard
        color="green"
        iconType="dot"
        title="Online"
        titleColor="text-green-700"
        message={lastSyncText ? `Last synced ${lastSyncText}` : undefined}
        messageColor="text-green-600"
        className={className}
      />
    )
  }

  if (isConnected && !hasSynced) {
    return (
      <PowerSyncStatusCard
        color="yellow"
        iconType="dot"
        title="Connected"
        titleColor="text-yellow-700"
        message="Waiting for first sync"
        messageColor="text-yellow-600"
        className={className}
      />
    )
  }

  // Offline
  return (
    <>
      <SignedOut>
        <PowerSyncStatusCard
          color="gray"
          iconType="dot"
          title="Not signed in"
          titleColor="text-gray-700"
          message="Sign in to enable cloud sync"
          messageColor="text-gray-600"
          className={className}
        />
      </SignedOut>
      <SignedIn>
        <PowerSyncStatusCard
          color="gray"
          iconType="dot"
          title="Offline"
          titleColor="text-gray-700"
          message={
            hasSynced && lastSyncText
              ? `Last synced ${lastSyncText}`
              : !hasSynced
                ? 'No previous sync'
                : undefined
          }
          messageColor="text-gray-600"
          className={className}
        />
      </SignedIn>
    </>
  )
}
