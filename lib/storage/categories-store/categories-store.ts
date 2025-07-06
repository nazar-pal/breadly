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
    currentDate: initialDate,
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
          currentDate: new Date(),
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
          return {
            dateRange: calculateDateRange(mode, state.currentDate)
          }
        })
      },

      navigatePrevious: () => {
        const state = get()
        const { dateRange, currentDate } = state

        if (dateRange.mode === 'alltime' || dateRange.mode === 'custom') return

        const newDate = navigateDateByMode(
          currentDate,
          dateRange.mode,
          'previous'
        )

        set({
          currentDate: newDate,
          dateRange: calculateDateRange(dateRange.mode, newDate)
        })
      },

      navigateNext: () => {
        const state = get()
        const { dateRange, currentDate } = state

        if (dateRange.mode === 'alltime' || dateRange.mode === 'custom') return

        const newDate = navigateDateByMode(currentDate, dateRange.mode, 'next')

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
          currentDate: newDate,
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
