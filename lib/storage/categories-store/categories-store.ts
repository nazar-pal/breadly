import {
  CustomDateRange,
  DateRange,
  DateRangeMode
} from '@/lib/storage/categories-store/'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns'
import { create } from 'zustand'
import { CategoriesStore } from './types'
import { calculateDateRange } from './utils/calculate-date-range'

export const categoriesStore = create<CategoriesStore>((set, get) => {
  const initialDate = new Date()
  const initialMode: DateRangeMode = 'week'

  return {
    // State
    isDateRangeModalOpen: false,
    currentDate: initialDate,
    dateRange: calculateDateRange(initialMode, initialDate),
    addTransactionSelectedCategory: null,
    isAddTransactionModalOpen: false,
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

        let newDate = currentDate

        switch (dateRange.mode) {
          case 'day':
            newDate = subDays(currentDate, 1)
            break
          case 'week':
            newDate = subWeeks(currentDate, 1)
            break
          case 'month':
            newDate = subMonths(currentDate, 1)
            break
          case 'year':
            newDate = subYears(currentDate, 1)
            break
        }

        set({
          currentDate: newDate,
          dateRange: calculateDateRange(dateRange.mode, newDate)
        })
      },

      navigateNext: () => {
        const state = get()
        const { dateRange, currentDate } = state

        if (dateRange.mode === 'alltime' || dateRange.mode === 'custom') return

        let newDate = currentDate

        switch (dateRange.mode) {
          case 'day':
            newDate = addDays(currentDate, 1)
            break
          case 'week':
            newDate = addWeeks(currentDate, 1)
            break
          case 'month':
            newDate = addMonths(currentDate, 1)
            break
          case 'year':
            newDate = addYears(currentDate, 1)
            break
        }

        // Check if the new date range would extend into the future
        const newRange = calculateDateRange(dateRange.mode, newDate)
        const today = new Date()

        // Don't allow navigation if the new range start date is after today
        if (newRange.start > today) {
          return
        }

        set({
          currentDate: newDate,
          dateRange: newRange
        })
      },

      setCustomDateRange: (range: CustomDateRange) => set({ dateRange: range }),

      // Category Selection Actions
      setCategoryForTransaction: (categoryId: string) =>
        set({ addTransactionSelectedCategory: categoryId }),

      // Add Transaction Modal Actions
      openAddTransactionModal: (categoryId: string) =>
        set({
          addTransactionSelectedCategory: categoryId,
          isAddTransactionModalOpen: true
        }),
      closeAddTransactionModal: () =>
        set({
          isAddTransactionModalOpen: false,
          addTransactionSelectedCategory: null
        }),

      // Feedback Actions
      notifyFailedNavigateNext: () =>
        set(state => ({
          failedNavigateNextCounter: state.failedNavigateNextCounter + 1
        }))
    }
  }
})
