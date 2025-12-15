import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import * as relations from './relations'
import * as events_schema from './table_10_events'
import { events } from './table_10_events'
import * as currencies_schema from './table_1_currencies'
import { currencies } from './table_1_currencies'
import * as exchangeRates_schema from './table_2_exchange-rates'
import { exchangeRates } from './table_2_exchange-rates'
import * as userPreferences_schema from './table_3_user-preferences'
import { userPreferences } from './table_3_user-preferences'
import * as categories_schema from './table_4_categories'
import { categories } from './table_4_categories'
import * as budgets_schema from './table_5_budgets'
import { budgets } from './table_5_budgets'
import * as accounts_schema from './table_6_accounts'
import { accounts } from './table_6_accounts'
import * as transactions_schema from './table_7_transactions'
import { transactions } from './table_7_transactions'
import * as attachments_schema from './table_8_attachments'
import { attachments } from './table_8_attachments'
import * as transactionAttachments_schema from './table_9_transaction-attachments'
import { transactionAttachments } from './table_9_transaction-attachments'

export const schema = {
  ...accounts_schema,
  ...attachments_schema,
  ...budgets_schema,
  ...categories_schema,
  ...currencies_schema,
  ...exchangeRates_schema,
  ...transactions_schema,
  ...userPreferences_schema,
  ...transactionAttachments_schema,
  ...events_schema,
  ...relations
}

export {
  accounts,
  attachments,
  budgets,
  categories,
  currencies,
  events,
  exchangeRates,
  transactionAttachments,
  transactions,
  userPreferences
}

// table_1_currencies
export type CurrencySelectPg = typeof currencies.$inferSelect

// table_2_exchange-rates
export type ExchangeRateSelectPg = typeof exchangeRates.$inferSelect

// table_3_user-preferences
export const userPreferencesInsertSchemaPg = createInsertSchema(userPreferences)
export const userPreferencesUpdateSchemaPg = createUpdateSchema(userPreferences)
export type UserPreferenceSelectPg = typeof userPreferences.$inferSelect
export type UserPreferenceInsertPg = typeof userPreferences.$inferInsert

// table_4_categories
export const categoriesInsertSchemaPg = createInsertSchema(categories)
export const categoriesUpdateSchemaPg = createUpdateSchema(categories)
export type CategorySelectPg = typeof categories.$inferSelect
export type CategoryInsertPg = typeof categories.$inferInsert

// table_5_budgets
export const budgetsInsertSchemaPg = createInsertSchema(budgets)
export const budgetsUpdateSchemaPg = createUpdateSchema(budgets)
export type BudgetSelectPg = typeof budgets.$inferSelect
export type BudgetInsertPg = typeof budgets.$inferInsert

// table_6_accounts
export const accountsInsertSchemaPg = createInsertSchema(accounts)
export const accountsUpdateSchemaPg = createUpdateSchema(accounts)
export type AccountSelectPg = typeof accounts.$inferSelect
export type AccountInsertPg = typeof accounts.$inferInsert

// table_7_transactions
export const transactionsInsertSchemaPg = createInsertSchema(transactions)
export const transactionsUpdateSchemaPg = createUpdateSchema(transactions)
export type TransactionSelectPg = typeof transactions.$inferSelect
export type TransactionInsertPg = typeof transactions.$inferInsert

// table_8_attachments
export const attachmentsInsertSchemaPg = createInsertSchema(attachments)
export const attachmentsUpdateSchemaPg = createUpdateSchema(attachments)
export type AttachmentSelectPg = typeof attachments.$inferSelect
export type AttachmentInsertPg = typeof attachments.$inferInsert

// table_9_transaction-attachments
export const transactionAttachmentsInsertSchemaPg = createInsertSchema(
  transactionAttachments
)
export const transactionAttachmentsUpdateSchemaPg = createUpdateSchema(
  transactionAttachments
)
export type TransactionAttachmentSelectPg =
  typeof transactionAttachments.$inferSelect
export type TransactionAttachmentInsertPg =
  typeof transactionAttachments.$inferInsert

// table_10_events
export const eventsInsertSchemaPg = createInsertSchema(events)
export const eventsUpdateSchemaPg = createUpdateSchema(events)
export type EventSelectPg = typeof events.$inferSelect
export type EventInsertPg = typeof events.$inferInsert
