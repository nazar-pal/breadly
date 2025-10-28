import { getCurrenciesSqliteTable, sqliteSchema } from '@/data/client/db-schema'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { getTableName } from 'drizzle-orm'

/**
 * Copy the latest synced currencies into the local-only currencies table.
 *
 * Safe to call regardless of current mode; if the destination table doesn't
 * exist in the current schema, this will no-op.
 */
export async function copySyncedCurrenciesToLocal(
  powerSyncDb: AbstractPowerSyncDatabase
) {
  const db = wrapPowerSyncWithDrizzle(powerSyncDb, { schema: sqliteSchema })

  const baseName = getTableName(sqliteSchema.currencies)
  const inactiveSyncedName = `inactive_synced_${baseName}`
  const inactiveLocalName = `inactive_local_${baseName}`

  const inactiveSynced = getCurrenciesSqliteTable(inactiveSyncedName)
  const inactiveLocal = getCurrenciesSqliteTable(inactiveLocalName)

  // Strategy:
  // 1) Prefer copying from the inactive_synced_* table into the active local table
  //    (this is the case right after switching schema to local-only mode).
  // 2) If that source isn't available, fall back to copying from active synced
  //    currencies into the inactive_local_* table (useful if called before switching).

  // Attempt 1: inactive_synced_* -> active local (sqliteSchema.currencies in local-only mode)
  try {
    const rowsFromInactiveSynced = await db.select().from(inactiveSynced)
    if (rowsFromInactiveSynced.length > 0) {
      await db.transaction(async tx => {
        await tx.delete(sqliteSchema.currencies)
        await tx.insert(sqliteSchema.currencies).values(rowsFromInactiveSynced)
      })
      return
    }
  } catch {
    // Table may not exist in current schema; ignore and fall back
  }

  // Attempt 2: active synced -> inactive_local_* (called while still in synced mode)
  try {
    const rowsFromActiveSynced = await db.select().from(sqliteSchema.currencies)
    if (rowsFromActiveSynced.length > 0) {
      await db.transaction(async tx => {
        await tx.delete(inactiveLocal)
        await tx.insert(inactiveLocal).values(rowsFromActiveSynced)
      })
    }
  } catch (err) {
    // Destination may not exist in current schema; ignore
    if (__DEV__) {
      console.warn('copySyncedCurrenciesToLocal fallback skipped:', err)
    }
  }
}
