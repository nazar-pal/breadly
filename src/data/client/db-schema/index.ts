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

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod schemas)
- Foreign key references are NOT enforced
- Unique indexes are NOT enforced
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)
- Cascade delete behavior is NOT enforced (handled in application code)

Note: Business rules are enforced via Zod schemas at runtime.
================================================================================
*/

// Import all SQLite table definitions
import { events, getEventsSqliteTable } from './table_10_events'
import { currencies, getCurrenciesSqliteTable } from './table_1_currencies'
import {
  exchangeRates,
  getExchangeRatesSqliteTable
} from './table_2_exchange-rates'
import {
  getUserPreferencesSqliteTable,
  userPreferences
} from './table_3_user-preferences'
import type { CategoryType } from './table_4_categories'
import {
  categories,
  CATEGORY_TYPE,
  getCategoriesSqliteTable
} from './table_4_categories'
import { budgets, getBudgetsSqliteTable } from './table_5_budgets'
import type { AccountType } from './table_6_accounts'
import {
  ACCOUNT_TYPE,
  accounts,
  getAccountsSqliteTable
} from './table_6_accounts'
import type { TransactionType } from './table_7_transactions'
import {
  getTransactionsSqliteTable,
  TRANSACTION_TYPE,
  transactions
} from './table_7_transactions'
import type { AttachmentStatus, AttachmentType } from './table_8_attachments'
import {
  ATTACHMENT_STATUS,
  ATTACHMENT_TYPE,
  attachments,
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
  eventsRelations,
  exchangeRatesRelations,
  transactionAttachmentsRelations,
  transactionsRelations,
  userPreferencesRelations
} from './relations'

export {
  ACCOUNT_TYPE,
  accounts,
  ATTACHMENT_STATUS,
  ATTACHMENT_TYPE,
  attachments,
  budgets,
  categories,
  CATEGORY_TYPE,
  currencies,
  events,
  exchangeRates,
  getAccountsSqliteTable,
  getAttachmentsSqliteTable,
  getBudgetsSqliteTable,
  getCategoriesSqliteTable,
  getCurrenciesSqliteTable,
  getEventsSqliteTable,
  getExchangeRatesSqliteTable,
  getTransactionAttachmentsSqliteTable,
  getTransactionsSqliteTable,
  getUserPreferencesSqliteTable,
  TRANSACTION_TYPE,
  transactionAttachments,
  transactions,
  userPreferences,
  type AccountType,
  type AttachmentStatus,
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
  events,
  currenciesRelations,
  exchangeRatesRelations,
  userPreferencesRelations,
  categoriesRelations,
  budgetsRelations,
  accountsRelations,
  transactionsRelations,
  attachmentsRelations,
  transactionAttachmentsRelations,
  eventsRelations
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// table_1_currencies
export type CurrencySelectSQLite = typeof currencies.$inferSelect

// table_2_exchange-rates
export type ExchangeRateSelectSQLite = typeof exchangeRates.$inferSelect

// table_3_user-preferences
export type UserPreferenceSelectSQLite = typeof userPreferences.$inferSelect
export type UserPreferenceInsertSQLite = typeof userPreferences.$inferInsert

export {
  userPreferenceInsertSchema,
  userPreferenceUpdateSchema,
  type UserPreferenceInsertSchemaInput,
  type UserPreferenceInsertSchemaOutput,
  type UserPreferenceUpdateSchemaInput,
  type UserPreferenceUpdateSchemaOutput
} from './table_3_user-preferences'

// table_4_categories
export type CategorySelectSQLite = typeof categories.$inferSelect
export type CategoryInsertSQLite = typeof categories.$inferInsert

export {
  categoryInsertSchema,
  categoryUpdateSchema,
  type CategoryInsertSchemaInput,
  type CategoryInsertSchemaOutput,
  type CategoryUpdateSchemaInput,
  type CategoryUpdateSchemaOutput
} from './table_4_categories'

// table_5_budgets
export type BudgetSelectSQLite = typeof budgets.$inferSelect
export type BudgetInsertSQLite = typeof budgets.$inferInsert

export {
  BUDGET_PERIOD,
  budgetInsertSchema,
  budgetUpdateSchema,
  type BudgetInsertSchemaInput,
  type BudgetInsertSchemaOutput,
  type BudgetPeriod,
  type BudgetUpdateSchemaInput,
  type BudgetUpdateSchemaOutput
} from './table_5_budgets'

// table_6_accounts
export type AccountSelectSQLite = typeof accounts.$inferSelect
export type AccountInsertSQLite = typeof accounts.$inferInsert

export {
  accountInsertSchema,
  accountUpdateSchema,
  type AccountInsertSchemaInput,
  type AccountInsertSchemaOutput,
  type AccountUpdateSchemaInput,
  type AccountUpdateSchemaOutput
} from './table_6_accounts'

// table_7_transactions
export type TransactionSelectSQLite = typeof transactions.$inferSelect
export type TransactionInsertSQLite = typeof transactions.$inferInsert

export {
  MAX_TRANSACTION_AMOUNT,
  MIN_TRANSACTION_DATE,
  transactionInsertSchema,
  transactionUpdateSchema,
  type TransactionInsertSchemaInput,
  type TransactionInsertSchemaOutput,
  type TransactionUpdateSchemaInput,
  type TransactionUpdateSchemaOutput
} from './table_7_transactions'

// table_8_attachments
export type AttachmentSelectSQLite = typeof attachments.$inferSelect
export type AttachmentInsertSQLite = typeof attachments.$inferInsert

export {
  attachmentInsertSchema,
  attachmentUpdateSchema,
  type AttachmentInsertSchemaInput,
  type AttachmentInsertSchemaOutput,
  type AttachmentUpdateSchemaInput,
  type AttachmentUpdateSchemaOutput
} from './table_8_attachments'

// table_9_transaction-attachments
export type TransactionAttachmentSelectSQLite =
  typeof transactionAttachments.$inferSelect
export type TransactionAttachmentInsertSQLite =
  typeof transactionAttachments.$inferInsert

export {
  transactionAttachmentInsertSchema,
  transactionAttachmentUpdateSchema,
  type TransactionAttachmentInsertSchemaInput,
  type TransactionAttachmentInsertSchemaOutput,
  type TransactionAttachmentUpdateSchemaInput,
  type TransactionAttachmentUpdateSchemaOutput
} from './table_9_transaction-attachments'

// table_10_events
export type EventSelectSQLite = typeof events.$inferSelect
export type EventInsertSQLite = typeof events.$inferInsert

export {
  eventInsertSchema,
  eventUpdateSchema,
  type EventInsertSchemaInput,
  type EventInsertSchemaOutput,
  type EventUpdateSchemaInput,
  type EventUpdateSchemaOutput
} from './table_10_events'
