import { DateRange, DateRangeMode } from '@/lib/hooks/useDateRange'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

// Types for category data
export interface CategoryData {
  id: string
  name: string
  description: string | null
  icon: string
}

type CategoriesState = {
  // Date Range Modal State
  isDateRangeModalOpen: boolean

  // Date Range Navigation State
  dateRangeMode: DateRangeMode
  currentDate: Date
  dateRange: DateRange
  customDateRange: DateRange | null

  // Category Selection State
  selectedCategory: string | null

  // Add Transaction Modal State
  addTransactionModalVisible: boolean

  // Category Modal State (Add/Edit)
  categoryModalVisible: boolean
  categoryToEdit: CategoryData | null
}

type CategoriesActions = {
  // Date Range Modal Actions
  openDateRangeModal: () => void
  closeDateRangeModal: () => void
  toggleDateRangeModal: () => void

  // Date Range Navigation Actions
  setDateRangeMode: (mode: DateRangeMode, customRange?: DateRange) => void
  navigatePrevious: () => void
  navigateNext: () => void
  setCustomDateRange: (range: DateRange | null) => void

  // Category Selection Actions
  selectCategory: (categoryId: string) => void
  clearSelectedCategory: () => void

  // Add Transaction Modal Actions
  openAddTransactionModal: (categoryId: string) => void
  closeAddTransactionModal: () => void

  // Category Modal Actions (Add/Edit)
  openCategoryModal: (category?: CategoryData) => void
  closeCategoryModal: () => void

  // Combined Actions for common workflows
  handleCategoryPress: (categoryId: string) => void
  handleCategoryLongPress: (category: CategoryData) => void
  handleAddCategory: () => void
}

type CategoriesStore = CategoriesState & {
  actions: CategoriesActions
}

// Helper function to calculate date range based on mode and current date
const calculateDateRange = (
  mode: DateRangeMode,
  currentDate: Date,
  customRange?: DateRange | null
): DateRange => {
  switch (mode) {
    case 'day':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(currentDate)
      }

    case '7days':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(addDays(currentDate, 6))
      }

    case 'week':
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      }

    case 'month':
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      }

    case '30days':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(addDays(currentDate, 29))
      }

    case '365days':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(addDays(currentDate, 364))
      }

    case 'year':
      return {
        start: startOfYear(currentDate),
        end: endOfYear(currentDate)
      }

    case 'alltime':
      return {
        start: new Date(2020, 0, 1), // Arbitrary start date
        end: new Date()
      }

    case 'custom':
      return (
        customRange || {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        }
      )

    default:
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      }
  }
}

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
    categoryModalVisible: false,
    categoryToEdit: null,

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

      // Category Modal Actions (Add/Edit)
      openCategoryModal: (category?: CategoryData) =>
        set({
          categoryModalVisible: true,
          categoryToEdit: category || null
        }),
      closeCategoryModal: () =>
        set({
          categoryModalVisible: false,
          categoryToEdit: null
        }),

      // Combined Actions for common workflows
      handleCategoryPress: (categoryId: string) => {
        const { actions } = get()
        actions.openAddTransactionModal(categoryId)
      },

      handleCategoryLongPress: (category: CategoryData) => {
        const { actions } = get()
        actions.openCategoryModal(category)
      },

      handleAddCategory: () => {
        const { actions } = get()
        actions.openCategoryModal()
      }
    }
  }
})

// Hooks for consuming state
export const useCategoriesState = () => {
  return categoriesStore(
    useShallow(state => ({
      // Date Range State
      isDateRangeModalOpen: state.isDateRangeModalOpen,
      dateRangeMode: state.dateRangeMode,
      currentDate: state.currentDate,
      dateRange: state.dateRange,
      customDateRange: state.customDateRange,

      // Category UI State
      selectedCategory: state.selectedCategory,
      addTransactionModalVisible: state.addTransactionModalVisible,
      categoryModalVisible: state.categoryModalVisible,
      categoryToEdit: state.categoryToEdit
    }))
  )
}

export const useCategoriesActions = () =>
  categoriesStore(state => state.actions)

// Enhanced date range hook with computed values
export const useDateRangeState = () => {
  return categoriesStore(
    useShallow(state => {
      const { start, end } = state.dateRange

      // Format date range for display
      const formattedRange = (() => {
        if (state.dateRangeMode === 'alltime') {
          return 'All Time'
        }

        if (state.dateRangeMode === 'day') {
          return format(start, 'MMM d, yyyy')
        }

        if (start.getFullYear() === end.getFullYear()) {
          if (start.getMonth() === end.getMonth()) {
            return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`
          }
          return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
        }

        return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
      })()

      // Check if navigation is enabled
      const baseCanNavigate =
        state.dateRangeMode !== 'alltime' && state.dateRangeMode !== 'custom'

      // Also check if we can navigate forward without going into the future
      const canNavigateForward = (() => {
        if (!baseCanNavigate) return false

        const { dateRangeMode, currentDate, customDateRange } = state
        let nextDate = currentDate

        switch (dateRangeMode) {
          case 'day':
            nextDate = addDays(currentDate, 1)
            break
          case '7days':
            nextDate = addDays(currentDate, 7)
            break
          case 'week':
            nextDate = addWeeks(currentDate, 1)
            break
          case 'month':
            nextDate = addMonths(currentDate, 1)
            break
          case '30days':
            nextDate = addDays(currentDate, 30)
            break
          case '365days':
            nextDate = addDays(currentDate, 365)
            break
          case 'year':
            nextDate = addYears(currentDate, 1)
            break
          default:
            return false
        }

        const nextRange = calculateDateRange(
          dateRangeMode,
          nextDate,
          customDateRange
        )
        const today = new Date()
        return nextRange.start <= today
      })()

      const canNavigate = baseCanNavigate

      // Get mode display name
      const getModeDisplayName = (mode: DateRangeMode): string => {
        const modeNames: Record<DateRangeMode, string> = {
          day: 'Day',
          '7days': '7 Days',
          week: 'Week',
          month: 'Month',
          '30days': '30 Days',
          '365days': '365 Days',
          year: 'Year',
          alltime: 'All Time',
          custom: 'Custom Range'
        }
        return modeNames[mode]
      }

      return {
        isDateRangeModalOpen: state.isDateRangeModalOpen,
        dateRangeMode: state.dateRangeMode,
        currentDate: state.currentDate,
        dateRange: state.dateRange,
        customDateRange: state.customDateRange,
        formattedRange,
        canNavigate,
        canNavigateForward,
        getModeDisplayName
      }
    })
  )
}

export const useCategoryModalState = () => {
  return categoriesStore(
    useShallow(state => ({
      categoryModalVisible: state.categoryModalVisible,
      categoryToEdit: state.categoryToEdit
    }))
  )
}

export const useTransactionModalState = () => {
  return categoriesStore(
    useShallow(state => ({
      addTransactionModalVisible: state.addTransactionModalVisible,
      selectedCategory: state.selectedCategory
    }))
  )
}
