import { DEFAULT_CURRENCIES } from '@/lib/constants'
import { isoDateToDate, stringToNumber } from '@/lib/utils'
import { startOfDay } from 'date-fns'
import { z } from 'zod'

const trimStr = z.string().trim()

export const CURRENCY_CODES = DEFAULT_CURRENCIES.map(c => c.code) as [
  string,
  ...string[]
]
export const TRANSACTION_TYPES = ['expense', 'income'] as const

/**
 * Maximum transaction amount (matches NUMERIC(14,2) database constraint)
 * 14 total digits with 2 decimal places = 999,999,999,999.99
 */
const MAX_AMOUNT = 999_999_999_999.99

/**
 * Minimum allowed transaction date (reasonable lower bound)
 */
const MIN_DATE = new Date('1970-01-01')

/**
 * Rounds a number to 2 decimal places (standard currency precision)
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}

export const csvRowSchema = z
  .object({
    // Date: required, valid ISO date (YYYY-MM-DD), cannot be in the future or too far in the past
    date: trimStr
      .min(1, 'Date is required')
      .pipe(isoDateToDate)
      .refine(
        date => date >= MIN_DATE,
        'Transaction date is too far in the past'
      )
      .refine(
        date => startOfDay(date) <= startOfDay(new Date()),
        'Transaction date cannot be in the future'
      ),

    // Amount: required, positive, max value, auto-rounded to 2 decimals
    amount: trimStr
      .min(1, 'Amount is required')
      .pipe(stringToNumber)
      .pipe(z.number().positive('Amount must be greater than 0'))
      .transform(roundToTwoDecimals)
      .pipe(
        z
          .number()
          .max(
            MAX_AMOUNT,
            `Amount cannot exceed ${MAX_AMOUNT.toLocaleString()}`
          )
      ),

    // Category: required (format: "Category" or "Parent => Child")
    // Max 202 chars to allow "Parent (100) => Child (100)" with separator
    category: trimStr
      .min(1, 'Category is required')
      .max(202, 'Category path is too long'),

    // Type: expense or income only (no transfers for import)
    type: trimStr.toLowerCase().pipe(z.enum(TRANSACTION_TYPES)),

    // Currency: must be a supported currency code
    currency: trimStr.toUpperCase().pipe(z.enum(CURRENCY_CODES))
  })
  .transform(({ date, category, ...rest }) => {
    // Parse category string: "Parent => Child" or just "Category"
    const parts = category.split('=>').map(s => s.trim())

    // If more than 2 parts, it's invalid (we only support 1 level of nesting)
    if (parts.length > 2) {
      // Will be caught by the refine below
      return {
        ...rest,
        createdAt: date,
        categoryName: category, // Keep full string for error message
        parentCategoryName: undefined,
        _invalidCategoryNesting: true
      }
    }

    const [parentCategoryName, categoryName] =
      parts.length === 2 ? [parts[0], parts[1]] : [undefined, parts[0]]

    return {
      ...rest,
      createdAt: date,
      categoryName,
      parentCategoryName,
      _invalidCategoryNesting: false
    }
  })
  // Validate category nesting depth
  .refine(data => !data._invalidCategoryNesting, {
    message:
      'Category can only have one level of nesting (format: "Parent => Child" or "Category")',
    path: ['category']
  })
  // Category name is required and must be 3-100 chars
  .refine(
    data =>
      data.categoryName &&
      data.categoryName.length >= 3 &&
      data.categoryName.length <= 100,
    {
      message: 'Category name must be between 3 and 100 characters',
      path: ['category']
    }
  )
  // Parent category name (if present) must be 3-100 chars
  .refine(
    data =>
      !data.parentCategoryName ||
      (data.parentCategoryName.length >= 3 &&
        data.parentCategoryName.length <= 100),
    {
      message: 'Parent category name must be between 3 and 100 characters',
      path: ['category']
    }
  )
  // Remove internal flag from output type
  .transform(({ _invalidCategoryNesting, ...rest }) => rest)

export type CsvRow = z.infer<typeof csvRowSchema>
