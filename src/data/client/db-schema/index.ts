import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

/*
================================================================================
POWERSYNC SCHEMA - SQLite Database Schema for Local Sync
================================================================================
Purpose: Defines the SQLite schema for local data synchronization.
         Uses the converted SQLite table definitions to create PowerSync-compatible
         tables for offline-first data access.

Key Features:
- SQLite-compatible table definitions
- Full schema export
- Type definitions for all tables

Note: Since PowerSync views don't enforce database CHECK constraints,
      Zod schemas are extended with refinements to enforce these rules at runtime.
================================================================================
*/

// Import all SQLite table definitions
import { currencies, getCurrenciesSqliteTable } from './table_1_currencies'
import {
  exchangeRates,
  getExchangeRatesSqliteTable
} from './table_2_exchange-rates'
import {
  getUserPreferencesSqliteTable,
  userPreferences
} from './table_3_user-preferences'
import {
  categories,
  CATEGORY_TYPE,
  CategoryType,
  getCategoriesSqliteTable
} from './table_4_categories'
import { budgets, getBudgetsSqliteTable } from './table_5_budgets'
import {
  ACCOUNT_TYPE,
  accounts,
  AccountType,
  getAccountsSqliteTable
} from './table_6_accounts'
import {
  getTransactionsSqliteTable,
  TRANSACTION_TYPE,
  transactions,
  TransactionType
} from './table_7_transactions'
import {
  ATTACHMENT_TYPE,
  attachments,
  AttachmentType,
  getAttachmentsSqliteTable
} from './table_8_attachments'
import {
  getTransactionAttachmentsSqliteTable,
  transactionAttachments
} from './table_9_transaction-attachments'

// Import all relations
import {
  accountsRelations,
  attachmentsRelations,
  budgetsRelations,
  categoriesRelations,
  currenciesRelations,
  exchangeRatesRelations,
  transactionAttachmentsRelations,
  transactionsRelations,
  userPreferencesRelations
} from './relations'

export {
  ACCOUNT_TYPE,
  accounts,
  ATTACHMENT_TYPE,
  attachments,
  budgets,
  categories,
  CATEGORY_TYPE,
  currencies,
  exchangeRates,
  getAccountsSqliteTable,
  getAttachmentsSqliteTable,
  getBudgetsSqliteTable,
  getCategoriesSqliteTable,
  getCurrenciesSqliteTable,
  getExchangeRatesSqliteTable,
  getTransactionAttachmentsSqliteTable,
  getTransactionsSqliteTable,
  getUserPreferencesSqliteTable,
  TRANSACTION_TYPE,
  transactionAttachments,
  transactions,
  userPreferences,
  type AccountType,
  type AttachmentType,
  type CategoryType,
  type TransactionType
}

// Create the complete SQLite schema object
export const sqliteSchema = {
  currencies,
  exchangeRates,
  userPreferences,
  categories,
  budgets,
  accounts,
  transactions,
  attachments,
  transactionAttachments,
  currenciesRelations,
  exchangeRatesRelations,
  userPreferencesRelations,
  categoriesRelations,
  budgetsRelations,
  accountsRelations,
  transactionsRelations,
  attachmentsRelations,
  transactionAttachmentsRelations
}

// table_1_currencies
export type CurrencySelectSQLite = typeof currencies.$inferSelect

// table_2_exchange-rates
export type ExchangeRateSelectSQLite = typeof exchangeRates.$inferSelect

// table_3_user-preferences
export type UserPreferenceSelectSQLite = typeof userPreferences.$inferSelect
export type UserPreferenceInsertSQLite = typeof userPreferences.$inferInsert

export {
  userPreferenceInsertSchema,
  userPreferenceUpdateSchema
} from './table_3_user-preferences'

// table_4_categories
export type CategorySelectSQLite = typeof categories.$inferSelect
export type CategoryInsertSQLite = typeof categories.$inferInsert

export {
  categoryInsertSchema,
  categoryUpdateSchema
} from './table_4_categories'

// table_5_budgets
export type BudgetSelectSQLite = typeof budgets.$inferSelect
export type BudgetInsertSQLite = typeof budgets.$inferInsert

export const budgetInsertSchema = createInsertSchema(budgets)
export const budgetUpdateSchema = createUpdateSchema(budgets)

// table_6_accounts
export type AccountSelectSQLite = typeof accounts.$inferSelect
export type AccountInsertSQLite = typeof accounts.$inferInsert

export { accountInsertSchema, accountUpdateSchema } from './table_6_accounts'

// table_7_transactions
export type TransactionSelectSQLite = typeof transactions.$inferSelect
export type TransactionInsertSQLite = typeof transactions.$inferInsert

export {
  MAX_TRANSACTION_AMOUNT,
  MIN_TRANSACTION_DATE,
  transactionInsertSchema,
  transactionUpdateSchema
} from './table_7_transactions'

// table_8_attachments
export type AttachmentSelectSQLite = typeof attachments.$inferSelect
export type AttachmentInsertSQLite = typeof attachments.$inferInsert

export const attachmentInsertSchema = createInsertSchema(attachments)
export const attachmentUpdateSchema = createUpdateSchema(attachments)

// table_9_transaction-attachments
export type TransactionAttachmentSelectSQLite =
  typeof transactionAttachments.$inferSelect
export type TransactionAttachmentInsertSQLite =
  typeof transactionAttachments.$inferInsert

export const transactionAttachmentInsertSchema = createInsertSchema(
  transactionAttachments
)
export const transactionAttachmentUpdateSchema = createUpdateSchema(
  transactionAttachments
)
