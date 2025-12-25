import { Icon, type IconName } from '@/components/ui/lucide-icon-by-name'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, useWindowDimensions } from 'react-native'

type CategoryType = 'income' | 'expense'

const COLUMNS = 7
const CONTAINER_PADDING = 32 // p-4 = 16px each side
const GAP = 8 // gap-2

interface Props {
  iconName: IconName
  isSelected: boolean
  categoryType: CategoryType
  onPress: (iconName: IconName) => void
}

export function IconButton({
  iconName,
  isSelected,
  categoryType,
  onPress
}: Props) {
  const { width } = useWindowDimensions()
  const availableWidth = width - CONTAINER_PADDING
  const totalGaps = (COLUMNS - 1) * GAP
  const iconSize = (availableWidth - totalGaps) / COLUMNS

  return (
    <Pressable
      className={cn(
        'items-center justify-center rounded-xl border-2',
        isSelected
          ? categoryType === 'income'
            ? 'border-income bg-income/20'
            : 'border-expense bg-expense/20'
          : 'border-border bg-muted'
      )}
      style={{ width: iconSize, height: iconSize }}
      onPress={() => onPress(iconName)}
      hitSlop={4}
    >
      <Icon
        name={iconName}
        size={iconSize * 0.45}
        className={cn(
          isSelected && categoryType === 'income' && 'text-income',
          isSelected && categoryType === 'expense' && 'text-expense',
          !isSelected && 'text-muted-foreground'
        )}
      />
    </Pressable>
  )
}
