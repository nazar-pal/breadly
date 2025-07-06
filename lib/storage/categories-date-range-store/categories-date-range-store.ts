import { create } from 'zustand'
import {
  INITIAL_DATE_RANGE_MODE,
  type AllTimeDateRange,
  type CategoriesDateRangeStore,
  type CustomDateRange,
  type DateRange,
  type DateRangeMode,
  type PeriodDateRange
} from './types'
import {
  canNavigateForward,
  createPeriodDateRange,
  createValidatedCustomDateRange,
  isPeriodDateRange,
  navigateDate
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
      setDateRange: (dateRange: DateRange) => {
        set({ dateRange })
      },

      setDateRangeMode: (mode: Exclude<DateRangeMode, 'custom'>) => {
        let newDateRange: AllTimeDateRange | PeriodDateRange = {
          mode: 'alltime',
          start: null,
          end: null
        }
        if (mode !== 'alltime')
          newDateRange = createPeriodDateRange(mode, new Date())

        set({ dateRange: newDateRange })
      },

      setCustomDateRange: (range: CustomDateRange) => {
        // Validate the custom range before setting
        try {
          const validatedRange = createValidatedCustomDateRange(
            range.start,
            range.end
          )
          set({ dateRange: validatedRange })
        } catch (error) {
          // In a real app, you might want to handle this error differently
          console.error('Invalid custom date range:', error)
        }
      },

      // Navigation
      navigatePrevious: () => {
        const state = get()
        const { dateRange } = state

        if (!isPeriodDateRange(dateRange)) return

        const previousDate = navigateDate(
          dateRange.start,
          dateRange.mode,
          'previous'
        )
        const newDateRange = createPeriodDateRange(dateRange.mode, previousDate)

        set({ dateRange: newDateRange })
      },

      navigateNext: () => {
        const state = get()
        const { dateRange } = state

        if (!isPeriodDateRange(dateRange)) return

        const nextDate = navigateDate(dateRange.start, dateRange.mode, 'next')
        const newDateRange = createPeriodDateRange(dateRange.mode, nextDate)

        // Check if navigation is allowed
        if (!canNavigateForward(newDateRange)) {
          set(state => ({
            failedNavigateNextCounter: state.failedNavigateNextCounter + 1
          }))
          return
        }

        set({ dateRange: newDateRange })
      },

      // UI feedback
      notifyFailedNavigateNext: () => {
        set(state => ({
          failedNavigateNextCounter: state.failedNavigateNextCounter + 1
        }))
      }
    }
  })
)
