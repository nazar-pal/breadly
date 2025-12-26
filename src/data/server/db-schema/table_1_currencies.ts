/*
================================================================================
CURRENCIES SCHEMA - Multi-Currency Support System
================================================================================
Purpose: Manages supported currencies and exchange rates for the Breadly 
         financial management system. Supports multi-currency accounts,
         transactions, and automatic currency conversions.

Key Features:
- ISO 4217 currency code support (USD, EUR, etc.)
- Currency metadata (symbols, names) provided by currency-codes and currency-symbol-map at runtime
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
 * Contains currency codes (USD, EUR, etc.) only
 * Currency symbols and names are provided by currency-codes and currency-symbol-map at runtime
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
    code: varchar({ length: 3 }).primaryKey() // ISO currency code (USD, EUR)
  },
  table => [
    // Business rule constraints
    check('currencies_code_format', sql`${table.code} ~ '^[A-Z]{3}$'`) // Currency codes must be exactly 3 uppercase letters
  ]
)
