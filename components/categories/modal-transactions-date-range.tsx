import { Check, ChevronLeft, ChevronRight } from '@/lib/icons'
import {
  DateRange,
  DateRangeMode,
  useCategoriesActions,
  useDateRangeState
} from '@/lib/storage/categories-store'
import React, { useEffect, useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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

export function DateRangeModal({ triggerError }: { triggerError: () => void }) {
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

  // Animation values for swipe to dismiss
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)

  const {
    isDateRangeModalOpen,
    dateRangeMode,
    formattedRange,
    canNavigate,
    canNavigateForward
  } = useDateRangeState()

  const {
    closeDateRangeModal,
    setDateRangeMode,
    navigatePrevious,
    navigateNext
  } = useCategoriesActions()

  const handleNavigateNext = () => {
    if (canNavigateForward) {
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

  const animateClose = () => {
    'worklet'
    runOnJS(handleClose)()
  }

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet'
      // Initial touch
    })
    .onUpdate(event => {
      'worklet'
      const newTranslateY = Math.max(0, event.translationY)
      translateY.value = newTranslateY

      // Fade out as user drags down
      const progress = Math.min(newTranslateY / 200, 1)
      opacity.value = 1 - progress * 0.3
    })
    .onEnd(event => {
      'worklet'
      const shouldClose = event.translationY > 120 || event.velocityY > 800

      if (shouldClose) {
        translateY.value = withTiming(500, { duration: 200 })
        opacity.value = withTiming(0, { duration: 200 }, () => {
          // Call JS to close modal after animation finishes
          animateClose()
        })
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 180 })
        opacity.value = withSpring(1, { damping: 20, stiffness: 180 })
      }
    })

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }))

  // Reset shared values when modal becomes isDateRangeModalOpen to avoid stale off-screen positions.
  useEffect(() => {
    if (isDateRangeModalOpen) {
      translateY.value = 0
      opacity.value = 1
    }
  }, [isDateRangeModalOpen])

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
      const dateRange: DateRange = {
        start: new Date(customRange.start),
        end: new Date(customRange.end)
      }
      setDateRangeMode('custom', dateRange)
      handleClose()
    }
  }

  const handleCustomRangeCancel = () => {
    setShowCustomPicker(false)
    setCustomRange({})
    setSelectedDates({})
  }

  return (
    <Modal
      visible={isDateRangeModalOpen}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-end">
          <TouchableWithoutFeedback
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          >
            <View className="absolute inset-0 bg-black/10" />
          </TouchableWithoutFeedback>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className="max-h-[80%] min-h-[50%] rounded-t-3xl bg-background"
              style={[
                {
                  paddingBottom: insets.bottom + 16
                },
                animatedModalStyle
              ]}
            >
              {/* Drag Indicator */}
              <View className="items-center py-3">
                <View className="h-1 w-10 rounded-full bg-muted" />
              </View>

              {/* Header with Navigation */}
              <View className="min-h-[60px] flex-row items-center border-b border-border px-4 py-4">
                {!showCustomPicker && canNavigate && navigatePrevious && (
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

                {!showCustomPicker && canNavigate && handleNavigateNext && (
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
                          dateRangeMode === option.mode
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card'
                        }`}
                        onPress={() => handleModeSelect(option.mode)}
                      >
                        <View className="flex-1">
                          <Text
                            className={`mb-0.5 text-[15px] font-semibold ${
                              dateRangeMode === option.mode
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
                        {dateRangeMode === option.mode && (
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
                        customRange.start && customRange.end
                          ? 'bg-primary'
                          : 'bg-muted'
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
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}
