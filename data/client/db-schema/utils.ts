import { integer, real, text } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'expo-crypto'

// user ID column for PowerSync (no auth.user_id() function in SQLite)
export const clerkUserIdColumn = () => text('user_id', { length: 50 }).notNull()

// ISO 4217 currency code column (3-character codes like USD, EUR)
export const isoCurrencyCodeColumn = (columnName?: string) =>
  columnName
    ? text(columnName, { length: 3 }).notNull()
    : text({ length: 3 }).notNull()

export const uuidPrimaryKey = () => text().$defaultFn(randomUUID).primaryKey()

// real number for currency amounts (SQLite uses REAL for decimal numbers)
// Note: SQLite doesn't have precise decimal types, consider storing as integers (cents)
export const monetaryAmountColumn = (columnName?: string) =>
  columnName ? real(columnName).notNull() : real().notNull()

export const createdAtColumn = () =>
  integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())

// soft deletion (archiving) for categories and accounts
export const isArchivedColumn = () =>
  integer('is_archived', { mode: 'boolean' }).default(false).notNull()

// required name and optional description columns (categories and accounts)
export const nameColumn = () => text({ length: 100 }).notNull()
export const descriptionColumn = () => text({ length: 1000 })
