import { DateRange } from '../types'
import { calculateDateRange } from './calculate-date-range'
import { navigateDateByMode } from './date-navigation'

export const checkCanNavigateBackward = (dateRange: DateRange): boolean => {
  return dateRange.mode !== 'alltime' && dateRange.mode !== 'custom'
}

export const checkCanNavigateForward = (
  dateRange: DateRange,
  referenceDate: Date = new Date()
): boolean => {
  if (dateRange.mode === 'alltime' || dateRange.mode === 'custom') {
    return false
  }

  // For period date ranges, we can use the start date as the current date reference
  // since the start date represents the beginning of the current period
  const currentDate = dateRange.start
  const nextDate = navigateDateByMode(currentDate, dateRange.mode, 'next')
  const nextRange = calculateDateRange(dateRange.mode, nextDate)

  // Check if the next range starts at or before the reference date
  // This allows navigation to any period that has already started
  return nextRange.start != null && nextRange.start <= referenceDate
}
