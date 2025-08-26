import type { DateRange, PeriodDateRange } from '../types'
import { createPeriodDateRange } from './calculate-date-range'
import { calculateTargetDate } from './calculate-target-date'
import { isPeriodDateRange } from './check-date-range-mode'

export const canNavigateBackward = (
  dateRange: DateRange
): dateRange is PeriodDateRange => {
  return isPeriodDateRange(dateRange)
}

export const canNavigateForward = (
  dateRange: DateRange,
  referenceDate: Date = new Date()
): dateRange is PeriodDateRange => {
  if (!isPeriodDateRange(dateRange)) return false

  // Calculate the next date range
  const nextDate = calculateTargetDate(dateRange.start, dateRange.mode, 'next')
  const nextRange = createPeriodDateRange(dateRange.mode, nextDate)

  // Check if the next range starts at or before the reference date
  return nextRange.start <= referenceDate
}
