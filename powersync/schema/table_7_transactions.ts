/*
================================================================================
TRANSACTIONS SCHEMA - Core Financial Records Management
================================================================================
Purpose: Manages all financial transactions (income, expenses, transfers) in the
         Breadly system. Central entity tracking all money movements with support
         for multi-currency operations and automatic balance updates.

Key Features:
- Income, expense, and transfer transaction types
- Multi-currency transaction support with validation
- Account-to-account transfers with dual-account tracking
- Category-based transaction classification
- Automatic account balance updates via database triggers
- Comprehensive business rule validation
- Multi-tenant isolation
================================================================================
*/

import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { currencies } from './table_1_currencies'
import { categories } from './table_4_categories'
import { accounts } from './table_6_accounts'
import {
  clerkUserIdColumn,
  createdAtColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// TRANSACTIONS TABLE
// ============================================================================

/**
 * Financial transactions (income, expenses, transfers)
 * Central entity tracking all money movements in the system
 *
 * Business Rules:
 * - All transactions belong to a specific user (multi-tenant isolation)
 * - Transaction currency must match the account's currency
 * - Transfer transactions require both accountId and counterAccountId
 * - Transfer accounts must be different and belong to the same user
 * - Non-transfer transactions must not have a counterAccountId
 * - Transaction amounts must be positive (direction determined by type)
 * - Transaction dates cannot be in the future
 * - Account balances are automatically updated by database triggers
 * - Transaction types: 'expense' | 'income' | 'transfer'
 */
export const transactions = sqliteTable(
  'transactions',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: text().notNull(), // Transaction type ('expense' | 'income' | 'transfer')

    // Account references
    accountId: text()
      .references(() => accounts.id, { onDelete: 'cascade' })
      .notNull(), // Primary account (source for expense/transfer, destination for income)
    counterAccountId: text().references(() => accounts.id), // Transfer destination account (transfers only)

    // Classification and details
    categoryId: text().references(() => categories.id), // Optional transaction category
    amount: monetaryAmountColumn(), // Transaction amount (always positive)
    currencyId: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .notNull(), // Transaction currency (must match account currency)
    txDate: integer({ mode: 'timestamp_ms' }).notNull(), // Transaction date (when the transaction occurred)
    notes: text({ length: 1000 }), // Optional user notes/description
    createdAt: createdAtColumn() // Record creation timestamp
  },
  table => [
    // Performance indexes for common query patterns
    index('transactions_user_idx').on(table.userId), // User's transactions lookup
    index('transactions_account_idx').on(table.accountId), // Account transactions lookup
    index('transactions_category_idx').on(table.categoryId), // Category transactions lookup
    index('transactions_user_date_idx').on(table.userId, table.txDate), // Date-based queries
    index('transactions_user_type_idx').on(table.userId, table.type), // Type-based filtering
    index('transactions_date_idx').on(table.txDate), // Date range queries
    index('transactions_counter_account_idx').on(table.counterAccountId) // Transfer lookups
  ]
)
