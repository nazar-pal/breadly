import { isAfter, isValid, startOfDay } from 'date-fns'

export const validateCustomDateRange = (
  startDate: Date,
  endDate: Date
): { isValid: boolean; error?: string } => {
  if (!isValid(startDate) || !isValid(endDate))
    return { isValid: false, error: 'Invalid date provided' }

  if (isAfter(startDate, endDate))
    return { isValid: false, error: 'Start date must be before end date' }

  // Normalize both to start of day to avoid timezone issues where
  // 'YYYY-MM-DD' parses to midnight UTC and becomes > local start of today.
  const today = startOfDay(new Date())
  const startDay = startOfDay(startDate)
  const endDay = startOfDay(endDate)

  if (isAfter(startDay, today))
    return { isValid: false, error: 'Start date cannot be in the future' }

  if (isAfter(endDay, today))
    return { isValid: false, error: 'End date cannot be in the future' }

  return { isValid: true }
}
