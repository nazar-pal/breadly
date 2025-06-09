import { DateRange, DateRangeMode } from '@/hooks/useDateRange'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react-native'
import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface DateRangeModalProps {
  visible: boolean
  currentMode: DateRangeMode
  onSelectMode: (mode: DateRangeMode, customRange?: DateRange) => void
  onClose: () => void
  // Navigation props
  canNavigate?: boolean
  navigatePrevious?: () => void
  navigateNext?: () => void
  formattedRange?: string
}

const MODE_OPTIONS: {
  mode: DateRangeMode
  label: string
  description: string
}[] = [
  { mode: 'day', label: 'Day', description: 'Single day view' },
  { mode: '7days', label: '7 Days', description: 'Last 7 days' },
  { mode: 'week', label: 'Week', description: 'Calendar week (Mon-Sun)' },
  { mode: 'month', label: 'Month', description: 'Calendar month' },
  { mode: '30days', label: '30 Days', description: 'Last 30 days' },
  { mode: '365days', label: '365 Days', description: 'Last 365 days' },
  { mode: 'year', label: 'Year', description: 'Calendar year' },
  { mode: 'alltime', label: 'All Time', description: 'All available data' },
  {
    mode: 'custom',
    label: 'Custom Range',
    description: 'Choose specific dates'
  }
]

export default function DateRangeModal({
  visible,
  currentMode,
  onSelectMode,
  onClose,
  canNavigate = false,
  navigatePrevious,
  navigateNext,
  formattedRange
}: DateRangeModalProps) {
  const insets = useSafeAreaInsets()
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

  const handleModeSelect = (mode: DateRangeMode) => {
    if (mode === 'custom') {
      setShowCustomPicker(true)
    } else {
      onSelectMode(mode)
      onClose()
    }
  }

  const handleDayPress = (day: any) => {
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
      const dateRange: DateRange = {
        start: new Date(customRange.start),
        end: new Date(customRange.end)
      }
      onSelectMode('custom', dateRange)
      setShowCustomPicker(false)
      setCustomRange({})
      setSelectedDates({})
      onClose()
    }
  }

  const handleCustomRangeCancel = () => {
    setShowCustomPicker(false)
    setCustomRange({})
    setSelectedDates({})
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
          onPress={onClose}
        />
        <View
          className="max-h-[80%] min-h-[50%] rounded-t-3xl bg-old-background"
          style={{
            paddingBottom: insets.bottom + 16
          }}
        >
          {/* Header with Navigation */}
          <View className="min-h-[60px] flex-row items-center border-b border-old-border px-4 py-4">
            {!showCustomPicker && canNavigate && navigatePrevious && (
              <Pressable
                onPress={navigatePrevious}
                className="rounded bg-old-surface-secondary p-2"
              >
                <ChevronLeft size={18} color="#1A202C" />
              </Pressable>
            )}

            <View className="mx-4 flex-1 items-center">
              <Text className="text-center text-lg font-semibold text-old-text">
                {showCustomPicker ? 'Select Custom Range' : 'Date Range'}
              </Text>
              {!showCustomPicker && formattedRange && (
                <Text className="mt-0.5 text-center text-[11px] text-old-text-secondary">
                  {formattedRange}
                </Text>
              )}
            </View>

            {!showCustomPicker && canNavigate && navigateNext && (
              <Pressable
                onPress={navigateNext}
                className="rounded bg-old-surface-secondary p-2"
              >
                <ChevronRight size={18} color="#1A202C" />
              </Pressable>
            )}

            <Pressable
              onPress={showCustomPicker ? handleCustomRangeCancel : onClose}
              className="p-2"
            >
              <X size={20} color="#1A202C" />
            </Pressable>
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
                    className="my-1 w-[48%] flex-row items-center rounded-2xl border px-3 py-3"
                    style={{
                      backgroundColor:
                        currentMode === option.mode
                          ? 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
                          : '#FFFFFF', // colors.card
                      borderColor:
                        currentMode === option.mode
                          ? '#6366F1' // colors.primary
                          : '#E2E8F0' // colors.border
                    }}
                    onPress={() => handleModeSelect(option.mode)}
                  >
                    <View className="flex-1">
                      <Text
                        className="mb-0.5 text-[15px] font-semibold"
                        style={{
                          color:
                            currentMode === option.mode
                              ? '#6366F1' // colors.primary
                              : '#1A202C' // colors.text
                        }}
                      >
                        {option.label}
                      </Text>
                      <Text className="text-xs text-old-text-secondary">
                        {option.description}
                      </Text>
                    </View>
                    {currentMode === option.mode && (
                      <Check size={16} color="#6366F1" />
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
                  className="flex-[0.4] flex-row items-center justify-center gap-1 rounded-2xl bg-old-secondary py-3"
                  onPress={handleCustomRangeCancel}
                >
                  <Text className="text-base font-semibold text-old-text">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  className="flex-[0.6] flex-row items-center justify-center gap-1 rounded-2xl py-3"
                  style={{
                    backgroundColor:
                      customRange.start && customRange.end
                        ? '#6366F1' // colors.primary
                        : '#CBD5E0' // colors.button.primaryBgDisabled
                  }}
                  onPress={handleCustomRangeConfirm}
                  disabled={!customRange.start || !customRange.end}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text className="text-base font-semibold text-old-button-primary-text">
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}
