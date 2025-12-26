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
 */
export const createdAtColumn = () => timestamp({ withTimezone: true }).notNull()
export const updatedAtColumn = () => timestamp({ withTimezone: true }).notNull()

// soft deletion (archiving) for categories and accounts
export const isArchivedColumn = () => boolean().default(false).notNull()

// required name and optional description columns (categories and accounts)
export const nameColumn = () =>
  varchar({ length: VALIDATION.MAX_NAME_LENGTH }).notNull()
export const descriptionColumn = () =>
  varchar({ length: VALIDATION.MAX_DESCRIPTION_LENGTH })
