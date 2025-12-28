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
