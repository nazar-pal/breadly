import { VALIDATION } from '@/data/const'
import { customType, integer, real, text } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'expo-crypto'

// ============================================================================
// ZOD HELPERS
// ============================================================================

/**
 * Rounds a number to 2 decimal places.
 * Matches server's NUMERIC(14,2) precision.
 * Use with .transform() on amount fields.
 */
export const roundToTwoDecimals = (value: number): number => {
  if (!Number.isFinite(value)) return value
  return Math.round(value * 100) / 100
}

// ============================================================================
// COLUMN DEFINITIONS
// ============================================================================

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

export const updatedAtColumn = () =>
  integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date())

// soft deletion (archiving) for categories and accounts
export const isArchivedColumn = () =>
  integer('is_archived', { mode: 'boolean' }).default(false).notNull()

// required name and optional description columns (categories and accounts)
export const nameColumn = () =>
  text({ length: VALIDATION.MAX_NAME_LENGTH }).notNull()
export const descriptionColumn = () =>
  text({ length: VALIDATION.MAX_DESCRIPTION_LENGTH })

// Date-only TEXT column that maps to a Date in app code while storing 'YYYY-MM-DD'
export const dateOnlyText = customType<{
  data: Date
  driverData: string
}>({
  dataType() {
    return 'text'
  },
  toDriver(value) {
    if (!value) return value as unknown as string
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },
  fromDriver(value) {
    if (!value) return value as unknown as Date
    // Expect 'YYYY-MM-DD'. Build Date in local time to avoid timezone shifts
    const [y, m, d] = String(value).split('-').map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
  }
})
