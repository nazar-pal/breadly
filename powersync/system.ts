import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { PowerSyncDatabase } from '@powersync/react-native'
import { AppSchema, sqliteSchema } from './schema'

export const powerSyncDb = new PowerSyncDatabase({
  // The schema you defined in the previous step
  schema: AppSchema,
  // For other options see,
  // https://powersync-ja.github.io/powersync-js/web-sdk/globals#powersyncopenfactoryoptions
  database: {
    // Filename for the SQLite database — it's important to only instantiate one instance per file.
    // For other database options see,
    // https://powersync-ja.github.io/powersync-js/web-sdk/globals#sqlopenoptions
    dbFilename: 'powersync_v9.db'
  }
})

// This is the DB you will use in queries
export const db = wrapPowerSyncWithDrizzle(powerSyncDb, {
  schema: sqliteSchema
})
