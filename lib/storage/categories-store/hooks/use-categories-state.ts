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
      selectedCategory: state.selectedCategory,
      addTransactionModalVisible: state.addTransactionModalVisible,

      // Feedback
      failedNavigateNextCounter: state.failedNavigateNextCounter
    }))
  )
}
