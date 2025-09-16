import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { makeSchema } from './make-schema'
import { moveData } from './move-data'

export async function switchToLocalSchema(
  powerSyncDb: AbstractPowerSyncDatabase,
  moveDataToLocalTable?: { userId: string }
) {
  if (powerSyncDb.connected) await powerSyncDb.disconnect()
  await powerSyncDb.updateSchema(makeSchema(false))
  sessionPersistentStore.getState().setSyncEnabled(false)

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
