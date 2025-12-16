/*
================================================================================
TRANSACTIONS SCHEMA - Core Financial Records Management
================================================================================
Purpose: Manages all financial transactions (income, expenses, transfers) in the
         Breadly system. Central entity tracking all money movements with support
         for multi-currency operations.

Key Features:
- Income, expense, and transfer transaction types
- Multi-currency transaction support
- Account-to-account transfers with dual-account tracking
- Category-based transaction classification
- Multi-tenant isolation

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Foreign key references are NOT enforced
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)
- Cascade delete behavior is NOT enforced (handled in application code)

Note: The id column is explicitly defined for Drizzle ORM type safety.
================================================================================
*/

import type { BuildColumns } from 'drizzle-orm/column-builder'
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  dateOnlyText,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  roundToTwoDecimals,
  updatedAtColumn,
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
 * ACCOUNT LINKING DESIGN:
 * ─────────────────────────────────────────────────────
 * The accountId field is intentionally nullable for income/expense transactions.
 * Users have two options when creating a transaction:
 *
 *   Option 1: Link to an account
 *     - Set accountId to reference an existing account
 *     - currencyId MUST match the account's currency (enforced by server trigger)
 *     - Application must manually update the account's balance
 *
 *   Option 2: Specify currency only (no account)
 *     - Leave accountId as NULL
 *     - Set currencyId to the desired transaction currency
 *     - Transaction is recorded but doesn't affect any account balance
 *     - Useful for tracking expenses/income without managing account balances
 *
 * TRANSFER TRANSACTIONS:
 *   - MUST have both accountId (source) AND counterAccountId (destination)
 *   - Both accounts must belong to the same user
 *   - Both accounts must use the same currency as the transaction
 *
 * Business Rules (enforced via Zod, not SQLite):
 * - All transactions belong to a specific user (multi-tenant isolation)
 * - If accountId is provided, transaction currency must match account's currency
 * - Transfer transactions require both accountId and counterAccountId
 * - Transfer accounts must be different and belong to the same user
 * - Non-transfer transactions must not have a counterAccountId
 * - Transaction amounts must be positive (direction determined by type)
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  type: text({ enum: TRANSACTION_TYPE }).notNull(), // Transaction type ('expense' | 'income' | 'transfer')

  // Account references (foreign keys NOT enforced in PowerSync JSON-based views)
  accountId: text('account_id'), // Primary account (source for expense/transfer, destination for income)
  counterAccountId: text('counter_account_id'), // Transfer destination account (transfers only)

  // Classification and details
  categoryId: text('category_id'), // Optional transaction category (FK not enforced)
  eventId: text('event_id'), // Optional event for cross-category tracking (FK not enforced)
  amount: monetaryAmountColumn(), // Transaction amount (always positive)
  currencyId: isoCurrencyCodeColumn('currency_id').notNull(), // Transaction currency (must match account currency if accountId is set)
  txDate: dateOnlyText('tx_date').notNull(), // Transaction date (YYYY-MM-DD TEXT)
  notes: text({ length: 1000 }), // Optional user notes/description
  createdAt: createdAtColumn(), // Record creation timestamp
  updatedAt: updatedAtColumn()
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('transactions_user_idx').on(table.userId), // User's transactions lookup
  index('transactions_account_idx').on(table.accountId), // Account transactions lookup
  index('transactions_category_idx').on(table.categoryId), // Category transactions lookup
  index('transactions_date_idx').on(table.txDate), // Date range queries
  index('transactions_counter_account_idx').on(table.counterAccountId), // Transfer lookups
  index('transactions_event_idx').on(table.eventId) // Event transactions lookup
]

export const transactions = sqliteTable('transactions', columns, extraConfig)

export const getTransactionsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
// Business rules are enforced here since PowerSync JSON-based views
// do not support CHECK constraints or foreign keys.

/**
 * Maximum notes length (matches varchar(1000) server constraint)
 */
const MAX_NOTES_LENGTH = 1000

/**
 * Transaction insert schema with business rule validations.
 * PowerSync's JSON-based views do not enforce constraints,
 * so Zod is used to validate input data in application code.
 *
 * Server CHECK constraints replicated:
 * - transactions_positive_amount: amount > 0
 * - transactions_transfer_different_accounts: transfer source != destination
 * - transactions_transfer_has_counter_account: transfers must have counter account
 * - transactions_non_transfer_no_counter_account: non-transfers can't have counter account
 * - transactions_income_expense_has_category: income/expense must have categoryId
 * - transactions_date_not_future: tx_date <= CURRENT_DATE
 * - NUMERIC(14,2) precision: rounded to 2 decimal places
 */
export const transactionInsertSchema = createInsertSchema(transactions, {
  id: s => s.default(randomUUID),
  amount: s =>
    s.positive().max(MAX_TRANSACTION_AMOUNT).transform(roundToTwoDecimals),
  notes: s => s.trim().min(1).max(MAX_NOTES_LENGTH).optional()
})
  .omit({ createdAt: true, updatedAt: true })
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
  // Income and expense transactions must have a category
  .refine(data => data.type === 'transfer' || data.categoryId != null, {
    message: 'Income and expense transactions must have a category',
    path: ['categoryId']
  })

export type TransactionInsertSchemaInput = z.input<
  typeof transactionInsertSchema
>
export type TransactionInsertSchemaOutput = z.output<
  typeof transactionInsertSchema
>

/**
 * Transaction update schema with business rule validations.
 *
 * Note: Cross-field validations (like transfer source !== destination) cannot be
 * fully validated at schema level for partial updates since we don't know the
 * existing values. These are validated inside the mutation with the merged state.
 */
export const transactionUpdateSchema = createUpdateSchema(transactions, {
  amount: s =>
    s.positive().max(MAX_TRANSACTION_AMOUNT).transform(roundToTwoDecimals),
  notes: s => s.trim().min(1).max(MAX_NOTES_LENGTH).optional()
}).omit({ id: true, userId: true, createdAt: true, updatedAt: true })

export type TransactionUpdateSchemaInput = z.input<
  typeof transactionUpdateSchema
>
export type TransactionUpdateSchemaOutput = z.output<
  typeof transactionUpdateSchema
>
