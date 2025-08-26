/**
 * Formats a number as currency with proper display
 * @param amount - The amount to format
 * @param currency - Currency code (defaults to USD)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

/**
 * Formats a number as currency with sign prefix
 * @param amount - The amount to format
 * @param currency - Currency code (defaults to USD)
 * @returns Formatted currency string with sign
 */
export function formatCurrencyWithSign(
  amount: number,
  currency: string = 'USD'
): string {
  const formatted = formatCurrency(amount, currency)
  return amount < 0 ? `-${formatted}` : formatted
}
