import { Icon } from '@/components/icon'
import { useColorScheme } from '@/lib/hooks/useColorScheme'
import {
  DateRange,
  useCategoriesDateRangeActions
} from '@/lib/storage/categories-date-range-store'
import { cn } from '@/lib/utils'
import { validateCustomDateRange } from '@/screens/tabs-categories/lib/date-range-validation'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'

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
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const calendarTheme = {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: isDark ? '#A1A1AA' : '#6B7280',
    selectedDayBackgroundColor: PRIMARY_COLOR,
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: PRIMARY_COLOR,
    dayTextColor: isDark ? '#E5E7EB' : '#111827',
    textDisabledColor: isDark ? '#6B7280' : '#9CA3AF',
    arrowColor: PRIMARY_COLOR,
    monthTextColor: isDark ? '#E5E7EB' : '#111827',
    indicatorColor: PRIMARY_COLOR,
    textDayFontSize: 16,
    textDayHeaderFontSize: 12,
    textMonthFontSize: 16,
    arrowStyle: { padding: 8 },
    stylesheet: {
      calendar: {
        main: {
          container: {
            backgroundColor: 'transparent'
          },
          week: {
            backgroundColor: 'transparent'
          }
        },
        header: {
          week: {
            backgroundColor: 'transparent'
          }
        }
      },
      day: {
        basic: {
          base: {
            backgroundColor: 'transparent'
          }
        },
        period: {
          base: {
            backgroundColor: 'transparent'
          }
        }
      }
    } as any
  }

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
          enableSwipeMonths
          hideExtraDays
          renderArrow={direction => (
            <Icon
              name={direction === 'left' ? 'ChevronLeft' : 'ChevronRight'}
              size={18}
              className="text-primary"
            />
          )}
          style={{ padding: 8, backgroundColor: 'transparent' }}
          theme={calendarTheme}
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
