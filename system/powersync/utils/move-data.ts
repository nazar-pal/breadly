import {
  accounts,
  attachments,
  budgets,
  categories,
  getAccountsSqliteTable,
  getAttachmentsSqliteTable,
  getBudgetsSqliteTable,
  getCategoriesSqliteTable,
  getTransactionAttachmentsSqliteTable,
  getTransactionsSqliteTable,
  getUserPreferencesSqliteTable,
  sqliteSchema,
  transactionAttachments,
  transactions,
  userPreferences
} from '@/data/client/db-schema'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { eq, getTableName } from 'drizzle-orm'

/*
================================================================================
Move Data Utilities
================================================================================
Provides functionality to move user data between active tables and inactive 
storage tables (inactive_local_* and inactive_synced_*).

This is useful for switching between synced and local-only modes, allowing
data to be preserved when users sign in/out or change sync preferences.
*/

// ---- Inactive table mapping ----

const inactiveFactories = [
  [userPreferences, getUserPreferencesSqliteTable],
  [categories, getCategoriesSqliteTable],
  [budgets, getBudgetsSqliteTable],
  [accounts, getAccountsSqliteTable],
  [transactions, getTransactionsSqliteTable],
  [attachments, getAttachmentsSqliteTable],
  [transactionAttachments, getTransactionAttachmentsSqliteTable]
] as const

type InactiveTableInput = (typeof inactiveFactories)[number][0]

type InactiveReturn<T extends InactiveTableInput> = ReturnType<
  Extract<(typeof inactiveFactories)[number], readonly [T, any]>[1]
>

/**
 * Returns the typed inactive sqlite table for the given base table.
 *
 * @typeParam T - Base sqlite table type from the client schema
 * @param table - Base table (e.g., `userPreferences`, `categories`)
 * @param namePrefix - Prefix for the inactive table name ('inactive_local' or 'inactive_synced')
 * @returns The corresponding inactive sqlite table with proper types
 * @throws Error if the table is not recognized
 */
function inactive<T extends InactiveTableInput>(
  table: T,
  namePrefix: 'inactive_local' | 'inactive_synced'
): InactiveReturn<T> {
  const tableName = namePrefix + '_' + getTableName(table)
  const entry = inactiveFactories.find(([key]) => key === table)
  if (!entry) throw new Error('Invalid table')
  const factory = entry[1] as (name: string) => unknown
  return factory(tableName) as InactiveReturn<T>
}

/**
 * Moves user data from inactive storage tables to active tables.
 *
 * This operation:
 * 1. Copies all data for the specified user from inactive tables to active tables
 * 2. Deletes the data from the inactive tables (cleanup)
 *
 * @param powerSyncDb - PowerSync database instance
 * @param userId - ID of the user whose data should be moved
 * @param moveFrom - Source inactive table prefix ('inactive_local' or 'inactive_synced')
 * @param deleteInactiveTables - Whether to delete the inactive tables after copying the data
 */
export async function moveData(
  powerSyncDb: AbstractPowerSyncDatabase,
  userId: string,
  moveFrom: 'inactive_local' | 'inactive_synced',
  deleteInactiveTables: boolean = true
) {
  const db = wrapPowerSyncWithDrizzle(powerSyncDb, {
    schema: sqliteSchema
  })

  await db.transaction(async tx => {
    // Define the order of tables to ensure referential integrity
    const tablesInCopyOrder = [
      userPreferences, // Table 3: User Preferences
      categories, // Table 4: Categories
      budgets, // Table 5: Budgets
      accounts, // Table 6: Accounts
      transactions, // Table 7: Transactions
      attachments, // Table 8: Attachments
      transactionAttachments // Table 9: Transaction Attachments
    ] as const

    // 1) Copy user data from inactive tables to active tables
    for (const baseTable of tablesInCopyOrder) {
      const inactiveTable = inactive(baseTable, moveFrom)
      const rows = await tx
        .select()
        .from(inactiveTable)
        .where(eq(inactiveTable.userId, userId))
      if (rows.length) {
        await tx.insert(baseTable).values(rows)
      }
    }

    if (deleteInactiveTables) {
      // 2) Clean up by deleting all data from the inactive tables
      for (const baseTable of tablesInCopyOrder) {
        const inactiveTable = inactive(baseTable, moveFrom)
        await tx.delete(inactiveTable).where(eq(inactiveTable.userId, userId))
      }
    }
  })
}
