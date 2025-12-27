import { VALIDATION } from '@/data/const'
import { parseDateString, toDateString } from '@/lib/utils'
import { customType, integer, text } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'expo-crypto'

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

// ============================================================================
// TIMESTAMP TYPES (ISO 8601 TEXT)
// ============================================================================
// Timestamps are stored as ISO 8601 text matching PowerSync's native sync
// format for Postgres timestamptz: 'YYYY-MM-DD hh:mm:ss.sssZ' (space separator).
// This format is human-readable and works directly with SQLite date/time functions.

/**
 * Timestamp stored as ISO 8601 text (UTC).
 * Format: 'YYYY-MM-DD hh:mm:ss.sssZ' (matches PowerSync sync format)
 * Use for: created_at, updated_at
 */
export const timestampText = customType<{
  data: Date
  driverData: string
}>({
  dataType() {
    return 'text'
  },
  toDriver(value) {
    // Match PowerSync's format: 'YYYY-MM-DD hh:mm:ss.sssZ' (space instead of T)
    return value.toISOString().replace('T', ' ')
  },
  fromDriver(value) {
    // Handle both formats: 'YYYY-MM-DD hh:mm:ss.sssZ' and 'YYYY-MM-DDTHH:mm:ss.sssZ'
    return new Date(value.replace(' ', 'T'))
  }
})

/**
 * Nullable timestamp for optional fields (archived_at, uploaded_at).
 */
export const timestampTextNullable = customType<{
  data: Date | null
  driverData: string | null
}>({
  dataType() {
    return 'text'
  },
  toDriver(value: Date | null | undefined): string | null {
    if (value == null) return null
    // Match PowerSync's format: 'YYYY-MM-DD hh:mm:ss.sssZ' (space instead of T)
    return value.toISOString().replace('T', ' ')
  },
  fromDriver(value: string | null | undefined): Date | null {
    if (value == null) return null
    // Handle both formats: 'YYYY-MM-DD hh:mm:ss.sssZ' and 'YYYY-MM-DDTHH:mm:ss.sssZ'
    return new Date(value.replace(' ', 'T'))
  }
})

export const createdAtColumn = () =>
  timestampText('created_at')
    .notNull()
    .$defaultFn(() => new Date())

export const updatedAtColumn = () =>
  timestampText('updated_at')
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

// ============================================================================
// DATE-ONLY TYPES (YYYY-MM-DD TEXT)
// ============================================================================
// Date-only fields represent calendar dates without time components.
// They are stored as 'YYYY-MM-DD' TEXT strings in SQLite and synced as-is
// via PowerSync. The string is the source of truth, not the Date object.
//
// ARCHITECTURE DECISION: LOCAL TIME APPROACH
// ───────────────────────────────────────────────────────────────────────────
// We use LOCAL timezone for Date <-> string conversion on the client.
// This is intentional for user-facing dates like transaction dates:
//
// - When a user picks "December 25th" from a date picker, we store '2024-12-25'
// - The Date object is created at midnight LOCAL time for convenience
// - Display always shows the correct calendar date regardless of timezone
//
// OFFLINE SYNC SAFETY:
// - PowerSync syncs the raw string ('2024-12-25'), not the Date object
// - If a user creates a transaction on Dec 25 offline and syncs the next day,
//   the date remains Dec 25 because the string is preserved
// - Timezone changes don't affect stored dates
//
// ⚠️  WARNING: NEVER use .toISOString() on date-only Date objects!
// It converts to UTC which may shift the date. Use toDateString() instead.
//
// SERVER HANDLING:
// - Server uses Date.UTC() when parsing dates for Postgres compatibility
// - Postgres `date` columns only store the date portion, so UTC midnight works
// - The string format 'YYYY-MM-DD' is preserved in the roundtrip

/**
 * Date-only column for calendar dates (e.g., transaction date, due date).
 *
 * STORAGE: 'YYYY-MM-DD' TEXT (ISO 8601 date only)
 *
 * TIMEZONE: Uses LOCAL time for Date object creation.
 * - toDriver: Extracts year/month/day using local getters
 * - fromDriver: Creates Date at midnight LOCAL time
 *
 * This ensures that when a user selects a calendar date, that exact date
 * is stored regardless of their timezone.
 *
 * ⚠️  The returned Date object should NOT be serialized with .toISOString()
 * as this may shift the date due to UTC conversion. Use toDateString() helper.
 */
export const dateOnlyText = customType<{
  data: Date
  driverData: string
}>({
  dataType() {
    return 'text'
  },
  toDriver(value) {
    return toDateString(value)
  },
  fromDriver(value) {
    return parseDateString(String(value))
  }
})

/**
 * Nullable date-only column for optional calendar dates.
 *
 * Same behavior as dateOnlyText but allows null values.
 * Used for: savings_target_date, debt_due_date, start_date, end_date
 *
 * ⚠️  The returned Date object should NOT be serialized with .toISOString()
 * as this may shift the date due to UTC conversion. Use toDateString() helper.
 */
export const dateOnlyTextNullable = customType<{
  data: Date | null
  driverData: string | null
}>({
  dataType() {
    return 'text'
  },
  toDriver(value: Date | null | undefined): string | null {
    if (value == null) return null
    return toDateString(value)
  },
  fromDriver(value: string | null | undefined): Date | null {
    if (value == null) return null
    return parseDateString(String(value))
  }
})
