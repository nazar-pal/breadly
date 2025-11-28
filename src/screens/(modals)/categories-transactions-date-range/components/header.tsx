import { Icon } from '@/components/ui/icon-by-name'
import {
  canNavigateBackward,
  canNavigateForward,
  useCategoriesDateRangeActions,
  useCategoriesDateRangeState
} from '@/lib/storage/categories-date-range-store'
import { formatDateRange } from '@/screens/(tabs)/categories/components/lib/format-date-range'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export function Header() {
  const { dateRange } = useCategoriesDateRangeState()

  const formattedRange = formatDateRange(dateRange)

  const { navigatePrevious, navigateNext } = useCategoriesDateRangeActions()

  const handleNavigateNext = () => {
    navigateNext()
  }

  return (
    <View className="border-border/80 bg-popover min-h-[60px] flex-row items-center border-b py-4">
      {canNavigateBackward(dateRange) && navigatePrevious && (
        <Pressable
          onPress={navigatePrevious}
          className="border-input bg-background rounded-xl border p-2 active:opacity-90"
        >
          <Icon
            name="ChevronLeft"
            size={18}
            className="text-muted-foreground"
          />
        </Pressable>
      )}

      <View className="mx-4 flex-1 items-center">
        <Text className="text-foreground text-center text-lg font-semibold">
          Date Range
        </Text>
        {formattedRange && (
          <Text className="text-muted-foreground mt-0.5 text-center text-[11px]">
            {formattedRange}
          </Text>
        )}
      </View>

      {canNavigateForward(dateRange) && handleNavigateNext && (
        <Pressable
          onPress={handleNavigateNext}
          className="border-input bg-background rounded-xl border p-2 active:opacity-90"
        >
          <Icon
            name="ChevronRight"
            size={18}
            className="text-muted-foreground"
          />
        </Pressable>
      )}
    </View>
  )
}
