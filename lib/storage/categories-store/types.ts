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
  | 'week'
  | 'month'
  | 'year'
  | 'alltime'
  | 'custom'

export interface DateRange {
  start: Date
  end: Date
}
