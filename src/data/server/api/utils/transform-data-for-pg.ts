/**
 * Convert snake_case string to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Parse a 'YYYY-MM-DD' string into a Date at UTC midnight.
 *
 * Server uses UTC (unlike client which uses local time) because:
 * - Postgres `date` columns only store the date portion
 * - UTC midnight ensures consistent date storage regardless of server timezone
 * - The string format is the source of truth for sync
 */
function parseDateStringUTC(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/**
 * Transform PowerSync data to PostgreSQL-compatible format.
 *
 * This function handles data coming from the client (SQLite) to the server (Postgres).
 * PowerSync syncs raw string values, which we convert to proper types for Drizzle/Postgres.
 *
 * Handles:
 * 1. Universal field name mapping (snake_case → camelCase)
 * 2. Timestamp conversion (ISO 8601 strings → Date objects)
 * 3. Date conversion ('YYYY-MM-DD' strings → Date objects at UTC midnight)
 * 4. Boolean conversion (0/1 integers → true/false)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATE HANDLING ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * TIMESTAMPS (created_at, updated_at, archived_at):
 * - Client stores: ISO 8601 string '2024-12-25 10:00:00.000Z' (PowerSync format)
 * - Server receives: Same string from PowerSync
 * - Converted to: new Date(value) - standard JS Date parsing
 * - Postgres stores: timestamptz (with timezone) - always UTC
 *
 * DATE-ONLY FIELDS (tx_date, start_date, due_date):
 * - Client stores: 'YYYY-MM-DD' string (e.g., '2024-12-25')
 * - Server receives: Same string from PowerSync
 * - Converted to: new Date(Date.UTC(y, m-1, d)) - UTC midnight
 * - Postgres stores: date (only date portion, time ignored)
 *
 * WHY UTC FOR DATES ON SERVER?
 * ─────────────────────────────────────────────────────────────────────────────
 * The client uses LOCAL time for Date objects (for UI convenience), but the
 * server uses UTC midnight. This works because:
 *
 * 1. PowerSync syncs the RAW STRING ('2024-12-25'), not the Date object
 * 2. This function parses the string into a Date at UTC midnight
 * 3. Postgres `date` column only stores the date portion (YYYY-MM-DD)
 * 4. When Drizzle sends the Date to Postgres, the date is preserved
 *
 * Example roundtrip:
 *   Client: User picks Dec 25 → stores '2024-12-25' in SQLite
 *   Sync: PowerSync sends '2024-12-25' string to server
 *   Server: This function creates Date.UTC(2024, 11, 25) = Dec 25 00:00:00 UTC
 *   Postgres: Stores 2024-12-25 in date column
 *   Sync back: PowerSync sends '2024-12-25' to client
 *   Client: Stores '2024-12-25' in SQLite → Date at local midnight
 *
 * The date is preserved regardless of timezone because the string is the
 * source of truth, not the Date object.
 */
export function transformDataForPostgres(data: any, table: string): any {
  if (!data || typeof data !== 'object') return data

  const transformed: any = {}

  // ---------------------------------------------------------------------
  // Server-managed fields that clients must NOT send
  // These are automatically set by the database and should be stripped
  // to prevent clients from manipulating audit timestamps
  // ---------------------------------------------------------------------
  const serverManagedFields = ['server_created_at', 'server_updated_at']

  // ---------------------------------------------------------------------
  // Field mappings per table
  // ---------------------------------------------------------------------
  const timestampFields: Record<string, string[]> = {
    categories: ['created_at', 'updated_at', 'archived_at'],
    budgets: ['created_at', 'updated_at'],
    accounts: ['created_at', 'updated_at', 'archived_at'],
    events: ['created_at', 'updated_at', 'archived_at'],
    transactions: ['created_at', 'updated_at'],
    attachments: ['created_at', 'updated_at', 'uploaded_at'],
    transaction_attachments: ['created_at', 'updated_at'],
    user_preferences: ['created_at', 'updated_at']
  }

  // Date-only fields (stored as 'YYYY-MM-DD' strings)
  // These represent calendar dates without time components
  const dateFields: Record<string, string[]> = {
    budgets: [], // No date fields - uses budgetYear/budgetMonth integers
    accounts: ['savings_target_date', 'debt_due_date'],
    events: ['start_date', 'end_date'],
    transactions: ['tx_date'],
    categories: [],
    attachments: [],
    transaction_attachments: [],
    user_preferences: []
  }

  // Boolean columns that come from SQLite as 0/1 integers
  const booleanFields: Record<string, string[]> = {
    categories: ['is_archived'],
    budgets: [],
    accounts: ['is_archived'],
    events: ['is_archived'],
    transactions: [],
    attachments: [],
    transaction_attachments: [],
    user_preferences: []
  }

  const timestampFieldsForTable = timestampFields[table] || []
  const dateFieldsForTable = dateFields[table] || []
  const booleanFieldsForTable = booleanFields[table] || []

  // ---------------------------------------------------------------------
  // 1) Convert snake_case → camelCase and handle timestamps/dates immediately
  // ---------------------------------------------------------------------
  for (const [key, value] of Object.entries(data)) {
    // Strip server-managed fields - clients must not send these
    if (serverManagedFields.includes(key)) {
      continue
    }

    const camelKey = snakeToCamel(key)

    // Timestamp conversion: ISO 8601 string → Date object
    // Client stores timestamps as ISO strings like '2024-12-25 10:00:00.000Z'
    // (PowerSync uses space separator instead of 'T')
    if (timestampFieldsForTable.includes(key) && typeof value === 'string') {
      // new Date() handles both formats: with 'T' or space separator
      transformed[camelKey] = new Date(value)
      continue
    }

    // Date-only fields: 'YYYY-MM-DD' string → Date at UTC midnight
    // We use UTC here because Postgres `date` only stores the date portion.
    // The string is the source of truth; the Date is just for Drizzle type safety.
    if (dateFieldsForTable.includes(key) && typeof value === 'string') {
      transformed[camelKey] = parseDateStringUTC(value)
      continue
    }

    transformed[camelKey] = value
  }

  // ---------------------------------------------------------------------
  // 2) Boolean conversion (0/1 → true/false)
  // ---------------------------------------------------------------------
  for (const camelKey of booleanFieldsForTable.map(snakeToCamel)) {
    if (camelKey in transformed) {
      const v = transformed[camelKey]
      if (typeof v === 'number') transformed[camelKey] = v === 1
      else if (typeof v === 'string') transformed[camelKey] = v === '1'
    }
  }

  return transformed
}
