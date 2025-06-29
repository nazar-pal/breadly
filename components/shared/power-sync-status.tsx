import { usePowerSyncState } from '@/lib/storage/powersync-store'
import { cn } from '@/lib/utils'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

type StatusColor = 'red' | 'blue' | 'green' | 'yellow' | 'gray'

interface PowerSyncStatusCardProps {
  color: StatusColor
  iconType?: 'dot' | 'spinner'
  iconColor?: string
  title: string
  titleColor: string
  message?: string
  messageColor?: string
  className?: string
  children?: React.ReactNode
}

function PowerSyncStatusCard({
  color,
  iconType = 'dot',
  iconColor,
  title,
  titleColor,
  message,
  messageColor,
  className,
  children
}: PowerSyncStatusCardProps) {
  const bgColor = {
    red: 'bg-red-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    gray: 'bg-gray-50'
  }[color]

  return (
    <View className={cn('my-2 rounded-lg px-3 py-2', bgColor, className)}>
      <View className="flex-row items-center">
        {iconType === 'dot' ? (
          <View
            className={cn(
              'h-2 w-2 rounded-full',
              {
                red: 'bg-red-500',
                blue: 'bg-blue-500',
                green: 'bg-green-500',
                yellow: 'bg-yellow-500',
                gray: 'bg-gray-400'
              }[color]
            )}
          />
        ) : (
          <ActivityIndicator size="small" color={iconColor} />
        )}
        <Text className={cn('ml-2 text-sm font-medium', titleColor)}>
          {title}
        </Text>
      </View>
      {message && (
        <Text className={cn('mt-1 text-xs', messageColor)}>{message}</Text>
      )}
      {children}
    </View>
  )
}

function getRelativeTime(date: Date | null) {
  if (!date) return null
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

export function PowerSyncStatus({ className }: { className?: string }) {
  const {
    isConnected,
    isConnecting,
    isSyncing,
    hasSynced,
    lastSyncedAt,
    error
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
        title="Connecting..."
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
    return (
      <PowerSyncStatusCard
        color="blue"
        iconType="spinner"
        iconColor="#3B82F6"
        title="Syncing..."
        titleColor="text-blue-700"
        className={className}
        message={`Connected • ${lastSyncText ? `Last synced ${lastSyncText}` : 'First sync'}`}
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
  )
}
