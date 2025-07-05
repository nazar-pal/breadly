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
import { DateRange, DateRangeMode, DateRangeState } from '../types'

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
      case 'week':
        newDate = subWeeks(state.currentDate, 1)
        break
      case 'month':
        newDate = subMonths(state.currentDate, 1)
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
      case 'week':
        newDate = addWeeks(state.currentDate, 1)
        break
      case 'month':
        newDate = addMonths(state.currentDate, 1)
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
      week: 'Week',
      month: 'Month',
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
