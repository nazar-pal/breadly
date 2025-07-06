import { Check, ChevronLeft, ChevronRight } from '@/lib/icons'
import {
  canNavigateBackward,
  canNavigateForward,
  DateRange,
  DateRangeMode,
  useCategoriesDateRangeActions,
  useCategoriesDateRangeState
} from '@/lib/storage/categories-date-range-store'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Modal } from '../modal'
import { validateCustomDateRange } from './lib/date-range-validation'
import { formatDateRange } from './lib/format-date-range'

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

export function DateRangeModal({ triggerError }: { triggerError: () => void }) {
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [selectedDates, setSelectedDates] = useState<{
    [key: string]: {
      selected: boolean
      startingDay?: boolean
      endingDay?: boolean
      color?: string
    }
  }>({})
  const [customRange, setCustomRange] = useState<{
    start?: string
    end?: string
  }>({})

  const { isDateRangeModalOpen, dateRange } = useCategoriesDateRangeState()

  const formattedRange = formatDateRange(dateRange)

  const {
    closeDateRangeModal,
    setDateRange,
    setDateRangeMode,
    navigatePrevious,
    navigateNext
  } = useCategoriesDateRangeActions()

  const handleNavigateNext = () => {
    if (canNavigateForward(dateRange)) {
      navigateNext()
    } else {
      triggerError()
    }
  }

  const handleClose = () => {
    setShowCustomPicker(false)
    setCustomRange({})
    setSelectedDates({})
    closeDateRangeModal()
  }

  const handleModeSelect = (mode: DateRangeMode) => {
    if (mode === 'custom') {
      setShowCustomPicker(true)
    } else {
      setDateRangeMode(mode)
      handleClose()
    }
  }

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString
    const primaryColor = '#6366F1'

    if (!customRange.start || (customRange.start && customRange.end)) {
      // Start new selection
      setCustomRange({ start: dateString })
      setSelectedDates({
        [dateString]: {
          selected: true,
          startingDay: true,
          color: primaryColor
        }
      })
    } else {
      // End selection
      const startDate = new Date(customRange.start)
      const endDate = new Date(dateString)

      if (endDate < startDate) {
        // If end date is before start date, swap them
        setCustomRange({ start: dateString, end: customRange.start })
      } else {
        setCustomRange({ ...customRange, end: dateString })
      }

      // Mark all dates in range
      const newSelectedDates: typeof selectedDates = {}
      const currentDate = new Date(
        Math.min(startDate.getTime(), endDate.getTime())
      )
      const finalDate = new Date(
        Math.max(startDate.getTime(), endDate.getTime())
      )

      while (currentDate <= finalDate) {
        const current = currentDate.toISOString().split('T')[0]
        newSelectedDates[current] = {
          selected: true,
          startingDay: current === customRange.start,
          endingDay: current === dateString,
          color: primaryColor
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setSelectedDates(newSelectedDates)
    }
  }

  const handleCustomRangeConfirm = () => {
    if (customRange.start && customRange.end) {
      const { isValid, error } = validateCustomDateRange(
        new Date(customRange.start),
        new Date(customRange.end)
      )
      if (!isValid) throw new Error(error)

      const dateRange: DateRange = {
        mode: 'custom',
        start: new Date(customRange.start),
        end: new Date(customRange.end)
      }
      setDateRange(dateRange)
      handleClose()
    }
  }

  const handleCustomRangeCancel = () => {
    setShowCustomPicker(false)
    setCustomRange({})
    setSelectedDates({})
  }

  return (
    <Modal isVisible={isDateRangeModalOpen} onClose={closeDateRangeModal}>
      {/* Header with Navigation */}
      <View className="min-h-[60px] flex-row items-center border-b border-border px-4 py-4">
        {!showCustomPicker &&
          canNavigateBackward(dateRange) &&
          navigatePrevious && (
            <Pressable
              onPress={navigatePrevious}
              className="rounded bg-secondary p-2"
            >
              <ChevronLeft size={18} className="text-foreground" />
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
              <ChevronRight size={18} className="text-foreground" />
            </Pressable>
          )}
      </View>

      {!showCustomPicker ? (
        // Mode Selection
        <ScrollView
          className="flex-grow px-5 pb-5 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-between">
            {MODE_OPTIONS.map(option => (
              <Pressable
                key={option.mode}
                className={`my-1 w-[48%] flex-row items-center rounded-2xl border px-3 py-3 ${
                  dateRange.mode === option.mode
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
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
                  <Check size={16} className="text-primary" />
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        // Custom Date Picker
        <View className="flex-grow px-5 pb-5 pt-3">
          <Calendar
            onDayPress={handleDayPress}
            markingType="period"
            markedDates={selectedDates}
            theme={{
              backgroundColor: '#F5F5F5', // colors.background
              calendarBackground: '#F5F5F5', // colors.background
              textSectionTitleColor: '#4A5568', // colors.textSecondary
              selectedDayBackgroundColor: '#6366F1', // colors.primary
              selectedDayTextColor: '#F5F5F5', // colors.background
              todayTextColor: '#6366F1', // colors.primary
              dayTextColor: '#1A202C', // colors.text
              textDisabledColor: '#4A5568', // colors.textSecondary
              arrowColor: '#6366F1', // colors.primary
              monthTextColor: '#1A202C', // colors.text
              indicatorColor: '#6366F1' // colors.primary
            }}
          />

          {/* Custom Range Actions */}
          <View className="flex-row gap-3 pt-5">
            <Pressable
              className="flex-[0.4] flex-row items-center justify-center gap-1 rounded-2xl bg-secondary py-3"
              onPress={handleCustomRangeCancel}
            >
              <Text className="text-base font-semibold text-foreground">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              className={`flex-[0.6] flex-row items-center justify-center gap-1 rounded-2xl py-3 ${
                customRange.start && customRange.end ? 'bg-primary' : 'bg-muted'
              }`}
              onPress={handleCustomRangeConfirm}
              disabled={!customRange.start || !customRange.end}
            >
              <Check size={16} className="text-primary-foreground" />
              <Text className="text-base font-semibold text-primary-foreground">
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  )
}
