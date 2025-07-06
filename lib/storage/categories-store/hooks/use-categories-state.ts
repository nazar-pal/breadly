import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'

// Hooks for consuming state
export const useCategoriesState = () => {
  return categoriesStore(
    useShallow(state => ({
      // Date Range State
      isDateRangeModalOpen: state.isDateRangeModalOpen,
      dateRange: state.dateRange,

      // Feedback
      failedNavigateNextCounter: state.failedNavigateNextCounter
    }))
  )
}
