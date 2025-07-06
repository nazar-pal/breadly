import { DateRange } from '../types'
import { calculateDateRange } from './calculate-date-range'
import { navigateDateByMode } from './date-navigation'

export const checkCanNavigateBackward = (dateRange: DateRange): boolean => {
  return dateRange.mode !== 'alltime' && dateRange.mode !== 'custom'
}

export const checkCanNavigateForward = (
  currentDate: Date,
  dateRange: DateRange,
  referenceDate: Date = new Date()
): boolean => {
  if (dateRange.mode === 'alltime' || dateRange.mode === 'custom') {
    return false
  }

  const nextDate = navigateDateByMode(currentDate, dateRange.mode, 'next')
  const nextRange = calculateDateRange(dateRange.mode, nextDate)

  return nextRange.start != null && nextRange.start <= referenceDate
}
