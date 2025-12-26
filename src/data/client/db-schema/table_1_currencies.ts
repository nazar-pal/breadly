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

PowerSync Client Adaptations:
- Additional 'id' field: PowerSync requires primary key to be named 'id'
- PostgreSQL uses 'code' as PK, PowerSync sync rules alias it as 'id'
- Both fields exist in SQLite for compatibility and reference consistency

DUAL COLUMN DESIGN EXPLANATION:
─────────────────────────────────────────────────────
The client currencies table has both 'id' and 'code' columns due to PowerSync's
requirements and relationship compatibility:

1. PowerSync Requirement:
   - PowerSync sync rules require a primary key column named 'id'
   - The server uses 'code' as the primary key (ISO 4217 currency codes)
   - Sync rules alias 'code' as 'id' when syncing: `SELECT code as id, ...`

2. Relationship Compatibility:
   - Foreign key relationships (e.g., accounts.currency_id, transactions.currency_id)
     reference currencies.code on the server
   - Client relations must reference currencies.code (not currencies.id) to maintain
     consistency with server foreign key definitions
   - The 'id' column exists to satisfy PowerSync's primary key requirement
   - The 'code' column exists for relationship compatibility

3. Data Consistency:
   - Both columns contain the same value (the ISO currency code)
   - 'id' = 'code' for all rows (e.g., 'USD', 'EUR')
   - This dual-column approach ensures PowerSync compatibility while maintaining
     proper relational integrity with server-side foreign keys

Note: Relations in relations.ts reference currencies.code (not currencies.id) to
match server foreign key definitions.
================================================================================
*/

import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
 * - Currency codes are immutable once created
 * - All monetary amounts in the system reference these currencies
 *
 * Schema Notes:
 * - PostgreSQL: Primary key is 'code' (3-char ISO codes)
 * - SQLite: PowerSync adds 'id' field (aliased from 'code' in sync rules)
 * - Both 'id' and 'code' exist client-side for proper table relationships
 * - Relations reference currencies.code (not currencies.id) for consistency
 *   with server foreign key definitions
 */

const columns = {
  id: text().primaryKey(), // PowerSync-required primary key (aliased from 'code')
  code: text({ length: 3 }).notNull() // Original ISO currency code (USD, EUR)
}

export const currencies = sqliteTable('currencies', columns)

export const getCurrenciesSqliteTable = (name: string) =>
  sqliteTable(name, columns)
