import { useTheme } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

export function UserSessionLoading({ message }: { message: string }) {
  const { colors } = useTheme()

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
      </View>
    </View>
  )
}
