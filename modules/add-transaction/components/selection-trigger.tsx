import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, View } from 'react-native'

interface Props {
  label: string
  value: string
  iconName: string
  onPress: () => void
  className?: string
  disabled?: boolean
}

export function SelectionTrigger({
  label,
  value,
  iconName,
  onPress,
  className,
  disabled
}: Props) {
  return (
    <Pressable
      className={cn(
        'flex-1 flex-row items-center justify-between',
        'rounded-lg border px-3 py-2',
        'border-input bg-card shadow-sm shadow-black/5 active:bg-muted/50 dark:bg-card/30 dark:active:bg-card/50',
        disabled && 'opacity-50',
        className
      )}
      onPress={onPress}
    >
      <View className="flex-1 flex-row items-center">
        <View className="mr-2 rounded-lg bg-primary/10 p-1">
          <Icon name={iconName} size={14} className="text-primary" />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </Text>
          <Text
            className="text-sm font-semibold text-foreground"
            numberOfLines={1}
          >
            {value}
          </Text>
        </View>
      </View>
      <Icon
        name="ChevronDown"
        size={14}
        className="ml-1 text-muted-foreground"
      />
    </Pressable>
  )
}
