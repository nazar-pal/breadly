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
- Soft deletion with archive functionality

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Foreign key references are NOT enforced
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)

Note: The id column is explicitly defined for Drizzle ORM type safety.
================================================================================
*/

import type { BuildColumns } from 'drizzle-orm/column-builder'
import {
  index,
  integer,
  real,
  sqliteTable,
  text
} from 'drizzle-orm/sqlite-core'

import { VALIDATION } from '@/data/const'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  dateOnlyText,
  descriptionColumn,
  isArchivedColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  nameColumn,
  roundToTwoDecimals,
  updatedAtColumn,
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
 * Business Rules (enforced via Zod, not SQLite):
 * - Each account belongs to a single user (multi-tenant isolation)
 * - Account names must be non-empty after trimming whitespace
 * - Type-specific fields are optional and depend on account type
 * - Savings target amount must be positive (if provided)
 * - Debt initial amount must be positive (if provided)
 *
 * Archive Columns Design:
 * ─────────────────────────────────────────────────────
 * `is_archived` and `archived_at` are intentionally independent columns.
 * When a user unarchives an account, performs no operations, then re-archives it,
 * the original `archived_at` timestamp is preserved. This is intentional behavior
 * to maintain historical archive timestamps.
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  type: text({ enum: ACCOUNT_TYPE }).notNull(), // Account classification ('saving' | 'payment' | 'debt')
  name: nameColumn(), // User-defined account name
  description: descriptionColumn(), // Optional user notes about the account

  // Currency (FK not enforced in PowerSync)
  currencyId: isoCurrencyCodeColumn('currency_id').default('USD'),
  balance: monetaryAmountColumn().default(0), // Current balance

  // Type-specific fields for savings accounts
  savingsTargetAmount: real('savings_target_amount'), // Target savings goal (savings only)
  savingsTargetDate: dateOnlyText('savings_target_date'), // Target date (YYYY-MM-DD TEXT)

  // Type-specific fields for debt accounts
  debtInitialAmount: real('debt_initial_amount'), // Original debt amount (debt only)
  debtDueDate: dateOnlyText('debt_due_date'), // Due date (YYYY-MM-DD TEXT)

  isArchived: isArchivedColumn(), // Soft deletion flag
  archivedAt: integer('archived_at', { mode: 'timestamp_ms' }), // When the account was archived
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn()
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('accounts_user_idx').on(table.userId),
  index('accounts_type_idx').on(table.type),
  index('accounts_is_archived_idx').on(table.isArchived)
]

export const accounts = sqliteTable('accounts', columns, extraConfig)
export const getAccountsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Account insert schema with business rule validations.
 *
 * Server CHECK constraints replicated:
 * - accounts_name_not_empty: name must be non-empty after trim
 * - accounts_positive_target_amount: savings target must be positive
 * - accounts_positive_debt_initial_amount: debt initial amount must be positive
 * - accounts_savings_fields_only_for_saving: savings fields only for saving accounts
 * - accounts_debt_fields_only_for_debt: debt fields only for debt accounts
 * - accounts_payment_no_type_specific_fields: payment accounts cannot have type-specific fields
 * - NUMERIC(14,2) precision: rounded to 2 decimal places for monetary fields
 */
export const accountInsertSchema = createInsertSchema(accounts, {
  id: s => s.default(randomUUID),
  name: s => s.trim().min(1).max(VALIDATION.MAX_NAME_LENGTH),
  description: s =>
    s.trim().min(1).max(VALIDATION.MAX_DESCRIPTION_LENGTH).optional(),
  currencyId: s =>
    s.trim().length(VALIDATION.CURRENCY_CODE_LENGTH).default('USD'),
  savingsTargetAmount: s =>
    s.positive().transform(roundToTwoDecimals).optional(),
  debtInitialAmount: s => s.positive().transform(roundToTwoDecimals).optional()
})
  .omit({ updatedAt: true, createdAt: true, archivedAt: true })
  // Savings fields only for saving accounts
  .refine(
    data =>
      data.type === 'saving' ||
      (data.savingsTargetAmount == null && data.savingsTargetDate == null),
    {
      message: 'Savings fields can only be set for saving accounts',
      path: ['savingsTargetAmount']
    }
  )
  // Debt fields only for debt accounts
  .refine(
    data =>
      data.type === 'debt' ||
      (data.debtInitialAmount == null && data.debtDueDate == null),
    {
      message: 'Debt fields can only be set for debt accounts',
      path: ['debtInitialAmount']
    }
  )
  // Payment accounts cannot have any type-specific fields
  .refine(
    data =>
      data.type !== 'payment' ||
      (data.savingsTargetAmount == null &&
        data.savingsTargetDate == null &&
        data.debtInitialAmount == null &&
        data.debtDueDate == null),
    {
      message: 'Payment accounts cannot have savings or debt fields',
      path: ['type']
    }
  )

export type AccountInsertSchemaInput = z.input<typeof accountInsertSchema>
export type AccountInsertSchemaOutput = z.output<typeof accountInsertSchema>

/**
 * Account update schema with business rule validations.
 *
 * IMPORTANT: When creating an account update mutation, you MUST also validate:
 * - Account exists and belongs to user
 * - Currency change protection: validate_account_currency_change() trigger on server
 *   prevents changing currency when transactions exist for this account
 * - If updating currency, check: no transactions with accountId OR counterAccountId = this account
 */
export const accountUpdateSchema = createUpdateSchema(accounts, {
  name: s => s.trim().min(1).max(VALIDATION.MAX_NAME_LENGTH),
  description: s => s.trim().min(1).max(VALIDATION.MAX_DESCRIPTION_LENGTH),
  savingsTargetAmount: s => s.positive().transform(roundToTwoDecimals),
  debtInitialAmount: s => s.positive().transform(roundToTwoDecimals)
}).omit({
  id: true,
  userId: true,
  type: true,
  createdAt: true,
  updatedAt: true
})

export type AccountUpdateSchemaInput = z.input<typeof accountUpdateSchema>
export type AccountUpdateSchemaOutput = z.output<typeof accountUpdateSchema>
