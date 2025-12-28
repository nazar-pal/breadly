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
- Server-managed data (read-only from clients)

SERVER-MANAGED DATA:
─────────────────────────────────────────────────────
Exchange rates are populated and updated by server-side scheduled jobs.
Clients receive exchange rates via PowerSync's global bucket (read-only).

- Clients should NEVER attempt to create, update, or delete exchange rates
- Exchange rates are synced to all authenticated users via the global bucket
- Rate updates happen automatically on the server (typically daily/hourly)
- Historical rates are preserved for accurate reporting and conversions

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Foreign key references are NOT enforced
- Unique indexes are NOT enforced (uniqueness handled in application)
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)

Note: The id column is explicitly defined for Drizzle ORM type safety.
================================================================================
*/

import type { BuildColumns } from 'drizzle-orm/column-builder'
import { index, real, sqliteTable } from 'drizzle-orm/sqlite-core'
import { dateOnlyText, isoCurrencyCodeColumn, uuidPrimaryKey } from './utils'

// ============================================================================
// Exchange rates table - Historical currency conversion rates
// ============================================================================

/**
 * Exchange rates between currencies
 * Supports historical exchange rate tracking for accurate conversions
 *
 * Business Rules (enforced via Zod, not SQLite):
 * - Exchange rates are stored as base-to-quote currency pairs
 * - Each currency pair can have only one rate per date (enforced in app)
 * - Exchange rates must be positive values
 * - Base and quote currencies must be different
 *
 * Unique Constraint (server-enforced):
 * - exchange_rates_base_quote_date_unq: (baseCurrency, quoteCurrency, rateDate)
 * Note: Exchange rates are read-only from client (synced from server global bucket).
 */

const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  baseCurrency: isoCurrencyCodeColumn('base_currency').notNull(), // Base currency (FK not enforced)
  quoteCurrency: isoCurrencyCodeColumn('quote_currency').notNull(), // Quote currency (FK not enforced)
  rate: real().notNull(), // Exchange rate (base to quote conversion factor)
  rateDate: dateOnlyText('rate_date').notNull() // Date this rate was valid (YYYY-MM-DD, date-only)
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('exchange_rates_base_currency_idx').on(table.baseCurrency),
  index('exchange_rates_quote_currency_idx').on(table.quoteCurrency),
  index('exchange_rates_rate_date_idx').on(table.rateDate)
]

export const exchangeRates = sqliteTable('exchange_rates', columns, extraConfig)

export const getExchangeRatesSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)
