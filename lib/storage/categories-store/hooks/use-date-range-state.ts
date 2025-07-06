import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'
import { formatDateRange } from '../utils/date-range-formatting'
import {
  checkCanNavigateBackward,
  checkCanNavigateForward
} from '../utils/navigation-capabilities'

export const useDateRangeState = () => {
  return categoriesStore(
    useShallow(state => {
      const { dateRange } = state

      // Format date range for display
      const formattedRange = formatDateRange(dateRange)

      const canNavigateBackward = checkCanNavigateBackward(dateRange)
      const canNavigateForward = checkCanNavigateForward(
        state.currentDate,
        dateRange
      )

      return {
        isDateRangeModalOpen: state.isDateRangeModalOpen,
        currentDate: state.currentDate,
        dateRange: state.dateRange,
        formattedRange,
        canNavigateBackward,
        canNavigateForward,
        failedNavigateNextCounter: state.failedNavigateNextCounter
      }
    })
  )
}
