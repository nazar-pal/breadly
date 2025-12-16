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

import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

// ============================================================================
// Currencies table - ISO 4217 currency definitions
// ============================================================================

/**
 * Supported currencies in the system
 * Contains currency codes (USD, EUR, etc.), symbols, and display names
 *
 * Business Rules:
 * - Uses ISO 4217 standard currency codes
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
  table => [uniqueIndex('currencies_code_unq').on(table.code)]
)
