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
