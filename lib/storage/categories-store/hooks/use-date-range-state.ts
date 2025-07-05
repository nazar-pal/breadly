import { addDays, addMonths, addWeeks, addYears, format } from 'date-fns'
import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'
import { calculateDateRange } from '../utils/calculate-date-range'

export const useDateRangeState = () => {
  return categoriesStore(
    useShallow(state => {
      const { start, end, mode } = state.dateRange

      // Format date range for display
      const formattedRange = (() => {
        if (state.dateRangeMode === 'alltime' || !start) {
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

        if (state.dateRange.mode === 'custom') return false

        const { dateRangeMode, currentDate } = state
        let nextDate = currentDate

        switch (dateRangeMode) {
          case 'day':
            nextDate = addDays(currentDate, 1)
            break
          case 'week':
            nextDate = addWeeks(currentDate, 1)
            break
          case 'month':
            nextDate = addMonths(currentDate, 1)
            break
          case 'year':
            nextDate = addYears(currentDate, 1)
            break
          default:
            return false
        }

        const nextRange = calculateDateRange(dateRangeMode, nextDate)
        const today = new Date()
        return nextRange.start != null && nextRange.start <= today
      })()

      const canNavigate = baseCanNavigate

      return {
        isDateRangeModalOpen: state.isDateRangeModalOpen,
        dateRangeMode: state.dateRangeMode,
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
