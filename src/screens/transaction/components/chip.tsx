import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

interface ChipProps {
  children: React.ReactNode
}

export function Chip({ children }: ChipProps) {
  return (
    <View className="rounded-full bg-muted/60 px-2.5 py-1">
      <Text className="text-xs font-medium text-muted-foreground">
        {children}
      </Text>
    </View>
  )
}

