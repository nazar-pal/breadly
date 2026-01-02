import { useTheme } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { usePurchases } from '../purchases'
import type { SyncState } from '../state-machine/states'

function getLoadingMessage(
  state: SyncState,
  isPurchaseStatusVerified: boolean
): string {
  switch (state.status) {
    case 'uninitialized':
    case 'initializing':
      // Show verification message during init if not yet verified
      if (!isPurchaseStatusVerified) {
        return 'Verifying subscription...'
      }
      return 'Initializing your session...'
    case 'seeding_guest':
      return 'Setting up your account...'
    case 'migrating_guest_to_auth':
      return 'Migrating your data...'
    case 'switching_to_sync':
      return 'Enabling cloud sync...'
    case 'switching_to_local':
      return 'Switching to local mode...'
    case 'draining_upload_queue':
      return 'Syncing remaining changes...'
    case 'signing_out':
      return 'Signing out...'
    default:
      return 'Applying database changes...'
  }
}

export function LoadingStates({ state }: { state: SyncState }) {
  const { colors } = useTheme()
  const { isPurchaseStatusVerified } = usePurchases()
  const message = getLoadingMessage(state, isPurchaseStatusVerified)

  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <View className="items-center space-y-6">
        {/* Loading spinner */}
        <View className="bg-primary/10 rounded-full p-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>

        {/* Loading message */}
        <View className="items-center space-y-2">
          <Text className="text-foreground text-xl font-semibold">
            {message}
          </Text>
          <Text className="text-muted-foreground text-center text-sm">
            This will only take a moment
          </Text>
        </View>

        {/* Show upload queue progress if draining */}
        {state.status === 'draining_upload_queue' && (
          <Text className="text-muted-foreground mt-4 text-xs">
            Please wait while your changes sync...
          </Text>
        )}
      </View>
    </View>
  )
}
