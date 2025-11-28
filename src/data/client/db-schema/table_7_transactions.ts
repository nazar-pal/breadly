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
- Multi-tenant isolation with row-level security
================================================================================
*/

import { sql } from 'drizzle-orm'
import type { BuildColumns } from 'drizzle-orm/column-builder'
import { check, index, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { currencies } from './table_1_currencies'
import { categories } from './table_4_categories'
import { accounts } from './table_6_accounts'
import {
  clerkUserIdColumn,
  createdAtColumn,
  dateOnlyText,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  uuidPrimaryKey
} from './utils'

/**
 * Maximum transaction amount (matches NUMERIC(14,2) database constraint)
 * Used for validation in Zod schemas
 */
export const MAX_TRANSACTION_AMOUNT = 999_999_999_999.99

/**
 * Minimum allowed transaction date (reasonable lower bound)
 */
export const MIN_TRANSACTION_DATE = new Date('1970-01-01')

// ============================================================================
// TRANSACTION TYPE DEFINITIONS
// ============================================================================

/**
 * Transaction types defining money movement patterns
 * - expense: Money spent from an account (groceries, rent, bills)
 * - income: Money received into an account (salary, freelance, gifts)
 * - transfer: Money moved between user's accounts (internal transfers)
 */
export const TRANSACTION_TYPE = ['expense', 'income', 'transfer'] as const
export type TransactionType = (typeof TRANSACTION_TYPE)[number]

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
 */
const columns = {
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  type: text({ enum: TRANSACTION_TYPE }).notNull(), // Transaction type ('expense' | 'income' | 'transfer')

  // Account references
  accountId: text('account_id').references(() => accounts.id, {
    onDelete: 'cascade'
  }), // Primary account (source for expense/transfer, destination for income)
  counterAccountId: text('counter_account_id').references(() => accounts.id), // Transfer destination account (transfers only)

  // Classification and details
  categoryId: text('category_id').references(() => categories.id), // Optional transaction category
  amount: monetaryAmountColumn(), // Transaction amount (always positive)
  currencyId: isoCurrencyCodeColumn('currency_id')
    .references(() => currencies.code)
    .notNull(), // Transaction currency (must match account currency)
  txDate: dateOnlyText('tx_date').notNull(), // Transaction date (YYYY-MM-DD TEXT)
  notes: text({ length: 1000 }), // Optional user notes/description
  createdAt: createdAtColumn() // Record creation timestamp
}

const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  // Performance indexes for common query patterns
  index('transactions_user_idx').on(table.userId), // User's transactions lookup
  index('transactions_account_idx').on(table.accountId), // Account transactions lookup
  index('transactions_category_idx').on(table.categoryId), // Category transactions lookup
  index('transactions_user_date_idx').on(table.userId, table.txDate), // Date-based queries
  index('transactions_user_type_idx').on(table.userId, table.type), // Type-based filtering
  index('transactions_date_idx').on(table.txDate), // Date range queries
  index('transactions_counter_account_idx').on(table.counterAccountId), // Transfer lookups

  // Business rule constraints
  check('transactions_positive_amount', sql`${table.amount} > 0`), // Amounts must be positive
  check(
    'transactions_transfer_different_accounts',
    sql`${table.type} != 'transfer' OR ${table.accountId} != ${table.counterAccountId}`
  ), // Transfer accounts must be different
  check(
    'transactions_transfer_has_counter_account',
    sql`${table.type} != 'transfer' OR ${table.counterAccountId} IS NOT NULL`
  ), // Transfers must have counter account
  check(
    'transactions_non_transfer_no_counter_account',
    sql`${table.type} = 'transfer' OR ${table.counterAccountId} IS NULL`
  ), // Non-transfers cannot have counter account
  check('transactions_date_not_future', sql`${table.txDate} <= CURRENT_DATE`) // No future dates
]

export const transactions = sqliteTable('transactions', columns, extraConfig)

export const getTransactionsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

/**
 * Transaction insert schema with CHECK constraint validations.
 * These constraints are not enforced by PowerSync, so we validate them in Zod.
 */
export const transactionInsertSchema = createInsertSchema(transactions, {
  // Positive transaction amount within database limits
  amount: schema =>
    schema
      .refine(val => val > 0, 'Transaction amount must be positive')
      .refine(
        val => val <= MAX_TRANSACTION_AMOUNT,
        'Transaction amount exceeds maximum allowed value'
      ),
  // Transaction date cannot be in the future (CHECK constraint replacement)
  txDate: schema =>
    schema.refine(val => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const txDay = new Date(val)
      txDay.setHours(0, 0, 0, 0)
      return txDay <= today
    }, 'Transaction date cannot be in the future')
})
  // Transfers must have a source account
  .refine(data => data.type !== 'transfer' || data.accountId != null, {
    message: 'Transfer must have a source account',
    path: ['accountId']
  })
  // Transfers must have a counter account that is different from the source
  .refine(
    data =>
      data.type !== 'transfer' ||
      (data.counterAccountId != null &&
        data.accountId !== data.counterAccountId),
    {
      message: 'Transfer must have different source and destination accounts',
      path: ['counterAccountId']
    }
  )
  // Non-transfers cannot have a counter account
  .refine(data => data.type === 'transfer' || data.counterAccountId == null, {
    message: 'Only transfers can have a destination account',
    path: ['counterAccountId']
  })

/**
 * Transaction update schema with CHECK constraint validations.
 *
 * Note: Cross-field validations (like transfer source !== destination) cannot be
 * fully validated at schema level for partial updates since we don't know the
 * existing values. These are validated inside the mutation with the merged state.
 */
export const transactionUpdateSchema = createUpdateSchema(transactions, {
  // Positive transaction amount within database limits (if provided)
  amount: schema =>
    schema
      .refine(
        val => val === undefined || val > 0,
        'Transaction amount must be positive'
      )
      .refine(
        val => val === undefined || val <= MAX_TRANSACTION_AMOUNT,
        'Transaction amount exceeds maximum allowed value'
      ),
  // Transaction date cannot be in the future (if provided)
  txDate: schema =>
    schema.refine(val => {
      if (val === undefined) return true
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const txDay = new Date(val)
      txDay.setHours(0, 0, 0, 0)
      return txDay <= today
    }, 'Transaction date cannot be in the future')
})
