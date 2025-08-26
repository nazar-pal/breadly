import { cn } from '@/lib/utils/cn'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

interface ActionButtonProps {
  onPress: () => void
  icon: React.ReactNode
  title: string
  className?: string
}

export function ActionButton({
  onPress,
  icon,
  title,
  className
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center justify-center gap-3 rounded-xl border border-border bg-background/80 py-4 backdrop-blur-sm active:scale-[0.98]',
        className
      )}
    >
      <View className="h-6 w-6 items-center justify-center">{icon}</View>
      <Text className="text-base font-semibold text-foreground">{title}</Text>
    </Pressable>
  )
}
