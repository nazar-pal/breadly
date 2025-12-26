import { fromSmallestUnit, getCurrencyInfo } from './currency-info'

export type FormatCurrencyOptions = {
  /**
   * The unit of the input amount:
   * - 'smallest': Amount in smallest currency unit (e.g., cents for USD). Default.
   * - 'base': Amount in base/display units (e.g., 10.50 for USD)
   */
  unit?: 'smallest' | 'base'
  /**
   * Whether to show trailing zeros (e.g., $10.00 instead of $10).
   * Defaults to false (trailing zeros are hidden for cleaner display).
   */
  showTrailingZeros?: boolean
}

/**
 * Formats a currency amount as a display string with symbol and thousand separators.
 * Handles both positive and negative values.
 *
 * @param amount - The amount to format
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR', 'JPY')
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., '$1,234.56', '-¥1,000')
 *
 * @example
 * // Amount in smallest units (default)
 * formatCurrency(1050, 'USD') // '$10.5'
 * formatCurrency(1050, 'USD', { showTrailingZeros: true }) // '$10.50'
 *
 * // Amount in base units
 * formatCurrency(10.50, 'USD', { unit: 'base' }) // '$10.5'
 * formatCurrency(10.50, 'USD', { unit: 'base', showTrailingZeros: true }) // '$10.50'
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  options: FormatCurrencyOptions = {}
): string {
  const { unit = 'smallest', showTrailingZeros = false } = options

  const info = getCurrencyInfo(currencyCode)
  if (!info) throw new Error(`Unsupported currency: ${currencyCode}`)
  const { digits, symbol } = info

  const isNegative = amount < 0
  const absoluteAmount = Math.abs(amount)

  // Convert to display amount if in smallest units
  const displayAmount =
    unit === 'smallest'
      ? fromSmallestUnit(absoluteAmount, currencyCode)
      : absoluteAmount

  // Format number with proper decimal places and thousand separators
  const formatted = displayAmount.toLocaleString('en-US', {
    minimumFractionDigits: showTrailingZeros ? digits : 0,
    maximumFractionDigits: digits
  })

  const sign = isNegative ? '-' : ''
  return `${sign}${symbol}${formatted}`
}
