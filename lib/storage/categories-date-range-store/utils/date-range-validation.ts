import { isAfter, isValid, startOfDay } from 'date-fns'
import type { CustomDateRange, DateRange } from '../types'

export const validateCustomDateRange = (
  startDate: Date,
  endDate: Date
): { isValid: boolean; error?: string } => {
  // Check if dates are valid
  if (!isValid(startDate) || !isValid(endDate)) {
    return { isValid: false, error: 'Invalid date provided' }
  }

  // Check if start date is before end date
  if (isAfter(startDate, endDate)) {
    return { isValid: false, error: 'Start date must be before end date' }
  }

  // Check if dates are not in the future
  const today = startOfDay(new Date())
  if (isAfter(startDate, today)) {
    return { isValid: false, error: 'Start date cannot be in the future' }
  }

  return { isValid: true }
}

export const createValidatedCustomDateRange = (
  startDate: Date,
  endDate: Date
): CustomDateRange => {
  const validation = validateCustomDateRange(startDate, endDate)

  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  return {
    mode: 'custom',
    start: startOfDay(startDate),
    end: startOfDay(endDate)
  }
}

export const isDateRangeInFuture = (dateRange: DateRange): boolean => {
  if (dateRange.mode === 'alltime' || !dateRange.start) {
    return false
  }

  const today = startOfDay(new Date())
  return isAfter(dateRange.start, today)
}
