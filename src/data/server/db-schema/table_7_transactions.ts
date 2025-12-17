/*
================================================================================
TRANSACTIONS SCHEMA - Core Financial Records Management
================================================================================
Purpose: Manages all financial transactions (income, expenses, transfers) in the
         Breadly system. Central entity tracking all money movements with support
         for multi-currency operations.

Key Features:
- Income, expense, and transfer transaction types
- Multi-currency transaction support with validation
- Account-to-account transfers with dual-account tracking
- Category-based transaction classification
- Comprehensive business rule validation
- Multi-tenant isolation with row-level security

Note: Account balances are managed manually by the application - there are no
      database triggers that automatically update account balances.
================================================================================
*/

import { sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import {
  check,
  date,
  index,
  pgEnum,
  pgTable,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

import { events } from './table_10_events'
import { currencies } from './table_1_currencies'
import { categories } from './table_4_categories'
import { accounts } from './table_6_accounts'
import {
  clerkUserIdColumn,
  createdAtColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  updatedAtColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// TRANSACTION TYPE DEFINITIONS
// ============================================================================

/**
 * Transaction types defining money movement patterns
 * - expense: Money spent from an account (groceries, rent, bills)
 * - income: Money received into an account (salary, freelance, gifts)
 * - transfer: Money moved between user's accounts (internal transfers)
 */
export const transactionType = pgEnum('transaction_type', [
  'expense',
  'income',
  'transfer'
])

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
 *     - currencyId MUST match the account's currency (enforced by trigger)
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
 * Business Rules:
 * - All transactions belong to a specific user (multi-tenant isolation)
 * - If accountId is provided, transaction currency must match account's currency
 * - Transfer transactions require both accountId and counterAccountId
 * - Transfer accounts must be different and belong to the same user
 * - Non-transfer transactions must not have a counterAccountId
 * - Transaction amounts must be positive (direction determined by type)
 * - Account balances must be manually updated by the application (no auto-triggers)
 */
export const transactions = pgTable(
  'transactions',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: transactionType().notNull(), // Transaction type (expense/income/transfer)

    // Account references
    accountId: uuid().references(() => accounts.id, { onDelete: 'restrict' }), // Primary account (source for expense/transfer, destination for income)
    counterAccountId: uuid().references(() => accounts.id, {
      onDelete: 'restrict'
    }), // Transfer destination account (transfers only)

    // Classification and details
    categoryId: uuid().references(() => categories.id, {
      onDelete: 'restrict'
    }), // Required for income/expense transactions, null for transfers
    eventId: uuid().references(() => events.id, { onDelete: 'set null' }), // Optional event for cross-category tracking
    amount: monetaryAmountColumn(), // Transaction amount (always positive)
    currencyId: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .notNull(), // Transaction currency (must match account currency if accountId is set)
    txDate: date().notNull(), // Transaction date (when the transaction occurred)
    notes: varchar({ length: 1000 }), // Optional user notes/description
    createdAt: createdAtColumn(), // Record creation timestamp
    updatedAt: updatedAtColumn()
  },
  table => [
    // Essential indexes (server-side operations only)
    index('transactions_user_idx').on(table.userId), // PowerSync sync queries
    index('transactions_account_idx').on(table.accountId), // FK ON DELETE RESTRICT lookups
    index('transactions_counter_account_idx').on(table.counterAccountId), // FK ON DELETE RESTRICT lookups
    index('transactions_category_idx').on(table.categoryId), // FK ON DELETE RESTRICT lookups
    index('transactions_event_idx').on(table.eventId), // FK ON DELETE SET NULL lookups
    index('transactions_date_idx').on(table.txDate), // Date range queries
    index('transactions_type_idx').on(table.type), // Filter by transaction type

    // Business rule constraints
    check('transactions_positive_amount', sql`${table.amount} > 0`), // Amounts must be positive
    check(
      'transactions_transfer_different_accounts',
      sql`${table.type} != 'transfer' OR ${table.accountId} != ${table.counterAccountId}`
    ), // Transfer accounts must be different
    check(
      'transactions_transfer_has_account',
      sql`${table.type} != 'transfer' OR ${table.accountId} IS NOT NULL`
    ), // Transfers must have source account
    check(
      'transactions_transfer_has_counter_account',
      sql`${table.type} != 'transfer' OR ${table.counterAccountId} IS NOT NULL`
    ), // Transfers must have destination account
    check(
      'transactions_non_transfer_no_counter_account',
      sql`${table.type} = 'transfer' OR ${table.counterAccountId} IS NULL`
    ), // Non-transfers cannot have counter account
    check(
      'transactions_income_expense_has_category',
      sql`${table.type} = 'transfer' OR ${table.categoryId} IS NOT NULL`
    ), // Income and expense transactions must have a category
    check(
      'transactions_transfer_no_category',
      sql`${table.type} != 'transfer' OR ${table.categoryId} IS NULL`
    ), // Transfer transactions cannot have a category
    // NOTE: Removed future-date check to avoid timezone-related false positives

    // RLS: Users can only access their own transactions
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
