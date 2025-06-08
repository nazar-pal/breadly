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
import { check, index, pgEnum, pgTable } from 'drizzle-orm/pg-core'

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
 */
export const accounts = pgTable(
  'accounts',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: accountType().notNull(), // Account classification (saving/payment/debt)
    name: nameColumn(), // User-defined account name
    description: descriptionColumn(), // Optional user notes about the account
    currencyId: isoCurrencyCodeColumn().references(() => currencies.code), // Account base currency
    balance: monetaryAmountColumn().default('0'), // Current balance (updated by triggers)
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

    // RLS: Users can only access their own accounts
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
