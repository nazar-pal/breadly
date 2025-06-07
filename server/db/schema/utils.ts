import { sql } from 'drizzle-orm'
import { boolean, numeric, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// user ID with default clerk authentication (neon RLS)
export const clerkUserIdColumn = () =>
  varchar({ length: 50 })
    .default(sql`(auth.user_id())`)
    .notNull()

// ISO 4217 currency code column (3-character codes like USD, EUR)
export const isoCurrencyCodeColumn = () => varchar({ length: 3 }).notNull()

export const uuidPrimaryKey = () => uuid().defaultRandom().primaryKey()

// numeric column with 14 digits total, 2 decimal places
// suitable for currency amounts up to 999,999,999,999.99
export const monetaryAmountColumn = () =>
  numeric({ precision: 14, scale: 2 }).notNull()

export const createdAtColumn = () =>
  timestamp({ withTimezone: true }).defaultNow().notNull()

// soft deletion (archiving) for categories and accounts
export const isArchivedColumn = () => boolean().default(false).notNull()

// required name and optional description columns (categories and accounts)
export const nameColumn = () => varchar({ length: 100 }).notNull()
export const descriptionColumn = () => varchar({ length: 1000 })
