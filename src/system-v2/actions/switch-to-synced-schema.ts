import { AbstractPowerSyncDatabase } from '@powersync/react-native'
import { makeSchema, moveData } from '../powersync/schema'

export async function switchToSyncedSchema(
  powersync: AbstractPowerSyncDatabase,
  userId: string
) {
  if (powersync.connected) await powersync.disconnect()
  await powersync.updateSchema(makeSchema(true))

  await moveData(powersync, userId, 'inactive_local', true)
}
