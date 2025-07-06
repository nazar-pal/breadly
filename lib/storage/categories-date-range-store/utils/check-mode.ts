import type {
  AllTimeDateRange,
  CustomDateRange,
  DateRange,
  PeriodDateRange
} from '../types'

// Type guards for better type safety
export const isCustomDateRange = (range: DateRange): range is CustomDateRange =>
  range.mode === 'custom'

export const isAllTimeDateRange = (
  range: DateRange
): range is AllTimeDateRange => range.mode === 'alltime'

export const isPeriodDateRange = (range: DateRange): range is PeriodDateRange =>
  range.mode !== 'custom' && range.mode !== 'alltime'
