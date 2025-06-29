import { Plus } from '@/lib/icons'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, Text } from 'react-native'

interface AddAccountButtonProps {
  onPress: () => void
  label?: string
}

export function AddAccountButton({
  onPress,
  label = 'Add Account'
}: AddAccountButtonProps) {
  return (
    <Pressable
      className={cn(
        'mb-2 min-h-[60px] w-full flex-row items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-3'
      )}
      onPress={onPress}
    >
      <Plus size={16} className="text-primary" />
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
    </Pressable>
  )
}
