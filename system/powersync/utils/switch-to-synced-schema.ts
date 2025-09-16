import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { makeSchema } from './make-schema'
import { moveData } from './move-data'

export async function switchToSyncedSchema(
  powerSyncDb: AbstractPowerSyncDatabase,
  userId: string
) {
  if (powerSyncDb.connected) await powerSyncDb.disconnect()
  await powerSyncDb.updateSchema(makeSchema(true))
  sessionPersistentStore.getState().setSyncEnabled(true)

  await moveData(powerSyncDb, userId, 'inactive_local', true)
}
