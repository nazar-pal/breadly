import { create } from 'zustand'
import type { CustomDateRange, DateRange, DateRangeMode } from './types'
import { CategoriesStore } from './types'
import { calculateDateRange } from './utils/calculate-date-range'
import { navigateDateByMode } from './utils/date-navigation'

export const categoriesStore = create<CategoriesStore>((set, get) => {
  const initialDate = new Date()
  const initialMode: DateRangeMode = 'week'

  return {
    // State
    isDateRangeModalOpen: false,
    dateRange: calculateDateRange(initialMode, initialDate),
    failedNavigateNextCounter: 0,

    // Actions
    actions: {
      // Date Range Modal Actions
      openDateRangeModal: () => set({ isDateRangeModalOpen: true }),
      closeDateRangeModal: () => set({ isDateRangeModalOpen: false }),

      // Date Range Navigation Actions
      setDateRange: (dateRange: DateRange) => {
        set({
          dateRange:
            dateRange.mode === 'custom'
              ? dateRange
              : dateRange.mode === 'alltime'
                ? { mode: 'alltime', start: null, end: null }
                : calculateDateRange(dateRange.mode, new Date())
        })
      },

      setDateRangeMode: (mode: Exclude<DateRangeMode, 'custom'>) => {
        if (mode === 'alltime') {
          set({
            dateRange: { mode: 'alltime', start: null, end: null }
          })
          return
        }

        set(state => {
          // For period date ranges, we can use the current start date as reference
          // or default to current date if it's a different mode
          const referenceDate =
            state.dateRange.mode !== 'alltime' &&
            state.dateRange.mode !== 'custom'
              ? state.dateRange.start
              : new Date()

          return {
            dateRange: calculateDateRange(mode, referenceDate)
          }
        })
      },

      navigatePrevious: () => {
        const state = get()
        const { dateRange } = state

        if (dateRange.mode === 'alltime' || dateRange.mode === 'custom') return

        const newDate = navigateDateByMode(
          dateRange.start,
          dateRange.mode,
          'previous'
        )

        set({
          dateRange: calculateDateRange(dateRange.mode, newDate)
        })
      },

      navigateNext: () => {
        const state = get()
        const { dateRange } = state

        if (dateRange.mode === 'alltime' || dateRange.mode === 'custom') return

        const newDate = navigateDateByMode(
          dateRange.start,
          dateRange.mode,
          'next'
        )

        // Check if the new date range would extend into the future
        const newRange = calculateDateRange(dateRange.mode, newDate)

        if (newRange.end > new Date()) {
          // Provide feedback to UI that forward navigation is not possible
          set(state => ({
            failedNavigateNextCounter: state.failedNavigateNextCounter + 1
          }))
          return
        }

        set({
          dateRange: newRange
        })
      },

      setCustomDateRange: (range: CustomDateRange) => set({ dateRange: range }),

      // Feedback Actions
      notifyFailedNavigateNext: () =>
        set(state => ({
          failedNavigateNextCounter: state.failedNavigateNextCounter + 1
        }))
    }
  }
})
