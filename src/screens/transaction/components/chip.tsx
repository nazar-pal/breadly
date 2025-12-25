import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

interface ChipProps {
  children: React.ReactNode
}

export function Chip({ children }: ChipProps) {
  return (
    <View className="bg-muted/60 rounded-full px-2.5 py-1">
      <Text className="text-muted-foreground text-xs font-medium">
        {children}
      </Text>
    </View>
  )
}
