import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { copySyncedCurrenciesToLocal } from './copy-synced-currencies-to-local'
import { ensureCurrenciesSeeded } from './ensure-currencies-seeded'
import { makeSchema } from './make-schema'
import { moveData } from './move-data'

export async function switchToLocalSchema(
  powersync: AbstractPowerSyncDatabase,
  moveDataToLocalTable?: { userId: string }
) {
  if (powersync.connected) await powersync.disconnect()
  await powersync.updateSchema(makeSchema(false))
  sessionPersistentStore.getState().setSyncEnabled(false)

  // Always copy the freshest currencies into the local-only table.
  // This ensures local mode has up-to-date currencies regardless of whether
  // we are moving per-user data.
  await copySyncedCurrenciesToLocal(powersync)

  // Seed defaults only if currencies are still empty (e.g., fresh install).
  await ensureCurrenciesSeeded()

  if (moveDataToLocalTable) {
    await moveData(
      powersync,
      moveDataToLocalTable.userId,
      'inactive_synced',
      false
    )

    await powersync.disconnectAndClear({
      clearLocal: false
    })
  }
}
