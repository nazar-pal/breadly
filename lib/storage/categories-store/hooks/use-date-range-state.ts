import { DateRangeMode } from '@/lib/storage/categories-store/'
import { addDays, addMonths, addWeeks, addYears, format } from 'date-fns'
import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'
import { calculateDateRange } from '../utils/calculate-date-range'

export const useDateRangeState = () => {
  return categoriesStore(
    useShallow(state => {
      const { start, end } = state.dateRange

      // Format date range for display
      const formattedRange = (() => {
        if (state.dateRangeMode === 'alltime') {
          return 'All Time'
        }

        if (state.dateRangeMode === 'day') {
          return format(start, 'MMM d, yyyy')
        }

        if (start.getFullYear() === end.getFullYear()) {
          if (start.getMonth() === end.getMonth()) {
            return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`
          }
          return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
        }

        return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
      })()

      // Check if navigation is enabled
      const baseCanNavigate =
        state.dateRangeMode !== 'alltime' && state.dateRangeMode !== 'custom'

      // Also check if we can navigate forward without going into the future
      const canNavigateForward = (() => {
        if (!baseCanNavigate) return false

        const { dateRangeMode, currentDate, customDateRange } = state
        let nextDate = currentDate

        switch (dateRangeMode) {
          case 'day':
            nextDate = addDays(currentDate, 1)
            break
          case '7days':
            nextDate = addDays(currentDate, 7)
            break
          case 'week':
            nextDate = addWeeks(currentDate, 1)
            break
          case 'month':
            nextDate = addMonths(currentDate, 1)
            break
          case '30days':
            nextDate = addDays(currentDate, 30)
            break
          case '365days':
            nextDate = addDays(currentDate, 365)
            break
          case 'year':
            nextDate = addYears(currentDate, 1)
            break
          default:
            return false
        }

        const nextRange = calculateDateRange(
          dateRangeMode,
          nextDate,
          customDateRange
        )
        const today = new Date()
        return nextRange.start <= today
      })()

      const canNavigate = baseCanNavigate

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
        isDateRangeModalOpen: state.isDateRangeModalOpen,
        dateRangeMode: state.dateRangeMode,
        currentDate: state.currentDate,
        dateRange: state.dateRange,
        customDateRange: state.customDateRange,
        formattedRange,
        canNavigate,
        canNavigateForward,
        getModeDisplayName,
        failedNavigateNextCounter: state.failedNavigateNextCounter
      }
    })
  )
}
