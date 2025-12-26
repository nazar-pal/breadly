import { codes } from 'currency-codes'

import { CurrencySelectSQLite } from '@/data/client/db-schema'

/**
 * All available ISO 4217 currency codes from the currency-codes library
 */
export const ALL_CURRENCY_CODES = codes()

/**
 * All currencies for database seeding
 * Only contains id and code (matching CurrencySelectSQLite schema)
 */
export const DEFAULT_CURRENCIES: CurrencySelectSQLite[] =
  ALL_CURRENCY_CODES.map(code => ({ id: code, code }))

export const DEFAULT_CURRENCY: CurrencySelectSQLite =
  DEFAULT_CURRENCIES.find(c => c.code === 'USD') ?? DEFAULT_CURRENCIES[0]
