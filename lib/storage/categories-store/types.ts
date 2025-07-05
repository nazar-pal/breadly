export type CategoriesState = {
  // Date Range Modal State
  isDateRangeModalOpen: boolean

  // Date Range Navigation State
  currentDate: Date
  dateRange: DateRange

  // Category Selection State
  addTransactionSelectedCategory: string | null

  // Add Transaction Modal State
  isAddTransactionModalOpen: boolean

  // Feedback State for unsuccessful navigation
  failedNavigateNextCounter: number
}

export type CategoriesActions = {
  // Date Range Modal Actions
  openDateRangeModal: () => void
  closeDateRangeModal: () => void
  toggleDateRangeModal: () => void

  // Date Range Navigation Actions
  setDateRange: (dateRange: DateRange) => void
  setDateRangeMode: (mode: Exclude<DateRangeMode, 'custom'>) => void
  navigatePrevious: () => void
  navigateNext: () => void

  // Category Selection Actions
  selectCategory: (categoryId: string) => void
  clearSelectedCategory: () => void

  // Add Transaction Modal Actions
  openAddTransactionModal: (categoryId: string) => void
  closeAddTransactionModal: () => void

  // Feedback Actions
  notifyFailedNavigateNext: () => void
}

export type CategoriesStore = CategoriesState & {
  actions: CategoriesActions
}

export const dateRangeModes = [
  'day',
  'week',
  'month',
  'year',
  'alltime',
  'custom'
] as const

export type DateRangeMode = (typeof dateRangeModes)[number]

export type PeriodDateRange = {
  mode: Exclude<DateRangeMode, 'custom' | 'alltime'>
  start: Date
  end: Date
}

export type CustomDateRange = {
  mode: 'custom'
  start: Date
  end: Date
}

export type AllTimeDateRange = {
  mode: 'alltime'
  start: null
  end: null
}

export type DateRange = PeriodDateRange | CustomDateRange | AllTimeDateRange
