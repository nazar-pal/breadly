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

import { relations, sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import {
  boolean,
  check,
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

import { currencies, transactions } from '.'

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
    id: uuid().defaultRandom().primaryKey(),
    userId: varchar({ length: 50 })
      .default(sql`(auth.user_id())`)
      .notNull(), // Clerk user ID for multi-tenant isolation
    type: accountType().notNull(), // Account classification (saving/payment/debt)
    name: varchar({ length: 100 }).notNull(), // User-defined account name
    description: varchar({ length: 1000 }), // Optional user notes about the account
    currencyId: varchar({ length: 3 }).references(() => currencies.code), // Account base currency
    balance: numeric({ precision: 14, scale: 2 }).default('0'), // Current balance (updated by triggers)
    isArchived: boolean('is_archived').default(false).notNull(), // Soft deletion flag
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
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

// ============================================================================
// ACCOUNT RELATIONSHIPS
// ============================================================================

/**
 * Account relationship mappings
 * Defines how accounts relate to other entities in the system
 */
export const accountsRelations = relations(accounts, ({ one, many }) => ({
  currency: one(currencies, {
    fields: [accounts.currencyId],
    references: [currencies.code]
  }),
  transactions: many(transactions), // Transactions from this account
  counterTransactions: many(transactions, { relationName: 'counterAccount' }) // Transfers to this account
}))
