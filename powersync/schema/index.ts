/*
================================================================================
POWERSYNC SCHEMA - SQLite Database Schema for Local Sync
================================================================================
Purpose: Defines the PowerSync SQLite schema for local data synchronization.
         Uses the converted SQLite table definitions to create PowerSync-compatible
         tables for offline-first data access.

Key Features:
- SQLite-compatible table definitions
- PowerSync table conversions for sync compatibility
- Full schema export for PowerSync integration
================================================================================
*/

import { DrizzleAppSchema, toPowerSyncTable } from '@powersync/drizzle-driver'

// Import all SQLite table definitions
import { currencies } from './table_1_currencies'
import { exchangeRates } from './table_2_exchange-rates'
import { userPreferences } from './table_3_user-preferences'
import { categories } from './table_4_categories'
import { budgets } from './table_5_budgets'
import { accounts } from './table_6_accounts'
import { transactions } from './table_7_transactions'
import { attachments } from './table_8_attachments'
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

// Create the complete SQLite schema object
const sqliteSchema = {
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

// Convert the Drizzle SQLite tables to PowerSync tables
const psCurrencies = toPowerSyncTable(currencies)
const psExchangeRates = toPowerSyncTable(exchangeRates)
const psUserPreferences = toPowerSyncTable(userPreferences)
const psCategories = toPowerSyncTable(categories)
const psBudgets = toPowerSyncTable(budgets)
const psAccounts = toPowerSyncTable(accounts)
const psTransactions = toPowerSyncTable(transactions)
const psAttachments = toPowerSyncTable(attachments)
const psTransactionAttachments = toPowerSyncTable(transactionAttachments)

const AppSchema = new DrizzleAppSchema(sqliteSchema)

export {
  AppSchema,
  psAccounts,
  psAttachments,
  psBudgets,
  psCategories,
  psCurrencies,
  psExchangeRates,
  psTransactionAttachments,
  psTransactions,
  psUserPreferences,
  sqliteSchema
}
