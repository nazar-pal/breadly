import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { cn } from '@/lib/utils'
import React from 'react'
import { Dimensions, Pressable } from 'react-native'

type CategoryType = 'income' | 'expense'

// Layout configuration - inlined from layout-constants
const { width: screenWidth } = Dimensions.get('window')
const ICONS_PER_ROW = 7
const CONTAINER_PADDING = 48 // 24px * 2
const GAP_SIZE = 8
const ICON_HIT_SLOP = 4
const ICON_SIZE_RATIO = 0.5
const BORDER_RADIUS_RATIO = 0.15

// Calculated dimensions
const GAPS_TOTAL = (ICONS_PER_ROW - 1) * GAP_SIZE
const AVAILABLE_WIDTH = screenWidth - CONTAINER_PADDING - GAPS_TOTAL
const ICON_SIZE = Math.floor(AVAILABLE_WIDTH / ICONS_PER_ROW)
const ICON_BORDER_RADIUS = Math.max(8, ICON_SIZE * BORDER_RADIUS_RATIO)
const ICON_DISPLAY_SIZE = Math.max(16, ICON_SIZE * ICON_SIZE_RATIO)

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
  return (
    <Pressable
      className={cn(
        'items-center justify-center border-2',
        isSelected
          ? categoryType === 'income'
            ? 'border-income bg-income/20'
            : 'border-expense bg-expense/20'
          : 'border-border bg-muted'
      )}
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        borderRadius: ICON_BORDER_RADIUS
      }}
      onPress={() => onPress(iconName)}
      hitSlop={{
        top: ICON_HIT_SLOP,
        bottom: ICON_HIT_SLOP,
        left: ICON_HIT_SLOP,
        right: ICON_HIT_SLOP
      }}
    >
      <Icon
        name={iconName}
        size={ICON_DISPLAY_SIZE}
        className={cn(
          isSelected && categoryType === 'income' && 'text-income',
          isSelected && categoryType === 'expense' && 'text-expense',
          !isSelected && 'text-muted-foreground'
        )}
      />
    </Pressable>
  )
}
