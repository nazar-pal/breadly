/*
================================================================================
ACCOUNTS SCHEMA - User Financial Accounts Management
================================================================================
Purpose: Manages user financial accounts (bank accounts, credit cards, loans, etc.)
         Core entity for tracking money balances and account classifications.

Key Features:
- Multi-tenant account isolation per user
- Support for saving, payment, and debt account types
- Multi-currency account support
- Automatic balance tracking via database triggers
- Soft deletion with archive functionality
================================================================================
*/

import {
  index,
  integer,
  real,
  sqliteTable,
  text
} from 'drizzle-orm/sqlite-core'

import { currencies } from './table_1_currencies'
import {
  clerkUserIdColumn,
  createdAtColumn,
  descriptionColumn,
  isArchivedColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  nameColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// ACCOUNTS TABLE
// ============================================================================

/**
 * User financial accounts (bank accounts, credit cards, etc.)
 * Core entity for tracking money and balances
 *
 * Business Rules:
 * - Each account belongs to a single user (multi-tenant isolation)
 * - Account currency determines transaction currency validation
 * - Balance is automatically updated by database triggers
 * - Archived accounts are hidden but data is preserved
 * - Account names must be non-empty after trimming whitespace
 * - Type-specific fields are optional and depend on account type
 * - Account types: 'saving' | 'payment' | 'debt'
 */
export const accounts = sqliteTable(
  'accounts',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: text().notNull(), // Account classification ('saving' | 'payment' | 'debt')
    name: nameColumn(), // User-defined account name
    description: descriptionColumn(), // Optional user notes about the account
    currencyId: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .default('USD'), // Account base currency
    balance: monetaryAmountColumn().default(0), // Current balance (updated by triggers)

    // Type-specific fields for savings accounts
    savingsTargetAmount: real(), // Target savings goal (savings only)
    savingsTargetDate: integer({ mode: 'timestamp_ms' }), // Target date to reach savings goal (savings only)

    // Type-specific fields for debt accounts
    debtInitialAmount: real(), // Original debt amount (debt only)
    debtIsOwedToMe: integer({ mode: 'boolean' }), // True if someone owes you, false if you owe someone (debt only)
    debtDueDate: integer({ mode: 'timestamp_ms' }), // Due date for debt payment (debt only)

    isArchived: isArchivedColumn(), // Soft deletion flag
    createdAt: createdAtColumn()
  },
  table => [
    // Performance indexes for common query patterns
    index('accounts_user_idx').on(table.userId), // User's accounts lookup
    index('accounts_user_archived_idx').on(table.userId, table.isArchived), // Active accounts only
    index('accounts_user_type_idx').on(table.userId, table.type) // Accounts by type
  ]
)
