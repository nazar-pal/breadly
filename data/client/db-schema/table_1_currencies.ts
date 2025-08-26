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

PowerSync Client Adaptations:
- Additional 'id' field: PowerSync requires primary key to be named 'id'
- PostgreSQL uses 'code' as PK, PowerSync sync rules alias it as 'id'
- Both fields exist in SQLite for compatibility and reference consistency
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
 *
 * Schema Notes:
 * - PostgreSQL: Primary key is 'code' (3-char ISO codes)
 * - SQLite: PowerSync adds 'id' field (aliased from 'code' in sync rules)
 * - Both 'id' and 'code' exist client-side for proper table relationships
 */
export const currencies = sqliteTable('currencies', {
  id: text().primaryKey(), // PowerSync-required primary key (aliased from 'code')
  code: text({ length: 3 }).notNull(), // Original ISO currency code (USD, EUR)
  symbol: text({ length: 10 }).notNull(), // Display symbol ($, €)
  name: text({ length: 100 }).notNull() // Full name (US Dollar)
})
