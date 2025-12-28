import { VALIDATION } from '@/data/const'
import { sql } from 'drizzle-orm'
import { boolean, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// user ID with default clerk authentication (neon RLS)
export const clerkUserIdColumn = () =>
  varchar({ length: 50 })
    .default(sql`(auth.user_id())`)
    .notNull()

// ISO 4217 currency code column (3-character codes like USD, EUR)
export const isoCurrencyCodeColumn = () =>
  varchar({ length: VALIDATION.CURRENCY_CODE_LENGTH }).notNull()
export const isoCurrencyCodeColumnNullable = () =>
  varchar({ length: VALIDATION.CURRENCY_CODE_LENGTH })

export const uuidPrimaryKey = () => uuid().defaultRandom().primaryKey()

/**
 * Timestamp columns for record tracking.
 *
 * IMPORTANT: These columns intentionally have NO server-side defaults.
 * In our offline-first architecture, timestamps represent when data was
 * created/updated on the client device, not when it was synced to the server.
 * The client always provides these values during sync operations.
 *
 * PRECISION: We use precision: 3 (milliseconds) to match JavaScript's Date
 * precision. PostgreSQL supports up to microseconds (precision: 6) by default,
 * but JavaScript Date only has millisecond precision. This ensures the stored
 * value exactly matches what the client sends.
 */
export const createdAtColumn = () =>
  timestamp({ withTimezone: true, precision: 3 }).notNull()
export const updatedAtColumn = () =>
  timestamp({ withTimezone: true, precision: 3 }).notNull()

/**
 * Server-side timestamp columns for tracking when data arrives at the server.
 *
 * These columns are SERVER-ONLY and NOT synced to clients. They capture:
 * - server_created_at: When the server received and stored the record
 * - server_updated_at: When the server last processed an update
 *
 * USE CASE: In offline-first apps, client timestamps (created_at, updated_at)
 * represent when the user performed the action on their device. Server timestamps
 * capture when that data actually reached the server, which may be hours or days
 * later if the user was offline.
 *
 * This enables:
 * - Audit trails proving when server received data
 * - Sync debugging (comparing client vs server timestamps)
 * - Analytics on offline user behavior patterns
 */
export const serverCreatedAtColumn = () =>
  timestamp('server_created_at', { withTimezone: true }).notNull().defaultNow()

export const serverUpdatedAtColumn = () =>
  timestamp('server_updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())

// soft deletion (archiving) for categories and accounts
export const isArchivedColumn = () => boolean().default(false).notNull()

// required name and optional description columns (categories and accounts)
export const nameColumn = () =>
  varchar({ length: VALIDATION.MAX_NAME_LENGTH }).notNull()
export const descriptionColumn = () =>
  varchar({ length: VALIDATION.MAX_DESCRIPTION_LENGTH })
