import { useShallow } from 'zustand/shallow'
import { categoriesDateRangeStore } from './categories-date-range-store'
import {
  canNavigateBackward,
  canNavigateForward,
  formatDateRange
} from './utils'

// Basic state hook without capabilities (for performance when not needed)
export const useCategoriesDateRangeState = () => {
  return categoriesDateRangeStore(
    useShallow(state => ({
      isDateRangeModalOpen: state.isDateRangeModalOpen,
      dateRange: state.dateRange,
      failedNavigateNextCounter: state.failedNavigateNextCounter
    }))
  )
}

// Main hook that includes navigation capabilities and formatted display
export const useCategoriesDateRangeAdvancedState = () => {
  return categoriesDateRangeStore(
    useShallow(state => {
      return {
        ...state,
        formattedRange: formatDateRange(state.dateRange),
        canNavigateBackward: canNavigateBackward(state.dateRange),
        canNavigateForward: canNavigateForward(state.dateRange)
      }
    })
  )
}

export const useCategoriesDateRangeActions = () =>
  categoriesDateRangeStore(state => state.actions)
