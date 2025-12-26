/**
 * Currency metadata utilities using currency-codes and currency-symbol-map libraries
 * (Intl APIs are not fully supported in React Native/Hermes)
 */

import cc from 'currency-codes'
import getSymbol from 'currency-symbol-map'

/**
 * Get currency metadata for a given ISO 4217 currency code
 *
 * Note: ~15 currency codes don't have symbols in currency-symbol-map
 * (e.g., XAU, XAG, ZWG). Falls back to the currency code itself.
 */
export function getCurrencyInfo(code: string) {
  const currencyData = cc.code(code)

  if (!currencyData) return undefined

  return {
    ...currencyData,
    symbol: getSymbol(code) ?? code
  }
}

/**
 * Get all available currencies with their metadata and symbols
 */
export function getAllCurrencies() {
  return cc.codes().map(code => getCurrencyInfo(code)!)
}

/**
 * Get the multiplier for converting display amounts to smallest units
 * Based on currency's decimal places (digits): 10^digits
 *
 * Examples: USD (2 digits) = 100, JPY (0 digits) = 1, KWD (3 digits) = 1000
 */
function getCurrencyMultiplier(currencyCode: string): number {
  const info = getCurrencyInfo(currencyCode)
  if (!info) throw new Error('Currency not found') // should never happen

  return Math.pow(10, info.digits)
}

/**
 * Convert a display amount to the smallest currency unit (integer)
 * e.g., 10.50 USD -> 1050, 1000 JPY -> 1000, 10.500 KWD -> 10500
 */
export function toSmallestUnit(amount: number, currencyCode: string): number {
  const multiplier = getCurrencyMultiplier(currencyCode)
  return Math.round(amount * multiplier)
}

/**
 * Convert from smallest currency unit back to display amount
 * e.g., 1050 USD -> 10.50, 1000 JPY -> 1000, 10500 KWD -> 10.500
 */
export function fromSmallestUnit(amount: number, currencyCode: string): number {
  const multiplier = getCurrencyMultiplier(currencyCode)
  return amount / multiplier
}
