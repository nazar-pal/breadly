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
- Automatic balance tracking via database triggers (implemented outside of the schema)
- Soft deletion with archive functionality
================================================================================
*/

import type { BuildColumns } from 'drizzle-orm/column-builder'
import { index, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  dateOnlyText,
  descriptionColumn,
  isArchivedColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  nameColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// ACCOUNT TYPE DEFINITIONS
// ============================================================================

/**
 * Account types supported by the system
 * - saving: Savings accounts, emergency funds, investment accounts
 * - payment: Checking accounts, credit cards, payment methods, cash
 * - debt: Loans, mortgages, credit card debt, borrowed money
 */
export const ACCOUNT_TYPE = ['saving', 'payment', 'debt'] as const
export type AccountType = (typeof ACCOUNT_TYPE)[number]

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
 * - Balance is automatically updated by database triggers (handled outside of the schema)
 * - Archived accounts are hidden but data is preserved
 * - Account names must be non-empty after trimming whitespace
 * - Type-specific fields are optional and depend on account type
 */
const columns = {
  // Explicitly define the id column for Drizzle type safety.
  // PowerSync automatically creates an id column, but defining it here
  // allows Drizzle ORM to understand the column and generate types.
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  type: text({ enum: ACCOUNT_TYPE }).notNull(), // Account classification ('saving' | 'payment' | 'debt')
  name: nameColumn(), // User-defined account name
  description: descriptionColumn(), // Optional user notes about the account

  // Currency. The foreign key reference will not be enforced in PowerSync’s default JSON-based views
  currencyId: isoCurrencyCodeColumn('currency_id').default('USD'),
  balance: monetaryAmountColumn().default(0), // Current balance

  // Type-specific fields for savings accounts
  savingsTargetAmount: real('savings_target_amount'), // Target savings goal (savings only)
  savingsTargetDate: dateOnlyText('savings_target_date'), // Target date to reach savings goal (YYYY-MM-DD TEXT)

  // Type-specific fields for debt accounts (balance sign represents debt direction - I owe someone or someone owes me)
  debtInitialAmount: real('debt_initial_amount'), // Original debt amount (debt only)
  debtDueDate: dateOnlyText('debt_due_date'), // Due date for debt payment (YYYY-MM-DD TEXT)

  isArchived: isArchivedColumn(), // Soft deletion flag
  createdAt: createdAtColumn()
}

// Extra configuration: define only single-column indexes, since PowerSync’s default JSON-based system
// doesn’t support multi-column or expression indexes. These indexes improve query performance on
// commonly filtered columns.
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('accounts_user_idx').on(table.userId), // Index for userId lookups
  index('accounts_type_idx').on(table.type), // Index for filtering by account type
  index('accounts_is_archived_idx').on(table.isArchived) // Index for archived flag
]

export const accounts = sqliteTable('accounts', columns, extraConfig)
export const getAccountsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

/**
 * Account insert schema with validation. Since PowerSync’s JSON-based views do not enforce
 * constraints, Zod is used to validate input data in your application code.
 */
export const accountInsertSchema = createInsertSchema(accounts, {
  // Non-empty name after trimming whitespace
  name: schema =>
    schema.refine(
      name => name.trim().length > 0,
      'Account name cannot be empty'
    ),
  // Currency defaults to USD (mirrors database default for validation)
  currencyId: schema => schema.default('USD'),
  // Make type-specific nullable fields optional (undefined -> null transform)
  savingsTargetAmount: schema =>
    schema
      .nullish()
      .transform(val => val ?? null)
      .refine(
        val => val === null || val > 0,
        'Savings target amount must be positive'
      ),
  savingsTargetDate: schema => schema.nullish().transform(val => val ?? null),
  debtInitialAmount: schema =>
    schema
      .nullish()
      .transform(val => val ?? null)
      .refine(
        val => val === null || val > 0,
        'Debt initial amount must be positive'
      ),
  debtDueDate: schema => schema.nullish().transform(val => val ?? null)
})
  // Savings fields only for saving accounts
  .refine(
    data =>
      data.type === 'saving' ||
      (data.savingsTargetAmount == null && data.savingsTargetDate == null),
    'Savings fields can only be set for saving accounts'
  )
  // Debt fields only for debt accounts
  .refine(
    data =>
      data.type === 'debt' ||
      (data.debtInitialAmount == null && data.debtDueDate == null),
    'Debt fields can only be set for debt accounts'
  )

export const accountUpdateSchema = createUpdateSchema(accounts, {
  // Non-empty name after trimming whitespace (when updating name)
  name: schema =>
    schema.refine(
      name => name === undefined || name.trim().length > 0,
      'Account name cannot be empty'
    ),
  // Positive savings target amount (if provided)
  savingsTargetAmount: schema =>
    schema.refine(
      val => val === null || val === undefined || val > 0,
      'Savings target amount must be positive'
    ),
  // Positive debt initial amount (if provided)
  debtInitialAmount: schema =>
    schema.refine(
      val => val === null || val === undefined || val > 0,
      'Debt initial amount must be positive'
    )
})
