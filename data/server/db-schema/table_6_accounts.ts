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
- Row-level security for data protection
================================================================================
*/

import { sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import {
  boolean,
  check,
  date,
  index,
  numeric,
  pgEnum,
  pgTable
} from 'drizzle-orm/pg-core'

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
// ACCOUNT TYPE DEFINITIONS
// ============================================================================

/**
 * Account types supported by the system
 * - saving: Savings accounts, emergency funds, investment accounts
 * - payment: Checking accounts, credit cards, payment methods, cash
 * - debt: Loans, mortgages, credit card debt, borrowed money
 */
export const accountType = pgEnum('account_type', ['saving', 'payment', 'debt'])

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
 */
export const accounts = pgTable(
  'accounts',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: accountType().notNull(), // Account classification (saving/payment/debt)
    name: nameColumn(), // User-defined account name
    description: descriptionColumn(), // Optional user notes about the account
    currencyId: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .default('USD'), // Account base currency
    balance: monetaryAmountColumn().default('0'), // Current balance (updated by triggers)

    // Type-specific fields for savings accounts
    savingsTargetAmount: numeric({ precision: 14, scale: 2 }), // Target savings goal (savings only)
    savingsTargetDate: date(), // Target date to reach savings goal (savings only)

    // Type-specific fields for debt accounts
    debtInitialAmount: numeric({ precision: 14, scale: 2 }), // Original debt amount (debt only)
    debtIsOwedToMe: boolean(), // True if someone owes you, false if you owe someone (debt only)
    debtDueDate: date(), // Due date for debt payment (debt only)

    isArchived: isArchivedColumn(), // Soft deletion flag
    createdAt: createdAtColumn()
  },
  table => [
    // Performance indexes for common query patterns
    index('accounts_user_idx').on(table.userId), // User's accounts lookup
    index('accounts_user_archived_idx').on(table.userId, table.isArchived), // Active accounts only
    index('accounts_user_type_idx').on(table.userId, table.type), // Accounts by type

    // Business rule constraints
    check('accounts_name_not_empty', sql`length(trim(${table.name})) > 0`), // Non-empty names
    check(
      'accounts_positive_target_amount',
      sql`${table.savingsTargetAmount} IS NULL OR ${table.savingsTargetAmount} > 0`
    ), // Positive target amounts
    check(
      'accounts_positive_debt_initial_amount',
      sql`${table.debtInitialAmount} IS NULL OR ${table.debtInitialAmount} > 0`
    ), // Positive debt initial amounts

    // Type-specific field constraints - ensure fields are only used for appropriate account types
    check(
      'accounts_savings_fields_only_for_saving',
      sql`(${table.type} = 'saving') OR (${table.savingsTargetAmount} IS NULL AND ${table.savingsTargetDate} IS NULL)`
    ), // Savings fields only for saving accounts
    check(
      'accounts_debt_fields_only_for_debt',
      sql`(${table.type} = 'debt') OR (${table.debtInitialAmount} IS NULL AND ${table.debtIsOwedToMe} IS NULL AND ${table.debtDueDate} IS NULL)`
    ), // Debt fields only for debt accounts
    check(
      'accounts_payment_no_type_specific_fields',
      sql`(${table.type} != 'payment') OR (${table.savingsTargetAmount} IS NULL AND ${table.savingsTargetDate} IS NULL AND ${table.debtInitialAmount} IS NULL AND ${table.debtIsOwedToMe} IS NULL AND ${table.debtDueDate} IS NULL)`
    ), // Payment accounts cannot have type-specific fields

    // RLS: Users can only access their own accounts
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
