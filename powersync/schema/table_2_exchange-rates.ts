/*
================================================================================
EXCHANGE RATES SCHEMA - Currency Conversion Support
================================================================================
Purpose: Manages historical exchange rates between currencies for accurate
         multi-currency conversions and financial reporting in different
         currencies.

Key Features:
- Historical exchange rate tracking
- Base-to-quote currency pair relationships
- Date-specific rate validation
- Automatic currency conversion support
- Business rule enforcement for rate integrity
================================================================================
*/

import {
  index,
  integer,
  real,
  sqliteTable,
  uniqueIndex
} from 'drizzle-orm/sqlite-core'
import { currencies } from './table_1_currencies'
import { isoCurrencyCodeColumn, uuidPrimaryKey } from './utils'

// ============================================================================
// Exchange rates table - Historical currency conversion rates
// ============================================================================

/**
 * Exchange rates between currencies
 * Supports historical exchange rate tracking for accurate conversions
 *
 * Business Rules:
 * - Exchange rates are stored as base-to-quote currency pairs
 * - Each currency pair can have only one rate per date
 * - Exchange rates must be positive values
 * - Base and quote currencies must be different
 * - Supports historical rate lookups for accurate reporting
 * - Rates should be updated regularly for current conversions
 */
export const exchangeRates = sqliteTable(
  'exchange_rates',
  {
    id: uuidPrimaryKey(),
    baseCurrency: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .notNull(), // Base currency (e.g., USD in USD/EUR)
    quoteCurrency: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .notNull(), // Quote currency (e.g., EUR in USD/EUR)
    rate: real().notNull(), // Exchange rate (base to quote conversion factor)
    rateDate: integer({ mode: 'timestamp_ms' }).notNull() // Date this rate was valid (for historical tracking)
  },
  table => [
    // One rate per currency pair per date
    uniqueIndex('exchange_rates_base_quote_date_unq').on(
      table.baseCurrency,
      table.quoteCurrency,
      table.rateDate
    ),

    // Performance indexes for currency conversion lookups
    index('exchange_rates_base_currency_idx').on(table.baseCurrency), // Base currency lookups
    index('exchange_rates_quote_currency_idx').on(table.quoteCurrency) // Quote currency lookups
  ]
)
