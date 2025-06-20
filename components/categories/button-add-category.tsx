import { Plus } from '@/lib/icons'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

interface Props {
  onPress: () => void
  className?: string
}

export function ButtonAddCategory({ onPress, className }: Props) {
  return (
    <Pressable
      className={cn('flex-row items-center', className)}
      onPress={onPress}
    >
      <View className="flex-1 flex-row items-center justify-center gap-2">
        <Plus size={20} color="#4A5568" />
        <Text className="text-sm font-medium text-foreground">
          Add Category
        </Text>
      </View>
    </Pressable>
  )
}
