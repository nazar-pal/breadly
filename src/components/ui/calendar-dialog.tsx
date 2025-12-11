import {
  Calendar,
  fromDateId,
  toDateId,
  type CalendarListProps
} from '@marceloterreiro/flash-calendar'
import * as R from 'react'
import { useWindowDimensions, View } from 'react-native'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './dialog'

/* -----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */

type CalendarDialogProps = {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Dialog title */
  title: string
  /** Currently selected date */
  selectedDate?: Date | string
  /** Callback when a date is selected */
  onDateSelect: (date: Date) => void
  /** Footer content (e.g., quick action buttons) */
  children?: React.ReactNode
} & Omit<
  CalendarListProps,
  'calendarInitialMonthId' | 'calendarActiveDateRanges' | 'onCalendarDayPress'
>

/* -----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

const isDate = (value: unknown): value is Date => value instanceof Date

const getDateId = (value: Date | string | undefined): string | undefined => {
  if (!value) return undefined
  if (isDate(value)) return toDateId(value)
  return value
}

/* -----------------------------------------------------------------------------
 * CalendarDialog
 * -------------------------------------------------------------------------- */

const CalendarDialog = R.forwardRef<View, CalendarDialogProps>(
  (
    {
      open,
      onOpenChange,
      title,
      selectedDate,
      onDateSelect,
      children,
      // Calendar.List props with defaults
      calendarFirstDayOfWeek = 'monday',
      calendarPastScrollRangeInMonths = 12,
      calendarFutureScrollRangeInMonths = 12,
      // Rest of Calendar.List props
      ...calendarProps
    },
    ref
  ) => {
    const { height: windowHeight } = useWindowDimensions()

    // Fixed height for calendar to prevent layout thrashing with Dialog's ScrollView
    const calendarHeight = Math.min(windowHeight * 0.7, 420)

    const selectedDateId = R.useMemo(
      () => getDateId(selectedDate),
      [selectedDate]
    )

    // Memoize activeDateRanges - critical for Calendar.List performance
    const activeDateRanges = R.useMemo(
      () =>
        selectedDateId
          ? [{ startId: selectedDateId, endId: selectedDateId }]
          : undefined,
      [selectedDateId]
    )

    // Memoize the day press handler to prevent unnecessary re-renders
    const handleDayPress = R.useCallback(
      (dateId: string) => {
        onDateSelect(fromDateId(dateId))
      },
      [onDateSelect]
    )

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <View className="px-6 pb-6">
            {/* Fixed height container prevents infinite layout loop with Dialog's ScrollView */}
            <View style={{ height: calendarHeight, overflow: 'hidden' }}>
              {/* Only render Calendar.List when dialog is open for performance */}
              {open && (
                <Calendar.List
                  calendarInitialMonthId={selectedDateId}
                  calendarFirstDayOfWeek={calendarFirstDayOfWeek}
                  calendarActiveDateRanges={activeDateRanges}
                  calendarPastScrollRangeInMonths={
                    calendarPastScrollRangeInMonths
                  }
                  calendarFutureScrollRangeInMonths={
                    calendarFutureScrollRangeInMonths
                  }
                  onCalendarDayPress={handleDayPress}
                  {...calendarProps}
                />
              )}
            </View>
          </View>
          {children && <DialogFooter>{children}</DialogFooter>}
        </DialogContent>
      </Dialog>
    )
  }
)

CalendarDialog.displayName = 'CalendarDialog'

export { CalendarDialog }
export type { CalendarDialogProps }

