import { DEFAULT_CURRENCIES } from '@/lib/constants'
import { isoDateToDate, stringToNumber } from '@/lib/utils'
import { getCurrencyInfo } from '@/lib/utils/currency-info'
import { startOfDay } from 'date-fns'
import { z } from 'zod'

const trimStr = z.string().trim()

export const CURRENCY_CODES = DEFAULT_CURRENCIES.map(c => c.code) as [
  string,
  ...string[]
]
export const TRANSACTION_TYPES = ['expense', 'income'] as const

/**
 * Maximum transaction amount for CSV input validation
 *
 * IMPORTANT: CSV amounts must be provided in BASE UNITS (display units).
 * For example: 10.50 for USD (not 1050 cents), 1000 for JPY, 10.500 for KWD.
 * Amounts are automatically rounded to the currency's precision (e.g., 2 decimals for USD,
 * 0 for JPY, 3 for KWD) during validation, then converted to smallest units internally.
 *
 * This limit provides a reasonable upper bound for CSV input validation.
 */
const MAX_AMOUNT = 999_999_999_999.99

/**
 * Minimum allowed transaction date (reasonable lower bound)
 */
const MIN_DATE = new Date('1970-01-01')

/**
 * Rounds an amount to the precision dictated by the currency's decimal places
 * @param amount - Amount in base units
 * @param currencyCode - ISO 4217 currency code
 * @returns Amount rounded to currency precision (e.g., 2 decimals for USD, 0 for JPY, 3 for KWD)
 * @throws Error if currency is not supported
 */
function roundToCurrencyPrecision(
  amount: number,
  currencyCode: string
): number {
  const info = getCurrencyInfo(currencyCode)
  if (!info) {
    throw new Error(`Unsupported currency: ${currencyCode}`)
  }
  const multiplier = Math.pow(10, info.digits)
  return Math.round(amount * multiplier) / multiplier
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

    // Amount: required, positive, max value
    // Note: Rounding to currency precision happens in the final transform after currency is known
    amount: trimStr
      .min(1, 'Amount is required')
      .pipe(stringToNumber)
      .pipe(z.number().positive('Amount must be greater than 0'))
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
  .transform(({ date, category, amount, currency, ...rest }) => {
    // Round amount based on currency precision (e.g., 2 decimals for USD, 0 for JPY, 3 for KWD)
    const roundedAmount = roundToCurrencyPrecision(amount, currency)

    // Parse category string: "Parent => Child" or just "Category"
    const parts = category.split('=>').map(s => s.trim())

    // If more than 2 parts, it's invalid (we only support 1 level of nesting)
    if (parts.length > 2) {
      // Will be caught by the refine below
      return {
        ...rest,
        amount: roundedAmount,
        currency,
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
      amount: roundedAmount,
      currency,
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
