import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

export function ErrorBoundary({
  error,
  onRetry
}: {
  error: Error
  onRetry: () => void
}) {
  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <View className="items-center space-y-6">
        {/* Error icon */}
        <View className="bg-destructive/10 rounded-full p-8">
          <Icon name="AlertCircle" size={48} className="text-destructive" />
        </View>

        {/* Error message */}
        <View className="items-center space-y-2">
          <Text className="text-foreground text-xl font-semibold">
            Something went wrong
          </Text>
          <Text className="text-muted-foreground text-center text-sm">
            {error.message || 'An unexpected error occurred'}
          </Text>
        </View>

        {/* Retry button */}
        <Button onPress={onRetry} className="mt-4">
          <View className="flex-row items-center gap-2">
            <Icon name="RefreshCw" size={16} />
            <Text>Try Again</Text>
          </View>
        </Button>
      </View>
    </View>
  )
}
