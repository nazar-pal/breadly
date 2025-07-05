// Types for category data
export interface CategoryData {
  id: string
  name: string
  description: string | null
  icon: string
}

export type CategoriesState = {
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

  // Feedback State for unsuccessful navigation
  failedNavigateNextCounter: number
}

export type CategoriesActions = {
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

  // Combined Actions for common workflows
  handleCategoryPress: (categoryId: string) => void

  // Feedback Actions
  notifyFailedNavigateNext: () => void
}

export type CategoriesStore = CategoriesState & {
  actions: CategoriesActions
}

export type DateRangeMode =
  | 'day'
  | '7days'
  | 'week'
  | 'month'
  | '30days'
  | '365days'
  | 'year'
  | 'alltime'
  | 'custom'

export interface DateRange {
  start: Date
  end: Date
}

export interface DateRangeState {
  mode: DateRangeMode
  currentDate: Date
  dateRange: DateRange
  customRange?: DateRange
}
