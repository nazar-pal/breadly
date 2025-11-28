import { cn } from '@/lib/utils'
import React from 'react'
import { ActivityIndicator, Text, View, useColorScheme } from 'react-native'

export function LoadingFooter() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View className="flex-row items-center justify-center gap-1.5 py-4">
      <ActivityIndicator
        size="small"
        color={isDark ? 'rgba(255,255,255,0.5)' : undefined}
      />
      <Text
        className={cn(
          'text-[10px]',
          isDark ? 'text-white/40' : 'text-muted-foreground/70'
        )}
      >
        Loading more...
      </Text>
    </View>
  )
}
