import { relations } from 'drizzle-orm'
import { currencies } from './table_1_currencies'
import { exchangeRates } from './table_2_exchange-rates'
import { userPreferences } from './table_3_user-preferences'
import { categories } from './table_4_categories'
import { budgets } from './table_5_budgets'
import { accounts } from './table_6_accounts'
import { transactions } from './table_7_transactions'
import { attachments } from './table_8_attachments'
import { transactionAttachments } from './table_9_transaction-attachments'

// Table 1: Currencies - Relationships
export const currenciesRelations = relations(currencies, ({ many }) => ({
  accounts: many(accounts),
  transactions: many(transactions),
  userPreferences: many(userPreferences),
  baseExchangeRates: many(exchangeRates, { relationName: 'baseRates' }),
  quoteExchangeRates: many(exchangeRates, { relationName: 'quoteRates' })
}))

// Table 2: Exchange Rates - Relationships
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

// Table 3: User Preferences - Relationships
export const userPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    defaultCurrency: one(currencies, {
      fields: [userPreferences.defaultCurrency],
      references: [currencies.code]
    }) // Default currency relationship
  })
)

// Table 4: Categories - Relationships
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id]
  }), // Parent category relationship
  children: many(categories), // Child categories relationship
  transactions: many(transactions), // Transactions using this category
  budgets: many(budgets) // Budgets tracking this category
}))

// Table 5: Budgets - Relationships
export const budgetsRelations = relations(budgets, ({ one }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id]
  }) // Category this budget tracks
}))

// Table 6: Accounts - Relationships
export const accountsRelations = relations(accounts, ({ one, many }) => ({
  currency: one(currencies, {
    fields: [accounts.currencyId],
    references: [currencies.code]
  }),
  transactions: many(transactions), // Transactions from this account
  counterTransactions: many(transactions, { relationName: 'counterAccount' }) // Transfers to this account
}))

// Table 7: Transactions - Relationships
export const transactionsRelations = relations(
  transactions,
  ({ one, many }) => ({
    account: one(accounts, {
      fields: [transactions.accountId],
      references: [accounts.id]
    }), // Primary account relationship
    counterAccount: one(accounts, {
      fields: [transactions.counterAccountId],
      references: [accounts.id],
      relationName: 'counterAccount'
    }), // Transfer destination account
    category: one(categories, {
      fields: [transactions.categoryId],
      references: [categories.id]
    }), // Transaction category relationship
    currency: one(currencies, {
      fields: [transactions.currencyId],
      references: [currencies.code]
    }), // Transaction currency relationship
    transactionAttachments: many(transactionAttachments) // Associated attachments (receipts, voice notes)
  })
)

// Table 8: Attachments - Relationships
export const attachmentsRelations = relations(attachments, ({ many }) => ({
  transactions: many(transactions, { relationName: 'transactionAttachments' })
}))

// Table 9: Transaction Attachments - Relationships
export const transactionAttachmentsRelations = relations(
  transactionAttachments,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [transactionAttachments.transactionId],
      references: [transactions.id]
    }), // Transaction that references this attachment
    attachment: one(attachments, {
      fields: [transactionAttachments.attachmentId],
      references: [attachments.id]
    }) // Attachment referenced by this transaction
  })
)
