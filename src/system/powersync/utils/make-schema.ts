import { sqliteSchema as dzSch } from '@/data/client/db-schema'
import { toPowerSyncTable } from '@powersync/drizzle-driver'
import { Schema } from '@powersync/react-native'
import { getTableName } from 'drizzle-orm'
import { AnySQLiteTable } from 'drizzle-orm/sqlite-core'

export function makeSchema(synced: boolean) {
  const syncedName = (table: AnySQLiteTable): string => {
    if (synced) return getTableName(table)
    else return `inactive_synced_${getTableName(table)}` // in the local-only mode of the demo these tables are not used
  }

  const localName = (table: AnySQLiteTable): string => {
    if (synced)
      return `inactive_local_${getTableName(table)}` // in the sync-enabled mode of the demo these tables are not used
    else return getTableName(table)
  }

  // Could iterate over table definitions to create the schema while somehow maintaining type information for record types

  return new Schema({
    // Table 1: Currencies
    // Use dual mapping so locally-seeded currencies never attempt to sync up.
    // In local-only mode, active view is `currencies` (localOnly), and the synced
    // view is parked under `inactive_synced_currencies`. In sync-enabled mode,
    // the active synced view is `currencies`, while the local-only view moves to
    // `inactive_local_currencies`.
    currencies: toPowerSyncTable(dzSch.currencies, {
      viewName: syncedName(dzSch.currencies)
    }),
    local_currencies: toPowerSyncTable(dzSch.currencies, {
      localOnly: true,
      viewName: localName(dzSch.currencies)
    }),
    // Table 2: Exchange Rates
    exchangeRates: toPowerSyncTable(dzSch.exchangeRates),

    // Table 3: User Preferences
    user_preferences: toPowerSyncTable(dzSch.userPreferences, {
      viewName: syncedName(dzSch.userPreferences)
    }),
    local_user_preferences: toPowerSyncTable(dzSch.userPreferences, {
      localOnly: true,
      viewName: localName(dzSch.userPreferences)
    }),

    // Table 4: Categories
    categories: toPowerSyncTable(dzSch.categories, {
      viewName: syncedName(dzSch.categories)
    }),
    local_categories: toPowerSyncTable(dzSch.categories, {
      localOnly: true,
      viewName: localName(dzSch.categories)
    }),

    // Table 5: Budgets
    budgets: toPowerSyncTable(dzSch.budgets, {
      viewName: syncedName(dzSch.budgets)
    }),
    local_budgets: toPowerSyncTable(dzSch.budgets, {
      localOnly: true,
      viewName: localName(dzSch.budgets)
    }),

    // Table 6: Accounts
    accounts: toPowerSyncTable(dzSch.accounts, {
      viewName: syncedName(dzSch.accounts)
    }),
    local_accounts: toPowerSyncTable(dzSch.accounts, {
      localOnly: true,
      viewName: localName(dzSch.accounts)
    }),

    // Table 7: Transactions
    transactions: toPowerSyncTable(dzSch.transactions, {
      viewName: syncedName(dzSch.transactions)
    }),
    local_transactions: toPowerSyncTable(dzSch.transactions, {
      localOnly: true,
      viewName: localName(dzSch.transactions)
    }),

    // Table 8: Attachments
    attachments: toPowerSyncTable(dzSch.attachments, {
      viewName: syncedName(dzSch.attachments)
    }),
    local_attachments: toPowerSyncTable(dzSch.attachments, {
      localOnly: true,
      viewName: localName(dzSch.attachments)
    }),

    // Table 9: Transaction Attachments
    transaction_attachments: toPowerSyncTable(dzSch.transactionAttachments, {
      viewName: syncedName(dzSch.transactionAttachments)
    }),
    local_transaction_attachments: toPowerSyncTable(
      dzSch.transactionAttachments,
      {
        localOnly: true,
        viewName: localName(dzSch.transactionAttachments)
      }
    )
  })
}
