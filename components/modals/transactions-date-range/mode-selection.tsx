import { Icon } from '@/components/icon'
import {
  DateRangeMode,
  useCategoriesDateRangeActions,
  useCategoriesDateRangeState
} from '@/lib/storage/categories-date-range-store'
import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

const MODE_OPTIONS: {
  mode: DateRangeMode
  label: string
  description: string
}[] = [
  { mode: 'day', label: 'Day', description: 'Single day view' },
  { mode: 'week', label: 'Week', description: 'Calendar week (Mon-Sun)' },
  { mode: 'month', label: 'Month', description: 'Calendar month' },
  { mode: 'year', label: 'Year', description: 'Calendar year' },
  { mode: 'alltime', label: 'All Time', description: 'All available data' },
  {
    mode: 'custom',
    label: 'Custom Range',
    description: 'Choose specific dates'
  }
]

export function ModeSelection({
  handleClose,
  setShowCustomPicker
}: {
  handleClose: () => void
  setShowCustomPicker: (show: boolean) => void
}) {
  const { dateRange } = useCategoriesDateRangeState()

  const { setDateRangeMode } = useCategoriesDateRangeActions()

  const handleModeSelect = (mode: DateRangeMode) => {
    if (mode === 'custom') {
      setShowCustomPicker(true)
    } else {
      setDateRangeMode(mode)
      handleClose()
    }
  }

  return (
    <ScrollView
      className="flex-grow px-5 pb-5 pt-3"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row flex-wrap justify-between">
        {MODE_OPTIONS.map(option => (
          <Pressable
            key={option.mode}
            className={`my-1 w-[48%] flex-row items-center rounded-2xl border px-3 py-3 active:opacity-90 ${
              dateRange.mode === option.mode
                ? 'border-primary/40 bg-primary/5'
                : 'border-input bg-background'
            }`}
            onPress={() => handleModeSelect(option.mode)}
          >
            <View className="flex-1">
              <Text
                className={`mb-0.5 text-[15px] font-semibold ${
                  dateRange.mode === option.mode
                    ? 'text-primary'
                    : 'text-foreground'
                }`}
              >
                {option.label}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {option.description}
              </Text>
            </View>
            {dateRange.mode === option.mode && (
              <Icon name="Check" size={16} className="text-primary" />
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}
