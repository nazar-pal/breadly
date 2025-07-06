import { isAfter, isValid, startOfDay } from 'date-fns'

export const validateCustomDateRange = (
  startDate: Date,
  endDate: Date
): { isValid: boolean; error?: string } => {
  if (!isValid(startDate) || !isValid(endDate))
    return { isValid: false, error: 'Invalid date provided' }

  if (isAfter(startDate, endDate))
    return { isValid: false, error: 'Start date must be before end date' }

  const today = startOfDay(new Date())
  if (isAfter(startDate, today))
    return { isValid: false, error: 'Start date cannot be in the future' }

  return { isValid: true }
}
