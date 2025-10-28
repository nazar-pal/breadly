import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { copySyncedCurrenciesToLocal } from './copy-synced-currencies-to-local'
import { ensureCurrenciesSeeded } from './ensure-currencies-seeded'
import { makeSchema } from './make-schema'
import { moveData } from './move-data'

export async function switchToLocalSchema(
  powerSyncDb: AbstractPowerSyncDatabase,
  moveDataToLocalTable?: { userId: string }
) {
  if (powerSyncDb.connected) await powerSyncDb.disconnect()
  await powerSyncDb.updateSchema(makeSchema(false))
  sessionPersistentStore.getState().setSyncEnabled(false)

  // Always copy the freshest currencies into the local-only table.
  // This ensures local mode has up-to-date currencies regardless of whether
  // we are moving per-user data.
  await copySyncedCurrenciesToLocal(powerSyncDb)

  // Seed defaults only if currencies are still empty (e.g., fresh install).
  await ensureCurrenciesSeeded()

  if (moveDataToLocalTable) {
    await moveData(
      powerSyncDb,
      moveDataToLocalTable.userId,
      'inactive_synced',
      false
    )

    await powerSyncDb.disconnectAndClear({
      clearLocal: false
    })
  }
}
