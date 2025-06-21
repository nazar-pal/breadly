import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns'
import { useMemo, useState } from 'react'

export type DateRangeMode =
  | 'day'
  | '7days'
  | 'week'
  | 'month'
  | '30days'
  | '365days'
  | 'year'
  | 'alltime'
  | 'custom'

export interface DateRange {
  start: Date
  end: Date
}

export interface DateRangeState {
  mode: DateRangeMode
  currentDate: Date
  dateRange: DateRange
  customRange?: DateRange
}

export function useDateRange() {
  const [state, setState] = useState<DateRangeState>({
    mode: 'week',
    currentDate: new Date(),
    dateRange: {
      start: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday start
      end: endOfWeek(new Date(), { weekStartsOn: 1 })
    }
  })

  // Calculate date range based on mode and current date
  const calculateDateRange = (
    mode: DateRangeMode,
    currentDate: Date,
    customRange?: DateRange
  ): DateRange => {
    switch (mode) {
      case 'day':
        return {
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        }

      case '7days':
        return {
          start: startOfDay(currentDate),
          end: endOfDay(addDays(currentDate, 6))
        }

      case 'week':
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        }

      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        }

      case '30days':
        return {
          start: startOfDay(currentDate),
          end: endOfDay(addDays(currentDate, 29))
        }

      case '365days':
        return {
          start: startOfDay(currentDate),
          end: endOfDay(addDays(currentDate, 364))
        }

      case 'year':
        return {
          start: startOfYear(currentDate),
          end: endOfYear(currentDate)
        }

      case 'alltime':
        return {
          start: new Date(2020, 0, 1), // Arbitrary start date
          end: new Date()
        }

      case 'custom':
        return (
          customRange || {
            start: startOfWeek(currentDate, { weekStartsOn: 1 }),
            end: endOfWeek(currentDate, { weekStartsOn: 1 })
          }
        )

      default:
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        }
    }
  }

  // Navigate to previous period
  const navigatePrevious = () => {
    if (state.mode === 'alltime' || state.mode === 'custom') return

    let newDate = state.currentDate

    switch (state.mode) {
      case 'day':
        newDate = subDays(state.currentDate, 1)
        break
      case '7days':
        newDate = subDays(state.currentDate, 7)
        break
      case 'week':
        newDate = subWeeks(state.currentDate, 1)
        break
      case 'month':
        newDate = subMonths(state.currentDate, 1)
        break
      case '30days':
        newDate = subDays(state.currentDate, 30)
        break
      case '365days':
        newDate = subDays(state.currentDate, 365)
        break
      case 'year':
        newDate = subYears(state.currentDate, 1)
        break
    }

    setState(prev => ({
      ...prev,
      currentDate: newDate,
      dateRange: calculateDateRange(prev.mode, newDate, prev.customRange)
    }))
  }

  // Navigate to next period
  const navigateNext = () => {
    if (state.mode === 'alltime' || state.mode === 'custom') return

    let newDate = state.currentDate

    switch (state.mode) {
      case 'day':
        newDate = addDays(state.currentDate, 1)
        break
      case '7days':
        newDate = addDays(state.currentDate, 7)
        break
      case 'week':
        newDate = addWeeks(state.currentDate, 1)
        break
      case 'month':
        newDate = addMonths(state.currentDate, 1)
        break
      case '30days':
        newDate = addDays(state.currentDate, 30)
        break
      case '365days':
        newDate = addDays(state.currentDate, 365)
        break
      case 'year':
        newDate = addYears(state.currentDate, 1)
        break
    }

    setState(prev => ({
      ...prev,
      currentDate: newDate,
      dateRange: calculateDateRange(prev.mode, newDate, prev.customRange)
    }))
  }

  // Change mode
  const setMode = (mode: DateRangeMode, customRange?: DateRange) => {
    const newCurrentDate =
      mode === 'custom' && customRange ? customRange.start : new Date()

    setState(prev => ({
      ...prev,
      mode,
      currentDate: newCurrentDate,
      customRange,
      dateRange: calculateDateRange(mode, newCurrentDate, customRange)
    }))
  }

  // Format date range for display
  const formattedRange = useMemo(() => {
    const { start, end } = state.dateRange

    if (state.mode === 'alltime') {
      return 'All Time'
    }

    if (state.mode === 'day') {
      return format(start, 'MMM d, yyyy')
    }

    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`
      }
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    }

    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
  }, [state.dateRange, state.mode])

  // Check if navigation is enabled
  const canNavigate = state.mode !== 'alltime' && state.mode !== 'custom'

  // Get mode display name
  const getModeDisplayName = (mode: DateRangeMode): string => {
    const modeNames: Record<DateRangeMode, string> = {
      day: 'Day',
      '7days': '7 Days',
      week: 'Week',
      month: 'Month',
      '30days': '30 Days',
      '365days': '365 Days',
      year: 'Year',
      alltime: 'All Time',
      custom: 'Custom Range'
    }
    return modeNames[mode]
  }

  return {
    // State
    mode: state.mode,
    dateRange: state.dateRange,
    currentDate: state.currentDate,
    formattedRange,
    canNavigate,

    // Actions
    navigatePrevious,
    navigateNext,
    setMode,
    getModeDisplayName,

    // Utilities
    calculateDateRange
  }
}
