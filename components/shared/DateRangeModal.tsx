import { useTheme, useThemedStyles } from '@/context/ThemeContext'
import { DateRange, DateRangeMode } from '@/hooks/useDateRange'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
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
  const { colors } = useTheme()
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

  const styles = useThemedStyles(theme => ({
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.shadow
    },
    modalContent: {
      backgroundColor: theme.colors.background
    },
    navButton: {
      backgroundColor: theme.colors.surfaceSecondary
    },
    modeOption: {
      borderWidth: 1
    },
    cancelButton: {
      backgroundColor: theme.colors.secondary
    }
  }))

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

    if (!customRange.start || (customRange.start && customRange.end)) {
      // Start new selection
      setCustomRange({ start: dateString })
      setSelectedDates({
        [dateString]: {
          selected: true,
          startingDay: true,
          color: colors.primary
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
          color: colors.primary
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
        <Pressable style={styles.modalOverlay} onPress={onClose} />
        <View
          className="max-h-[80%] min-h-[50%] rounded-t-3xl"
          style={[
            styles.modalContent,
            {
              paddingBottom: insets.bottom + 16
            }
          ]}
        >
          {/* Header with Navigation */}
          <View
            className="min-h-[60px] flex-row items-center border-b px-4 py-4"
            style={{ borderBottomColor: colors.border }}
          >
            {!showCustomPicker && canNavigate && navigatePrevious && (
              <Pressable
                onPress={navigatePrevious}
                className="rounded p-2"
                style={styles.navButton}
              >
                <ChevronLeft size={18} color={colors.text} />
              </Pressable>
            )}

            <View className="mx-4 flex-1 items-center">
              <Text
                className="text-center text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {showCustomPicker ? 'Select Custom Range' : 'Date Range'}
              </Text>
              {!showCustomPicker && formattedRange && (
                <Text
                  className="mt-0.5 text-center text-[11px]"
                  style={{ color: colors.textSecondary }}
                >
                  {formattedRange}
                </Text>
              )}
            </View>

            {!showCustomPicker && canNavigate && navigateNext && (
              <Pressable
                onPress={navigateNext}
                className="rounded p-2"
                style={styles.navButton}
              >
                <ChevronRight size={18} color={colors.text} />
              </Pressable>
            )}

            <Pressable
              onPress={showCustomPicker ? handleCustomRangeCancel : onClose}
              className="p-2"
            >
              <X size={20} color={colors.text} />
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
                    className="my-1 w-[48%] flex-row items-center rounded-2xl px-3 py-3"
                    style={[
                      styles.modeOption,
                      {
                        backgroundColor:
                          currentMode === option.mode
                            ? colors.iconBackground.primary
                            : colors.card,
                        borderColor:
                          currentMode === option.mode
                            ? colors.primary
                            : colors.border
                      }
                    ]}
                    onPress={() => handleModeSelect(option.mode)}
                  >
                    <View className="flex-1">
                      <Text
                        className="mb-0.5 text-[15px] font-semibold"
                        style={{
                          color:
                            currentMode === option.mode
                              ? colors.primary
                              : colors.text
                        }}
                      >
                        {option.label}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        {option.description}
                      </Text>
                    </View>
                    {currentMode === option.mode && (
                      <Check size={16} color={colors.primary} />
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
                  backgroundColor: colors.background,
                  calendarBackground: colors.background,
                  textSectionTitleColor: colors.textSecondary,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.background,
                  todayTextColor: colors.primary,
                  dayTextColor: colors.text,
                  textDisabledColor: colors.textSecondary,
                  arrowColor: colors.primary,
                  monthTextColor: colors.text,
                  indicatorColor: colors.primary
                }}
              />

              {/* Custom Range Actions */}
              <View className="flex-row gap-3 pt-5">
                <Pressable
                  className="flex-[0.4] flex-row items-center justify-center gap-1 rounded-2xl py-3"
                  style={styles.cancelButton}
                  onPress={handleCustomRangeCancel}
                >
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.text }}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  className="flex-[0.6] flex-row items-center justify-center gap-1 rounded-2xl py-3"
                  style={{
                    backgroundColor:
                      customRange.start && customRange.end
                        ? colors.primary
                        : colors.button.primaryBgDisabled
                  }}
                  onPress={handleCustomRangeConfirm}
                  disabled={!customRange.start || !customRange.end}
                >
                  <Check size={16} color={colors.button.primaryText} />
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.button.primaryText }}
                  >
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
