import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'

// Hooks for consuming state
export const useCategoriesState = () => {
  return categoriesStore(
    useShallow(state => ({
      // Date Range State
      isDateRangeModalOpen: state.isDateRangeModalOpen,
      currentDate: state.currentDate,
      dateRange: state.dateRange,

      // Category UI State
      addTransactionSelectedCategory: state.addTransactionSelectedCategory,
      isAddTransactionModalOpen: state.isAddTransactionModalOpen,

      // Feedback
      failedNavigateNextCounter: state.failedNavigateNextCounter
    }))
  )
}
