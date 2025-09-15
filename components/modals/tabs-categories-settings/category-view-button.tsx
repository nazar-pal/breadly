import { Icon, IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { CategoryViewType } from '@/lib/storage/category-view-store'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable } from 'react-native'

interface CategoryViewButtonProps {
  viewType: CategoryViewType
  currentViewType: CategoryViewType
  onPress: () => void
  icon: IconName
  label: string
}

export function CategoryViewButton({
  viewType,
  currentViewType,
  onPress,
  icon,
  label
}: CategoryViewButtonProps) {
  const isSelected = currentViewType === viewType

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 py-3.5 active:opacity-90',
        isSelected && 'border-primary/40 bg-primary/5'
      )}
    >
      <Icon
        name={icon}
        size={18}
        className={cn('text-muted-foreground', isSelected && 'text-primary')}
      />
      <Text
        className={cn(
          'text-sm font-medium text-foreground',
          isSelected && 'text-primary'
        )}
      >
        {label}
      </Text>
    </Pressable>
  )
}
