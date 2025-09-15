import { Calendar } from '@/components/ui/calendar'
import { Icon } from '@/components/ui/icon-by-name'
import {
  DateRange,
  useCategoriesDateRangeActions
} from '@/lib/storage/categories-date-range-store'
import { cn } from '@/lib/utils'
import { validateCustomDateRange } from '@/screens/tabs-categories/lib/date-range-validation'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { DateData } from 'react-native-calendars'

interface CustomDatePickerProps {
  /**
   * Called after the range is confirmed. Usually closes the whole modal.
   */
  onDone: () => void
  /**
   * Called when the user cancels the custom range selection. Typically just
   * hides the calendar so the user can pick another preset.
   */
  onCancel: () => void
}

/**
 * Color used for the selected period. Kept as a constant so it is easy to
 * reuse in multiple places (confirm button, calendar theme, etc.).
 */
const PRIMARY_COLOR = '#6366F1'

/**
 * Internal representation of the `markedDates` prop consumed by
 * `react-native-calendars`.
 */
type MarkedDate = {
  selected: boolean
  startingDay?: boolean
  endingDay?: boolean
  color?: string
  textColor?: string
}

export function CustomDatePicker({ onDone, onCancel }: CustomDatePickerProps) {
  const { setDateRange } = useCategoriesDateRangeActions()

  // Utility helpers -----------------------------------------------------------
  const pad = (value: number) => `${value}`.padStart(2, '0')
  const getTodayString = () => {
    const now = new Date()
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`
  }
  const todayString = getTodayString()
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })
  const isAtCurrentMonth =
    displayedMonth.year === new Date().getFullYear() &&
    displayedMonth.month === new Date().getMonth() + 1

  /* --------------------------------------------------------------------------
   * Local state
   * ------------------------------------------------------------------------*/
  const [range, setRange] = useState<{ start?: string; end?: string }>({})
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({})

  /* --------------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------------*/

  // Marks every day between `start` and `end` (inclusive) as selected.
  const markDatePeriod = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)

    // Ensure we always iterate forward in time.
    const [from, to] =
      startDate <= endDate ? [startDate, endDate] : [endDate, startDate]

    const nextMarked: Record<string, MarkedDate> = {}
    const cursor = new Date(from)

    while (cursor <= to) {
      const day = cursor.toISOString().split('T')[0]
      nextMarked[day] = {
        selected: true,
        startingDay: day === start,
        endingDay: day === end,
        color: PRIMARY_COLOR,
        textColor: '#FFFFFF'
      }
      cursor.setDate(cursor.getDate() + 1)
    }

    setMarkedDates(nextMarked)
  }

  /* --------------------------------------------------------------------------
   * Event handlers
   * ------------------------------------------------------------------------*/

  const handleDayPress = ({ dateString }: DateData) => {
    // Disallow selecting days after today
    if (new Date(dateString) > new Date(todayString)) return
    // Start a new selection if there is no start date yet OR the user already
    // picked both dates and is starting over.
    if (!range.start || (range.start && range.end)) {
      setRange({ start: dateString })
      setMarkedDates({
        [dateString]: {
          selected: true,
          startingDay: true,
          color: PRIMARY_COLOR,
          textColor: '#FFFFFF'
        }
      })
      return
    }

    // Selecting the second date completes the range.
    setRange(prev => {
      const next = { ...prev, end: dateString }
      markDatePeriod(next.start!, dateString)
      return next
    })
  }

  const handleConfirm = () => {
    if (!range.start || !range.end) return

    const { isValid, error } = validateCustomDateRange(
      new Date(range.start),
      new Date(range.end)
    )

    // Additional guard: do not allow a range that goes beyond today
    // Normalize to start of day to prevent timezone issues
    const startDay = new Date(range.start)
    startDay.setHours(0, 0, 0, 0)
    const endDay = new Date(range.end)
    endDay.setHours(0, 0, 0, 0)
    const todayDay = new Date(todayString)
    todayDay.setHours(0, 0, 0, 0)

    if (startDay > todayDay) return
    if (endDay > todayDay) return

    if (!isValid) throw new Error(error)

    const dateRange: DateRange = {
      mode: 'custom',
      start: new Date(range.start),
      end: new Date(range.end)
    }

    setDateRange(dateRange)
    onDone()
  }

  const handleCancel = () => {
    // Reset local state and let the parent decide what to do next.
    setRange({})
    setMarkedDates({})
    onCancel()
  }

  /* --------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------*/

  return (
    <View className="flex-grow px-5 pb-5 pt-3">
      <View className="rounded-2xl border border-border bg-popover">
        <Calendar
          onDayPress={handleDayPress}
          markingType="period"
          markedDates={markedDates}
          firstDay={1}
          enableSwipeMonths={false}
          hideExtraDays
          maxDate={todayString}
          selectionColor={PRIMARY_COLOR}
          renderArrow={direction => (
            <Icon
              name={direction === 'left' ? 'ChevronLeft' : 'ChevronRight'}
              size={18}
              className={
                direction === 'right' && isAtCurrentMonth
                  ? 'text-muted-foreground/40'
                  : 'text-primary'
              }
            />
          )}
          onMonthChange={m =>
            setDisplayedMonth({ year: m.year, month: m.month })
          }
          onPressArrowLeft={subtractMonth => subtractMonth()}
          onPressArrowRight={addMonth => {
            if (!isAtCurrentMonth) addMonth()
          }}
          disableArrowRight={isAtCurrentMonth}
          style={{ padding: 8, backgroundColor: 'transparent' }}
        />
      </View>

      {/* Action buttons ------------------------------------------------------*/}
      <View className="flex-row gap-3 pt-5">
        <Pressable
          className="flex-[0.4] flex-row items-center justify-center gap-1 rounded-2xl border border-input bg-background py-3 active:opacity-90"
          onPress={handleCancel}
        >
          <Text className="text-base font-semibold text-foreground">
            Cancel
          </Text>
        </Pressable>

        <Pressable
          className={cn(
            'flex-[0.6] flex-row items-center justify-center gap-1 rounded-2xl py-3',
            range.start && range.end ? 'bg-primary' : 'bg-muted'
          )}
          onPress={handleConfirm}
          disabled={!range.start || !range.end}
        >
          <Icon name="Check" size={16} className="text-primary-foreground" />
          <Text
            className={cn(
              'text-base font-semibold',
              range.start && range.end
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            )}
          >
            Confirm
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
