import { env } from '@/env'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as relations from './schema/relations'
import * as currencies_schema from './schema/table_1_currencies'
import * as exchangeRates_schema from './schema/table_2_exchange-rates'
import * as userPreferences_schema from './schema/table_3_user-preferences'
import * as categories_schema from './schema/table_4_categories'
import * as budgets_schema from './schema/table_5_budgets'
import * as accounts_schema from './schema/table_6_accounts'
import * as transactions_schema from './schema/table_7_transactions'
import * as attachments_schema from './schema/table_8_attachments'
import * as transactionAttachments_schema from './schema/table_9_transaction-attachments'

const schema = {
  ...accounts_schema,
  ...attachments_schema,
  ...budgets_schema,
  ...categories_schema,
  ...currencies_schema,
  ...exchangeRates_schema,
  ...transactions_schema,
  ...userPreferences_schema,
  ...transactionAttachments_schema,
  ...relations
}

// start TODO: remove this once we have a proper serverless db
// import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless'
// const db = drizzleServerless(env.DATABASE_AUTHENTICATED_URL, {
//   schema,
//   casing: 'snake_case'
// })
// export { db }
// end TODO

export const db = drizzle(neon(env.DATABASE_AUTHENTICATED_URL), {
  schema,
  casing: 'snake_case'
})
