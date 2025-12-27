import { sqliteSchema } from '@/data/client/db-schema'
import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { OPSqliteOpenFactory } from '@powersync/op-sqlite'
import { PowerSyncDatabase } from '@powersync/react-native'
import { makeSchema } from './utils'

export const dbName = 'powersync_v111.db'
const { syncEnabled } = sessionPersistentStore.getState()

const opSqlite = new OPSqliteOpenFactory({ dbFilename: dbName })

export const powersync = new PowerSyncDatabase({
  schema: makeSchema(syncEnabled),
  database: opSqlite
})

export const db = wrapPowerSyncWithDrizzle(powersync, {
  schema: sqliteSchema
})
