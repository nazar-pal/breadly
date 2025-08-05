import { Icon } from '@/components/icon'
import {
  canNavigateBackward,
  canNavigateForward,
  useCategoriesDateRangeActions,
  useCategoriesDateRangeState
} from '@/lib/storage/categories-date-range-store'
import { formatDateRange } from '@/screens/tabs-categories/lib/format-date-range'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export function Header({
  triggerError,
  showCustomPicker
}: {
  triggerError: () => void
  showCustomPicker: boolean
}) {
  const { dateRange } = useCategoriesDateRangeState()

  const formattedRange = formatDateRange(dateRange)

  const { navigatePrevious, navigateNext } = useCategoriesDateRangeActions()

  const handleNavigateNext = () => {
    if (canNavigateForward(dateRange)) navigateNext()
    else triggerError()
  }

  return (
    <View className="min-h-[60px] flex-row items-center border-b border-border px-4 py-4">
      {!showCustomPicker &&
        canNavigateBackward(dateRange) &&
        navigatePrevious && (
          <Pressable
            onPress={navigatePrevious}
            className="rounded bg-secondary p-2"
          >
            <Icon name="ChevronLeft" size={18} className="text-foreground" />
          </Pressable>
        )}

      <View className="mx-4 flex-1 items-center">
        <Text className="text-center text-lg font-semibold text-foreground">
          {showCustomPicker ? 'Select Custom Range' : 'Date Range'}
        </Text>
        {!showCustomPicker && formattedRange && (
          <Text className="mt-0.5 text-center text-[11px] text-foreground">
            {formattedRange}
          </Text>
        )}
      </View>

      {!showCustomPicker &&
        canNavigateForward(dateRange) &&
        handleNavigateNext && (
          <Pressable
            onPress={handleNavigateNext}
            className="rounded bg-secondary p-2"
          >
            <Icon name="ChevronRight" size={18} className="text-foreground" />
          </Pressable>
        )}
    </View>
  )
}
