import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { PowerSyncDatabase } from '@powersync/react-native'
import { sqliteSchema } from '../db-schema'
import { makeSchema } from './utils'

export const dbName = 'powersync_v101.db'
const { syncEnabled } = sessionPersistentStore.getState()

export const powerSyncDb = new PowerSyncDatabase({
  // The schema you defined in the previous step
  schema: makeSchema(syncEnabled),
  // For other options see,
  // https://powersync-ja.github.io/powersync-js/web-sdk/globals#powersyncopenfactoryoptions
  database: {
    // Filename for the SQLite database — it's important to only instantiate one instance per file.
    // For other database options see,
    // https://powersync-ja.github.io/powersync-js/web-sdk/globals#sqlopenoptions
    dbFilename: dbName
  }
})

// This is the DB you will use in queries
export const db = wrapPowerSyncWithDrizzle(powerSyncDb, {
  schema: sqliteSchema
})
