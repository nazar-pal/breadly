import { Plus } from '@/lib/icons'
import { cn } from '@/lib/utils'
import React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

interface AddAccountButtonProps {
  onPress: () => void
  label?: string
}

export default function AddAccountButton({
  onPress,
  label = 'Add Account'
}: AddAccountButtonProps) {
  return (
    <Pressable
      className={cn(
        'bg-card mb-2 min-h-[60px] w-full rounded-xl border-2 border-dashed p-3',
        Platform.OS === 'android' ? 'shadow' : 'shadow-sm'
      )}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-center gap-3">
        <View className="h-7 w-7 items-center justify-center rounded-md">
          <Plus size={16} className="text-primary" />
        </View>
        <Text className="text-foreground text-center text-sm font-semibold">
          {label}
        </Text>
      </View>
    </Pressable>
  )
}
