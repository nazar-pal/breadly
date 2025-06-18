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

import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
export const currencies = sqliteTable('currencies', {
  code: text({ length: 3 }).primaryKey(), // ISO currency code (USD, EUR)
  symbol: text({ length: 10 }).notNull(), // Display symbol ($, €)
  name: text({ length: 100 }).notNull() // Full name (US Dollar)
})
