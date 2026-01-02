import { sqliteSchema } from '@/data/client/db-schema'
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver'
import { OPSqliteOpenFactory } from '@powersync/op-sqlite'
import {
  createBaseLogger,
  LogLevel,
  PowerSyncDatabase
} from '@powersync/react-native'
import * as Sentry from '@sentry/react-native'
import { makeSchema } from './schema'

export const dbName = 'powersync_v201.db'

const opSqlite = new OPSqliteOpenFactory({ dbFilename: dbName })

// Create logger at module level for PowerSync
const logger = createBaseLogger()
logger.useDefaults()
logger.setLevel(__DEV__ ? LogLevel.DEBUG : LogLevel.WARN)

// Add custom handler to route errors to Sentry in production
logger.setHandler(
  (messages: unknown[], context: { level?: { name: string } } | undefined) => {
    if (!context?.level) return

    const level = context.level.name.toLowerCase()
    const messageArray = Array.from(messages)
    const mainMessage = String(messageArray[0] || 'PowerSync log')

    // Always log to console
    if (level === 'error' || level === 'warn') {
      console[level as 'error' | 'warn'](
        `[PowerSync] ${mainMessage}`,
        ...messageArray.slice(1)
      )
    } else if (__DEV__) {
      console.log(`[PowerSync] ${mainMessage}`, ...messageArray.slice(1))
    }

    // Send errors and warnings to Sentry in production
    if (!__DEV__ && (level === 'error' || level === 'warn')) {
      Sentry.addBreadcrumb({
        category: 'powersync',
        message: mainMessage,
        level: level as Sentry.SeverityLevel,
        timestamp: Date.now() / 1000
      })
    }
  }
)

// Note: Schema will be updated dynamically via updateSchema()
// Initial schema doesn't matter as it will be replaced
export const powersync = new PowerSyncDatabase({
  schema: makeSchema(false), // Start with local-only schema
  database: opSqlite,
  logger
})

// Register status listener for sync diagnostics (per PowerSync production best practices)
powersync.registerListener({
  statusChanged: status => {
    // Log download errors
    if (status.dataFlowStatus?.downloadError) {
      const error = status.dataFlowStatus.downloadError
      console.error('[PowerSync] Download error:', error)

      if (!__DEV__) {
        Sentry.captureException(error, {
          tags: { context: 'powersync:download' },
          extra: {
            connected: status.connected,
            lastSyncedAt: status.lastSyncedAt,
            hasSynced: status.hasSynced
          }
        })
      }
    }

    // Log upload errors
    if (status.dataFlowStatus?.uploadError) {
      const error = status.dataFlowStatus.uploadError
      console.error('[PowerSync] Upload error:', error)

      if (!__DEV__) {
        Sentry.captureException(error, {
          tags: { context: 'powersync:upload' },
          extra: {
            connected: status.connected,
            lastSyncedAt: status.lastSyncedAt,
            hasSynced: status.hasSynced
          }
        })
      }
    }

    // Log sync status changes in dev
    if (__DEV__) {
      console.log('[PowerSync] Status:', {
        connected: status.connected,
        connecting: status.connecting,
        hasSynced: status.hasSynced,
        lastSyncedAt: status.lastSyncedAt,
        downloading: status.dataFlowStatus?.downloading,
        uploading: status.dataFlowStatus?.uploading
      })
    }
  }
})

export const db = wrapPowerSyncWithDrizzle(powersync, {
  schema: sqliteSchema
})
