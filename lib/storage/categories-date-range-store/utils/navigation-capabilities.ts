import type { DateRange } from '../types'
import { createPeriodDateRange } from './calculate-date-range'
import { isPeriodDateRange } from './check-mode'
import { navigateDate } from './date-navigation'

export const canNavigateBackward = (dateRange: DateRange): boolean => {
  return isPeriodDateRange(dateRange)
}

export const canNavigateForward = (
  dateRange: DateRange,
  referenceDate: Date = new Date()
): boolean => {
  if (!isPeriodDateRange(dateRange)) {
    return false
  }

  // Calculate the next date range
  const nextDate = navigateDate(dateRange.start, dateRange.mode, 'next')
  const nextRange = createPeriodDateRange(dateRange.mode, nextDate)

  // Check if the next range starts at or before the reference date
  return nextRange.start <= referenceDate
}
