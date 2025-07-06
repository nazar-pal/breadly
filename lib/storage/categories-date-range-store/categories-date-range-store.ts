import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import {
  INITIAL_DATE_RANGE_MODE,
  type AllTimeDateRange,
  type CategoriesDateRangeStore,
  type DateRange,
  type DateRangeMode,
  type PeriodDateRange
} from './types'
import {
  calculateTargetDate,
  canNavigateBackward,
  canNavigateForward,
  createPeriodDateRange
} from './utils'

export const categoriesDateRangeStore = create<CategoriesDateRangeStore>(
  (set, get) => ({
    // Initial state
    isDateRangeModalOpen: false,
    dateRange: createPeriodDateRange(INITIAL_DATE_RANGE_MODE, new Date()),
    failedNavigateNextCounter: 0,

    // Actions
    actions: {
      // Modal management
      openDateRangeModal: () => set({ isDateRangeModalOpen: true }),
      closeDateRangeModal: () => set({ isDateRangeModalOpen: false }),

      // Date range selection
      setDateRange: (dateRange: DateRange) => set({ dateRange }),
      setDateRangeMode: (mode: Exclude<DateRangeMode, 'custom'>) => {
        let dateRange: AllTimeDateRange | PeriodDateRange = {
          mode: 'alltime',
          start: null,
          end: null
        }
        if (mode !== 'alltime')
          dateRange = createPeriodDateRange(mode, new Date())

        set({ dateRange })
      },

      // Navigation
      navigatePrevious: () => {
        const { dateRange } = get()
        if (!canNavigateBackward(dateRange)) {
          set(state => ({
            failedNavigateNextCounter: state.failedNavigateNextCounter + 1
          }))
          return
        }

        const previousDate = calculateTargetDate(
          dateRange.start,
          dateRange.mode,
          'previous'
        )

        set({ dateRange: createPeriodDateRange(dateRange.mode, previousDate) })
      },

      navigateNext: () => {
        const { dateRange } = get()

        if (!canNavigateForward(dateRange)) {
          set(state => ({
            failedNavigateNextCounter: state.failedNavigateNextCounter + 1
          }))
          return
        }

        const nextDate = calculateTargetDate(
          dateRange.start,
          dateRange.mode,
          'next'
        )

        set({ dateRange: createPeriodDateRange(dateRange.mode, nextDate) })
      }
    }
  })
)

export const useCategoriesDateRangeState = () => {
  return categoriesDateRangeStore(
    useShallow(state => ({
      isDateRangeModalOpen: state.isDateRangeModalOpen,
      dateRange: state.dateRange,
      failedNavigateNextCounter: state.failedNavigateNextCounter
    }))
  )
}

export const useCategoriesDateRangeActions = () =>
  categoriesDateRangeStore(state => state.actions)
