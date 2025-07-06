export type CategoriesDateRangeStoreState = {
  // Modal state
  isDateRangeModalOpen: boolean

  // Current date range selection
  dateRange: DateRange

  // UI feedback for failed navigation attempts
  failedNavigateNextCounter: number
}

export type CategoriesDateRangeStoreActions = {
  // Modal management
  openDateRangeModal: () => void
  closeDateRangeModal: () => void

  // Date range selection
  setDateRange: (dateRange: DateRange) => void
  setDateRangeMode: (mode: Exclude<DateRangeMode, 'custom'>) => void

  // Navigation
  navigatePrevious: () => void
  navigateNext: () => void

  // UI feedback
  notifyFailedNavigateNext: () => void
}

export type CategoriesDateRangeStore = CategoriesDateRangeStoreState & {
  actions: CategoriesDateRangeStoreActions
}

export const DATE_RANGE_MODES = [
  'day',
  'week',
  'month',
  'year',
  'alltime',
  'custom'
] as const

export type DateRangeMode = (typeof DATE_RANGE_MODES)[number]

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

export const INITIAL_DATE_RANGE_MODE: PeriodDateRange['mode'] = 'month'
