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
================================================================================
*/

// Import all SQLite table definitions
import { currencies } from './table_1_currencies'
import { exchangeRates } from './table_2_exchange-rates'
import { userPreferences } from './table_3_user-preferences'
import { categories, CATEGORY_TYPE } from './table_4_categories'
import { budgets } from './table_5_budgets'
import { ACCOUNT_TYPE, accounts } from './table_6_accounts'
import { transactions, TX_TYPE } from './table_7_transactions'
import { ATTACHMENT_TYPE, attachments } from './table_8_attachments'
import { transactionAttachments } from './table_9_transaction-attachments'

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
  transactionAttachments,
  transactions,
  TX_TYPE,
  userPreferences
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

// table_4_categories
export type CategorySelectSQLite = typeof categories.$inferSelect
export type CategoryInsertSQLite = typeof categories.$inferInsert

// table_5_budgets
export type BudgetSelectSQLite = typeof budgets.$inferSelect
export type BudgetInsertSQLite = typeof budgets.$inferInsert

// table_6_accounts
export type AccountSelectSQLite = typeof accounts.$inferSelect
export type AccountInsertSQLite = typeof accounts.$inferInsert

// table_7_transactions
export type TransactionSelectSQLite = typeof transactions.$inferSelect
export type TransactionInsertSQLite = typeof transactions.$inferInsert

// table_8_attachments
export type AttachmentSelectSQLite = typeof attachments.$inferSelect
export type AttachmentInsertSQLite = typeof attachments.$inferInsert

// table_9_transaction-attachments
export type TransactionAttachmentSelectSQLite =
  typeof transactionAttachments.$inferSelect
export type TransactionAttachmentInsertSQLite =
  typeof transactionAttachments.$inferInsert
