/*
================================================================================
DATABASE SCHEMA - Breadly Financial Management System
================================================================================
Overview: Complete database schema for a multi-tenant personal finance 
          management application with support for multiple currencies,
          accounts, transactions, budgets, and user preferences.

Core Features:
- Multi-tenant architecture with user isolation
- Multi-currency support with exchange rates
- Account management (saving, payment, debt)
- Transaction tracking (income, expense, transfer)
- Category management with hierarchical structure
- Budget tracking and management
- Receipt storage and attachment
- User preferences and localization

Security: Row-level security (RLS) policies ensure users can only access
          their own data using Clerk authentication integration.
================================================================================
*/

// ============================================================================
// IMPORTS & DEPENDENCIES
// ============================================================================

import { relations, sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

// ============================================================================
// ENUMS - Type Definitions
// ============================================================================

/**
 * Account types supported by the system
 * - saving: Savings accounts, emergency funds, etc.
 * - payment: Checking accounts, credit cards, payment methods
 * - debt: Loans, mortgages, credit card debt
 */
export const accountType = pgEnum('account_type', ['saving', 'payment', 'debt'])

/**
 * Category types for transaction classification
 * - expense: Money going out (groceries, rent, utilities)
 * - income: Money coming in (salary, freelance, investments)
 */
export const categoryType = pgEnum('category_type', ['expense', 'income'])

/**
 * Transaction types defining money movement
 * - expense: Money spent from an account
 * - income: Money received into an account
 * - transfer: Money moved between user's accounts
 */
export const txType = pgEnum('transaction_type', [
  'expense',
  'income',
  'transfer'
])

/**
 * Budget period types for tracking spending limits
 * - daily: Daily budget limits
 * - weekly: Weekly budget limits
 * - monthly: Monthly budget limits
 * - quarterly: Quarterly budget limits
 * - yearly: Annual budget limits
 */
export const budgetPeriod = pgEnum('budget_period', [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly'
])

/**
 * Attachment types for transaction documentation
 * - receipt: Receipt photos/documents (images, PDFs)
 * - voice: Voice message recordings (audio files)
 */
export const attachmentType = pgEnum('attachment_type', ['receipt', 'voice'])

// ============================================================================
// CORE SYSTEM TABLES
// ============================================================================

// ----------------------------------------------------------------------------
// CURRENCIES - Multi-currency Support
// ----------------------------------------------------------------------------

/**
 * Supported currencies in the system
 * Contains currency codes (USD, EUR, etc.), symbols, and display names
 */
export const currencies = pgTable('currencies', {
  code: varchar({ length: 3 }).primaryKey(), // ISO 4217 currency code (e.g., USD, EUR)
  symbol: varchar({ length: 10 }).notNull(), // Currency symbol (e.g., $, €, £)
  name: varchar({ length: 100 }).notNull() // Full currency name (e.g., US Dollar)
})

/**
 * Exchange rates between currencies
 * Supports historical exchange rate tracking for accurate conversions
 */
export const exchangeRates = pgTable(
  'exchange_rates',
  {
    id: uuid().defaultRandom().primaryKey(),
    baseCurrency: varchar({ length: 3 })
      .references(() => currencies.code)
      .notNull(),
    quoteCurrency: varchar({ length: 3 })
      .references(() => currencies.code)
      .notNull(),
    rate: numeric().notNull(), // Exchange rate (base to quote)
    rateDate: date().notNull() // Date this rate was valid
  },
  table => [
    // Ensure unique rates per currency pair per date
    uniqueIndex('exchange_rates_base_quote_date_unq').on(
      table.baseCurrency,
      table.quoteCurrency,
      table.rateDate
    ),

    // Business rule constraints
    check('exchange_rates_positive_rate', sql`${table.rate} > 0`),
    check(
      'exchange_rates_different_currencies',
      sql`${table.baseCurrency} != ${table.quoteCurrency}`
    ),

    // Performance indexes
    index('exchange_rates_base_currency_idx').on(table.baseCurrency),
    index('exchange_rates_quote_currency_idx').on(table.quoteCurrency)
  ]
)

// ============================================================================
// USER DATA TABLES
// ============================================================================

// ----------------------------------------------------------------------------
// ACCOUNTS - User Financial Accounts
// ----------------------------------------------------------------------------

/**
 * User financial accounts (bank accounts, credit cards, etc.)
 * Core entity for tracking money and balances
 */
export const accounts = pgTable(
  'accounts',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: varchar({ length: 50 })
      .default(sql`(auth.user_id())`)
      .notNull(), // Clerk user ID for multi-tenant isolation
    type: accountType().notNull(), // Account classification
    name: varchar({ length: 100 }).notNull(), // User-defined account name
    description: varchar({ length: 1000 }), // Optional user notes about the account
    currencyId: varchar({ length: 3 }).references(() => currencies.code), // Account currency
    balance: numeric({ precision: 14, scale: 2 }).default('0'), // Current balance
    isArchived: boolean('is_archived').default(false).notNull(), // Soft deletion flag
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
  },
  table => [
    // Performance indexes
    index('accounts_user_idx').on(table.userId),
    index('accounts_user_archived_idx').on(table.userId, table.isArchived),
    index('accounts_user_type_idx').on(table.userId, table.type),

    // Business rule constraints
    check('accounts_name_not_empty', sql`length(trim(${table.name})) > 0`),

    // RLS: Users can only access their own accounts
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)

// ----------------------------------------------------------------------------
// CATEGORIES - Transaction Classification
// ----------------------------------------------------------------------------

/**
 * Hierarchical transaction categories (income/expense classification)
 * Supports parent-child relationships for nested categorization
 */
export const categories = pgTable(
  'categories',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: varchar({ length: 50 })
      .default(sql`(auth.user_id())`)
      .notNull(),
    type: categoryType().notNull(), // Income or expense category
    parentId: uuid(), // Self-reference for hierarchy
    name: varchar({ length: 100 }).notNull(), // Category name
    description: varchar({ length: 1000 }), // Optional user notes about the category
    icon: varchar({ length: 50 }).notNull().default('circle'), // Lucide icon name
    isArchived: boolean().default(false).notNull(), // Soft deletion flag
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
  },
  table => [
    // Self-referencing foreign key for hierarchy
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'categories_parent_id_fk'
    }).onDelete('cascade'),

    // Performance indexes
    index('categories_user_idx').on(table.userId),
    index('categories_parent_idx').on(table.parentId),
    index('categories_user_archived_idx').on(table.userId, table.isArchived),
    index('categories_user_type_idx').on(table.userId, table.type),

    // Unique constraint: same name per user+parent (null parent duplicates allowed)
    uniqueIndex('categories_user_parent_name_unq').on(
      table.userId,
      table.parentId,
      table.name
    ),

    // Business rule constraints
    check('categories_name_not_empty', sql`length(trim(${table.name})) > 0`),
    check(
      'categories_no_self_parent',
      sql`${table.parentId} IS NULL OR ${table.parentId} != ${table.id}`
    ),

    // RLS: Users can only access their own categories
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)

// ----------------------------------------------------------------------------
// TRANSACTIONS - Core Financial Records
// ----------------------------------------------------------------------------

/**
 * Financial transactions (income, expenses, transfers)
 * Central entity tracking all money movements in the system
 */
export const transactions = pgTable(
  'transactions',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: varchar({ length: 50 })
      .default(sql`(auth.user_id())`)
      .notNull(),
    type: txType().notNull(), // Transaction type

    // Account references
    accountId: uuid()
      .references(() => accounts.id, { onDelete: 'cascade' })
      .notNull(), // Primary account
    counterAccountId: uuid().references(() => accounts.id), // For transfers only

    // Classification and details
    categoryId: uuid().references(() => categories.id), // Optional category
    amount: numeric({ precision: 14, scale: 2 }).notNull(), // Transaction amount
    currencyId: varchar({ length: 3 })
      .references(() => currencies.code)
      .notNull(), // Transaction currency (required for balance calculations)
    txDate: date().notNull(), // Transaction date
    notes: varchar({ length: 1000 }), // Optional notes
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
  },
  table => [
    // Performance indexes for common queries
    index('transactions_user_idx').on(table.userId),
    index('transactions_account_idx').on(table.accountId),
    index('transactions_category_idx').on(table.categoryId),
    index('transactions_user_date_idx').on(table.userId, table.txDate),
    index('transactions_user_type_idx').on(table.userId, table.type),
    index('transactions_date_idx').on(table.txDate),
    index('transactions_counter_account_idx').on(table.counterAccountId),

    // Business rule constraints
    check('transactions_positive_amount', sql`${table.amount} > 0`),
    check(
      'transactions_transfer_different_accounts',
      sql`${table.type} != 'transfer' OR ${table.accountId} != ${table.counterAccountId}`
    ),
    check(
      'transactions_transfer_has_counter_account',
      sql`${table.type} != 'transfer' OR ${table.counterAccountId} IS NOT NULL`
    ),
    check(
      'transactions_non_transfer_no_counter_account',
      sql`${table.type} = 'transfer' OR ${table.counterAccountId} IS NULL`
    ),
    check('transactions_date_not_future', sql`${table.txDate} <= CURRENT_DATE`),

    // RLS: Users can only access their own transactions
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)

// ============================================================================
// SUPPORTING FEATURE TABLES
// ============================================================================

// ----------------------------------------------------------------------------
// ATTACHMENTS - Transaction Documentation
// ----------------------------------------------------------------------------

/**
 * File attachments for transaction documentation
 * Supports receipts (photos/PDFs) and voice messages (audio)
 * Many-to-many relationship: multiple transactions can reference same attachment
 */
export const attachments = pgTable(
  'attachments',
  {
    id: uuid().defaultRandom().primaryKey(),
    type: attachmentType().notNull(), // receipt or voice
    bucketPath: text().notNull(), // Cloud storage path - using text for unlimited length
    mime: varchar({ length: 150 }).notNull(), // File MIME type - increased for complex MIME types
    fileName: varchar({ length: 500 }).notNull(), // Original filename - increased for very long file names
    fileSize: numeric().notNull(), // File size in bytes
    duration: numeric(), // Duration in seconds (for voice messages)
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
  },
  table => [
    // Performance indexes
    index('attachments_type_idx').on(table.type),
    index('attachments_created_at_idx').on(table.createdAt),

    // Business rule constraints
    check(
      'attachments_bucket_path_not_empty',
      sql`length(trim(${table.bucketPath})) > 0`
    ),
    check(
      'attachments_file_size_positive',
      sql`${table.fileSize} IS NULL OR ${table.fileSize} > 0`
    ),
    check(
      'attachments_duration_positive',
      sql`${table.duration} IS NULL OR ${table.duration} > 0`
    ),
    check(
      'attachments_voice_has_duration',
      sql`${table.type} != 'voice' OR ${table.duration} IS NOT NULL`
    )
  ]
)

/**
 * Junction table linking transactions to their attachments
 * Many-to-many relationship: one transaction can have multiple attachments,
 * one attachment can be referenced by multiple transactions
 */
export const transactionAttachments = pgTable(
  'transaction_attachments',
  {
    transactionId: uuid()
      .references(() => transactions.id, { onDelete: 'cascade' })
      .notNull(),
    attachmentId: uuid()
      .references(() => attachments.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
  },
  table => [
    // Composite primary key
    primaryKey({ columns: [table.transactionId, table.attachmentId] }),

    // Performance indexes (individual foreign key lookups)
    index('transaction_attachments_transaction_idx').on(table.transactionId),
    index('transaction_attachments_attachment_idx').on(table.attachmentId),

    // RLS: Users can only access attachments through their own transactions
    crudPolicy({
      role: authenticatedRole,
      read: sql`EXISTS (
        SELECT 1 FROM transactions t 
        WHERE t.id = ${table.transactionId} 
        AND t.user_id = auth.user_id()
      )`,
      modify: sql`EXISTS (
        SELECT 1 FROM transactions t 
        WHERE t.id = ${table.transactionId} 
        AND t.user_id = auth.user_id()
      )`
    })
  ]
)

// ----------------------------------------------------------------------------
// BUDGETS - Spending Limits & Goals
// ----------------------------------------------------------------------------

/**
 * Budget tracking for categories
 * Allows users to set spending limits and track progress
 */
export const budgets = pgTable(
  'budgets',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: varchar({ length: 50 })
      .default(sql`(auth.user_id())`)
      .notNull(),
    categoryId: uuid()
      .references(() => categories.id, { onDelete: 'cascade' })
      .notNull(),
    amount: numeric({ precision: 14, scale: 2 }).notNull(), // Budget limit
    period: budgetPeriod().default('monthly').notNull(), // Budget period
    startDate: date().notNull()
  },
  table => [
    // Performance indexes
    index('budgets_user_idx').on(table.userId),
    index('budgets_category_idx').on(table.categoryId),
    index('budgets_user_period_idx').on(table.userId, table.period),

    // Prevent duplicate budgets for same category+period+start date
    uniqueIndex('budgets_category_period_start_unq').on(
      table.categoryId,
      table.period,
      table.startDate
    ),

    // Business rule constraints
    check('budgets_positive_amount', sql`${table.amount} > 0`),

    // RLS: Users can only access their own budgets
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)

// ----------------------------------------------------------------------------
// USER PREFERENCES - System Configuration
// ----------------------------------------------------------------------------

/**
 * User-specific application preferences and settings
 * Controls UI behavior, localization, and default values
 */
export const userPreferences = pgTable(
  'user_preferences',
  {
    userId: varchar({ length: 50 })
      .default(sql`(auth.user_id())`)
      .notNull()
      .primaryKey(),
    defaultCurrency: varchar({ length: 3 }).references(() => currencies.code), // Default currency
    firstWeekday: numeric().default('1'), // Week start (1=Monday)
    locale: varchar({ length: 20 }).default('en-US') // Localization - increased for longer locale codes
  },
  table => [
    // Business rule constraints
    check(
      'user_preferences_valid_weekday',
      sql`${table.firstWeekday} >= 1 AND ${table.firstWeekday} <= 7`
    ),

    // RLS: Users can only access their own preferences
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)

// ============================================================================
// TABLE RELATIONSHIPS & FOREIGN KEYS
// ============================================================================

// ----------------------------------------------------------------------------
// Currency Relations
// ----------------------------------------------------------------------------

export const currenciesRelations = relations(currencies, ({ many }) => ({
  accounts: many(accounts),
  transactions: many(transactions),
  userPreferences: many(userPreferences),
  baseExchangeRates: many(exchangeRates, { relationName: 'baseRates' }),
  quoteExchangeRates: many(exchangeRates, { relationName: 'quoteRates' })
}))

export const exchangeRatesRelations = relations(exchangeRates, ({ one }) => ({
  baseCurrency: one(currencies, {
    fields: [exchangeRates.baseCurrency],
    references: [currencies.code],
    relationName: 'baseRates'
  }),
  quoteCurrency: one(currencies, {
    fields: [exchangeRates.quoteCurrency],
    references: [currencies.code],
    relationName: 'quoteRates'
  })
}))

// ----------------------------------------------------------------------------
// Account Relations
// ----------------------------------------------------------------------------

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  currency: one(currencies, {
    fields: [accounts.currencyId],
    references: [currencies.code]
  }),
  transactions: many(transactions),
  counterTransactions: many(transactions, { relationName: 'counterAccount' })
}))

// ----------------------------------------------------------------------------
// Category Relations (Hierarchical)
// ----------------------------------------------------------------------------

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id]
  }),
  children: many(categories),
  transactions: many(transactions),
  budgets: many(budgets)
}))

// ----------------------------------------------------------------------------
// Transaction Relations (Core Entity)
// ----------------------------------------------------------------------------

export const transactionsRelations = relations(
  transactions,
  ({ one, many }) => ({
    account: one(accounts, {
      fields: [transactions.accountId],
      references: [accounts.id]
    }),
    counterAccount: one(accounts, {
      fields: [transactions.counterAccountId],
      references: [accounts.id],
      relationName: 'counterAccount'
    }),
    category: one(categories, {
      fields: [transactions.categoryId],
      references: [categories.id]
    }),
    currency: one(currencies, {
      fields: [transactions.currencyId],
      references: [currencies.code]
    }),
    transactionAttachments: many(transactionAttachments)
  })
)

// ----------------------------------------------------------------------------
// Supporting Feature Relations
// ----------------------------------------------------------------------------

export const attachmentsRelations = relations(attachments, ({ many }) => ({
  transactionAttachments: many(transactionAttachments)
}))

export const transactionAttachmentsRelations = relations(
  transactionAttachments,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [transactionAttachments.transactionId],
      references: [transactions.id]
    }),
    attachment: one(attachments, {
      fields: [transactionAttachments.attachmentId],
      references: [attachments.id]
    })
  })
)

export const budgetsRelations = relations(budgets, ({ one }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id]
  })
}))

export const userPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    defaultCurrency: one(currencies, {
      fields: [userPreferences.defaultCurrency],
      references: [currencies.code]
    })
  })
)
