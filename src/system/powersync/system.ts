import { sqliteSchema } from '@/data/client/db-schema'
import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { OPSqliteOpenFactory } from '@powersync/op-sqlite' // Add this import
import { PowerSyncDatabase } from '@powersync/react-native'
import { makeSchema } from './utils'

export const dbName = 'powersync_v102.db'
const { syncEnabled } = sessionPersistentStore.getState()

// Create the factory
const opSqlite = new OPSqliteOpenFactory({
  dbFilename: dbName
})

export const powerSyncDb = new PowerSyncDatabase({
  // The schema you defined in the previous step
  schema: makeSchema(syncEnabled),
  // For other options see,
  // https://powersync-ja.github.io/powersync-js/web-sdk/globals#powersyncopenfactoryoptions
  database: opSqlite
})

// This is the DB you will use in queries
export const db = wrapPowerSyncWithDrizzle(powerSyncDb, {
  schema: sqliteSchema
})
