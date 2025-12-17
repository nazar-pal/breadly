/*
================================================================================
CURRENCIES SCHEMA - Multi-Currency Support System
================================================================================
Purpose: Manages supported currencies and exchange rates for the Breadly 
         financial management system. Supports multi-currency accounts,
         transactions, and automatic currency conversions.

Key Features:
- ISO 4217 currency code support (USD, EUR, etc.)
- Currency symbols and display names
- Historical exchange rate tracking
- Automatic currency conversion support
================================================================================
*/

import { sql } from 'drizzle-orm'
import { check, pgTable, varchar } from 'drizzle-orm/pg-core'

// ============================================================================
// Currencies table - ISO 4217 currency definitions
// ============================================================================

/**
 * Supported currencies in the system
 * Contains currency codes (USD, EUR, etc.), symbols, and display names
 *
 * Business Rules:
 * - Uses ISO 4217 standard currency codes
 * - Currency codes must be exactly 3 uppercase letters
 * - Currency codes are immutable once created
 * - All monetary amounts in the system reference these currencies
 */
export const currencies = pgTable(
  'currencies',
  {
    code: varchar({ length: 3 }).primaryKey(), // ISO currency code (USD, EUR)
    symbol: varchar({ length: 10 }).notNull(), // Display symbol ($, €)
    name: varchar({ length: 100 }).notNull() // Full name (US Dollar)
  },
  table => [
    // Business rule constraints
    check('currencies_code_format', sql`${table.code} ~ '^[A-Z]{3}$'`), // Currency codes must be exactly 3 uppercase letters
    check(
      'currencies_symbol_not_empty',
      sql`length(trim(${table.symbol})) > 0`
    ), // Symbol must be non-empty
    check('currencies_name_not_empty', sql`length(trim(${table.name})) > 0`) // Name must be non-empty
  ]
)
