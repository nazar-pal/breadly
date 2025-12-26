import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { makeSchema } from './make-schema'
import { moveData } from './move-data'

export async function switchToSyncedSchema(
  powersync: AbstractPowerSyncDatabase,
  userId: string
) {
  if (powersync.connected) await powersync.disconnect()
  await powersync.updateSchema(makeSchema(true))
  sessionPersistentStore.getState().setSyncEnabled(true)

  await moveData(powersync, userId, 'inactive_local', true)
}
