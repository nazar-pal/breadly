/**
 * Converts a Date to 'YYYY-MM-DD' string using LOCAL timezone.
 *
 * Use this helper instead of .toISOString() for date-only fields
 * to avoid timezone-related date shifts.
 *
 * @example
 * const txDate = transaction.txDate // Date at local midnight
 * const dateStr = toDateString(txDate) // '2024-12-25'
 *
 * // DON'T DO THIS - may shift the date!
 * // txDate.toISOString().split('T')[0]
 */
export const toDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parses a 'YYYY-MM-DD' string into a Date at midnight LOCAL time.
 *
 * @example
 * const date = parseDateString('2024-12-25')
 * // Returns: Date representing Dec 25, 2024 00:00:00 in local timezone
 */
export const parseDateString = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

/**
 * Creates a Date object for a date-only field from individual components.
 * Use this when programmatically creating dates (e.g., from date picker output).
 *
 * The Date is created at midnight LOCAL time, which ensures the calendar date
 * is preserved when converted back to a string.
 *
 * @param year - Full year (e.g., 2024)
 * @param month - 1-indexed month (1 = January, 12 = December)
 * @param day - Day of month (1-31)
 * @returns Date at midnight local time
 *
 * @example
 * // User selects December 25, 2024 from a date picker
 * const txDate = createLocalDate(2024, 12, 25)
 * // Result: Date representing Dec 25, 2024 00:00:00 in local timezone
 *
 * // For most other date operations, use date-fns:
 * import { startOfToday, addDays, isToday } from 'date-fns'
 * const today = startOfToday()
 * const tomorrow = addDays(startOfToday(), 1)
 * if (isToday(someDate)) { ... }
 */
export function createLocalDate(
  year: number,
  month: number,
  day: number
): Date {
  return new Date(year, month - 1, day)
}
