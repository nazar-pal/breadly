import { usePowerSync } from '@/powersync/context'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

export function PowerSyncStatus() {
  const {
    isConnected,
    isConnecting,
    isSyncing,
    hasSynced,
    lastSyncedAt,
    error
  } = usePowerSync()

  // Simple relative time format
  const getRelativeTime = (date: Date | null) => {
    if (!date) return null
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  const lastSyncText = getRelativeTime(lastSyncedAt)

  // Error state - show error with last sync info
  if (error) {
    return (
      <View className="mx-4 mb-2 rounded-lg bg-red-50 px-3 py-2">
        <View className="flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-red-500" />
          <Text className="ml-2 text-sm font-medium text-red-700">
            Connection Error
          </Text>
        </View>
        {hasSynced && lastSyncText && (
          <Text className="mt-1 text-xs text-red-600">
            Last synced {lastSyncText}
          </Text>
        )}
      </View>
    )
  }

  // Connecting state - show connecting with last sync info
  if (isConnecting) {
    return (
      <View className="mx-4 mb-2 rounded-lg bg-blue-50 px-3 py-2">
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text className="ml-2 text-sm font-medium text-blue-700">
            Connecting...
          </Text>
        </View>
        {hasSynced && lastSyncText && (
          <Text className="mt-1 text-xs text-blue-600">
            Last synced {lastSyncText}
          </Text>
        )}
        {!hasSynced && (
          <Text className="mt-1 text-xs text-blue-600">No previous sync</Text>
        )}
      </View>
    )
  }

  // Syncing state - show syncing with connection status
  if (isSyncing) {
    return (
      <View className="mx-4 mb-2 rounded-lg bg-blue-50 px-3 py-2">
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text className="ml-2 text-sm font-medium text-blue-700">
            Syncing...
          </Text>
        </View>
        <Text className="mt-1 text-xs text-blue-600">
          Connected •{' '}
          {lastSyncText ? `Last synced ${lastSyncText}` : 'First sync'}
        </Text>
      </View>
    )
  }

  // Connected and synced state - show online with sync time
  if (isConnected && hasSynced) {
    return (
      <View className="mx-4 mb-2 rounded-lg bg-green-50 px-3 py-2">
        <View className="flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-green-500" />
          <Text className="ml-2 text-sm font-medium text-green-700">
            Online
          </Text>
        </View>
        {lastSyncText && (
          <Text className="mt-1 text-xs text-green-600">
            Last synced {lastSyncText}
          </Text>
        )}
      </View>
    )
  }

  // Connected but waiting for first sync
  if (isConnected && !hasSynced) {
    return (
      <View className="mx-4 mb-2 rounded-lg bg-yellow-50 px-3 py-2">
        <View className="flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-yellow-500" />
          <Text className="ml-2 text-sm font-medium text-yellow-700">
            Connected
          </Text>
        </View>
        <Text className="mt-1 text-xs text-yellow-600">
          Waiting for first sync
        </Text>
      </View>
    )
  }

  // Offline state - show offline with last sync info
  return (
    <View className="mx-4 mb-2 rounded-lg bg-gray-50 px-3 py-2">
      <View className="flex-row items-center">
        <View className="h-2 w-2 rounded-full bg-gray-400" />
        <Text className="ml-2 text-sm font-medium text-gray-700">Offline</Text>
      </View>
      {hasSynced && lastSyncText && (
        <Text className="mt-1 text-xs text-gray-600">
          Last synced {lastSyncText}
        </Text>
      )}
      {!hasSynced && (
        <Text className="mt-1 text-xs text-gray-600">No previous sync</Text>
      )}
    </View>
  )
}
