import { addDays, addMonths, addWeeks, addYears, format } from 'date-fns'
import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'
import { calculateDateRange } from '../utils/calculate-date-range'

export const useDateRangeState = () => {
  return categoriesStore(
    useShallow(state => {
      const { dateRange } = state

      // Format date range for display
      const formattedRange = (() => {
        if (dateRange.mode === 'alltime' || !dateRange.start) {
          return 'All Time'
        }

        if (dateRange.mode === 'day') {
          return format(dateRange.start, 'MMM d, yyyy')
        }

        if (dateRange.start.getFullYear() === dateRange.end.getFullYear()) {
          if (dateRange.start.getMonth() === dateRange.end.getMonth()) {
            return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'd, yyyy')}`
          }
          return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`
        }

        return `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`
      })()

      // Check if navigation is enabled
      const baseCanNavigate =
        dateRange.mode !== 'alltime' && dateRange.mode !== 'custom'

      // Also check if we can navigate forward without going into the future
      const canNavigateForward = (() => {
        if (!baseCanNavigate) return false

        let nextDate = state.currentDate

        switch (dateRange.mode) {
          case 'day':
            nextDate = addDays(state.currentDate, 1)
            break
          case 'week':
            nextDate = addWeeks(state.currentDate, 1)
            break
          case 'month':
            nextDate = addMonths(state.currentDate, 1)
            break
          case 'year':
            nextDate = addYears(state.currentDate, 1)
            break
          default:
            return false
        }

        const nextRange = calculateDateRange(dateRange.mode, nextDate)
        const today = new Date()
        return nextRange.start != null && nextRange.start <= today
      })()

      const canNavigate = baseCanNavigate

      return {
        isDateRangeModalOpen: state.isDateRangeModalOpen,
        currentDate: state.currentDate,
        dateRange: state.dateRange,
        customDateRange: state.customDateRange,
        formattedRange,
        canNavigate,
        canNavigateForward,
        failedNavigateNextCounter: state.failedNavigateNextCounter
      }
    })
  )
}
