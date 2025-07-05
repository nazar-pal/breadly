import { DateRange, DateRangeMode } from '@/lib/storage/categories-store/'
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
    dateRangeMode: initialMode,
    currentDate: initialDate,
    dateRange: calculateDateRange(initialMode, initialDate),
    customDateRange: null,
    selectedCategory: null,
    addTransactionModalVisible: false,
    failedNavigateNextCounter: 0,

    // Actions
    actions: {
      // Date Range Modal Actions
      openDateRangeModal: () => set({ isDateRangeModalOpen: true }),
      closeDateRangeModal: () => set({ isDateRangeModalOpen: false }),
      toggleDateRangeModal: () =>
        set(state => ({ isDateRangeModalOpen: !state.isDateRangeModalOpen })),

      // Date Range Navigation Actions
      setDateRangeMode: (mode: DateRangeMode, customRange?: DateRange) => {
        const newCurrentDate =
          mode === 'custom' && customRange ? customRange.start : new Date()

        set({
          dateRangeMode: mode,
          currentDate: newCurrentDate,
          customDateRange: customRange || null,
          dateRange: calculateDateRange(mode, newCurrentDate, customRange)
        })
      },

      navigatePrevious: () => {
        const state = get()
        const { dateRangeMode, currentDate, customDateRange } = state

        if (dateRangeMode === 'alltime' || dateRangeMode === 'custom') return

        let newDate = currentDate

        switch (dateRangeMode) {
          case 'day':
            newDate = subDays(currentDate, 1)
            break
          case '7days':
            newDate = subDays(currentDate, 7)
            break
          case 'week':
            newDate = subWeeks(currentDate, 1)
            break
          case 'month':
            newDate = subMonths(currentDate, 1)
            break
          case '30days':
            newDate = subDays(currentDate, 30)
            break
          case '365days':
            newDate = subDays(currentDate, 365)
            break
          case 'year':
            newDate = subYears(currentDate, 1)
            break
        }

        set({
          currentDate: newDate,
          dateRange: calculateDateRange(dateRangeMode, newDate, customDateRange)
        })
      },

      navigateNext: () => {
        const state = get()
        const { dateRangeMode, currentDate, customDateRange } = state

        if (dateRangeMode === 'alltime' || dateRangeMode === 'custom') return

        let newDate = currentDate

        switch (dateRangeMode) {
          case 'day':
            newDate = addDays(currentDate, 1)
            break
          case '7days':
            newDate = addDays(currentDate, 7)
            break
          case 'week':
            newDate = addWeeks(currentDate, 1)
            break
          case 'month':
            newDate = addMonths(currentDate, 1)
            break
          case '30days':
            newDate = addDays(currentDate, 30)
            break
          case '365days':
            newDate = addDays(currentDate, 365)
            break
          case 'year':
            newDate = addYears(currentDate, 1)
            break
        }

        // Check if the new date range would extend into the future
        const newRange = calculateDateRange(
          dateRangeMode,
          newDate,
          customDateRange
        )
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

      setCustomDateRange: (range: DateRange | null) =>
        set({ customDateRange: range }),

      // Category Selection Actions
      selectCategory: (categoryId: string) =>
        set({ selectedCategory: categoryId }),
      clearSelectedCategory: () => set({ selectedCategory: null }),

      // Add Transaction Modal Actions
      openAddTransactionModal: (categoryId: string) =>
        set({
          selectedCategory: categoryId,
          addTransactionModalVisible: true
        }),
      closeAddTransactionModal: () =>
        set({
          addTransactionModalVisible: false,
          selectedCategory: null
        }),

      // Combined Actions for common workflows
      handleCategoryPress: (categoryId: string) => {
        const { actions } = get()
        actions.openAddTransactionModal(categoryId)
      },

      // Feedback Actions
      notifyFailedNavigateNext: () =>
        set(state => ({
          failedNavigateNextCounter: state.failedNavigateNextCounter + 1
        }))
    }
  }
})
