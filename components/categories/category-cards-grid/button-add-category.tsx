import { Plus } from '@/lib/icons'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  onPress: () => void
  className?: string
}

export function ButtonAddCategory({ onPress, className }: Props) {
  return (
    <Pressable
      className={cn(
        'flex flex-row items-center justify-center gap-2',
        className
      )}
      onPress={onPress}
    >
      <Plus className="text-muted-foreground" />
      <Text className="text-sm font-medium text-foreground">Add Category</Text>
    </Pressable>
  )
}
