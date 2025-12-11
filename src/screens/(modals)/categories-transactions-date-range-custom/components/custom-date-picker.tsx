import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import {
  DateRange,
  useCategoriesDateRangeActions,
  useCategoriesDateRangeState
} from '@/lib/storage/categories-date-range-store'
import { validateCustomDateRange } from '@/screens/(tabs)/categories/components/lib/date-range-validation'
import {
  Calendar,
  fromDateId,
  toDateId,
  useDateRange
} from '@marceloterreiro/flash-calendar'
import { Platform, useWindowDimensions, View } from 'react-native'

interface CustomDatePickerProps {
  onDone: () => void
  onCancel: () => void
}

export function CustomDatePicker({ onDone, onCancel }: CustomDatePickerProps) {
  const { setDateRange } = useCategoriesDateRangeActions()
  const { dateRange: currentDateRange } = useCategoriesDateRangeState()
  const { height: windowHeight } = useWindowDimensions()

  const todayId = toDateId(new Date())

  // If there's an existing custom range, use it as initial values
  const hasExistingCustomRange =
    currentDateRange.mode === 'custom' &&
    currentDateRange.start &&
    currentDateRange.end

  const initialStartId = hasExistingCustomRange
    ? toDateId(currentDateRange.start)
    : undefined

  const initialEndId = hasExistingCustomRange
    ? toDateId(currentDateRange.end)
    : undefined

  const initialMonthId = initialStartId ?? todayId

  const {
    calendarActiveDateRanges,
    onCalendarDayPress,
    dateRange,
    onClearDateRange
  } = useDateRange({
    startId: initialStartId,
    endId: initialEndId
  })

  const hasValidRange = Boolean(dateRange.startId && dateRange.endId)
  const calendarHeight = Math.min(windowHeight * 0.6, 450)

  const handleDayPress = (dateId: string) => {
    if (dateId > todayId) return
    onCalendarDayPress(dateId)
  }

  const handleConfirm = () => {
    if (!dateRange.startId || !dateRange.endId) return

    const startDate = fromDateId(dateRange.startId)
    const endDate = fromDateId(dateRange.endId)

    const { isValid, error } = validateCustomDateRange(startDate, endDate)
    if (!isValid) throw new Error(error)

    const customDateRange: DateRange = {
      mode: 'custom',
      start: startDate,
      end: endDate
    }

    setDateRange(customDateRange)
    onDone()
  }

  const handleCancel = () => {
    onClearDateRange()
    onCancel()
  }

  return (
    <View className="bg-popover ios:pb-0 android:pb-safe-or-4 px-4 pt-4">
      <View style={{ height: calendarHeight }}>
        <Calendar.List
          calendarInitialMonthId={initialMonthId}
          calendarFirstDayOfWeek="monday"
          calendarActiveDateRanges={calendarActiveDateRanges}
          calendarMaxDateId={todayId}
          calendarFutureScrollRangeInMonths={0}
          onCalendarDayPress={handleDayPress}
          // Enable nested scrolling on Android to work inside bottom sheets
          nestedScrollEnabled={Platform.OS === 'android'}
        />
      </View>

      {/* Action bar */}
      <View className="flex-row gap-3 px-1 pt-4 pb-2">
        <Button variant="outline" className="flex-[0.4]" onPress={handleCancel}>
          <Text>Cancel</Text>
        </Button>
        <Button
          variant={hasValidRange ? 'default' : 'secondary'}
          className="flex-[0.6]"
          onPress={handleConfirm}
          disabled={!hasValidRange}
        >
          <Text>Confirm</Text>
        </Button>
      </View>
    </View>
  )
}
