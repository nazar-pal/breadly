import { useTheme } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useUserSessionInitializingState } from '../../lib/storage/user-session-store'

export function UserSessionLoading() {
  const { colors } = useTheme()

  const { isMigrating, isInitializing } = useUserSessionInitializingState()

  let message = 'Loading user session...'

  if (isMigrating) {
    message = 'Transferring your data to your account...'
  } else if (isInitializing) {
    message = 'Initializing your session...'
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="items-center space-y-6">
        {/* Loading spinner */}
        <View className="rounded-full bg-primary/10 p-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>

        {/* Loading message */}
        <View className="items-center space-y-2">
          <Text className="text-xl font-semibold text-foreground">
            {message}
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            This will only take a moment
          </Text>
        </View>
      </View>
    </View>
  )
}
