/**
 * Convert snake_case string to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Transform PowerSync data to PostgreSQL-compatible format
 * Handles:
 * 1. Universal field name mapping (snake_case → camelCase)
 * 2. Timestamp conversion (Unix milliseconds → Date objects)
 * 3. Enum value mapping (text → PostgreSQL enums)
 */
export function transformDataForPostgres(data: any, table: string): any {
  if (!data || typeof data !== 'object') return data

  const transformed: any = {}

  // ---------------------------------------------------------------------
  // Field mappings per table
  // ---------------------------------------------------------------------
  const timestampFields: Record<string, string[]> = {
    categories: ['created_at'],
    budgets: ['created_at'],
    accounts: ['created_at'],
    transactions: ['created_at'],
    attachments: ['created_at'],
    transaction_attachments: ['created_at'],
    user_preferences: []
  }

  // Date fields (date only - need YYYY-MM-DD string format)
  const dateFields: Record<string, string[]> = {
    budgets: ['start_date', 'end_date'],
    accounts: ['savings_target_date', 'debt_due_date'],
    transactions: ['tx_date'],
    categories: [],
    attachments: [],
    transaction_attachments: [],
    user_preferences: []
  }

  // Boolean columns that come from SQLite as 0/1 integers
  const booleanFields: Record<string, string[]> = {
    categories: ['is_archived'],
    budgets: ['is_active'], // (future-proof, not present in current schema)
    accounts: ['is_archived', 'debt_is_owed_to_me'],
    transactions: ['is_recurring'],
    attachments: [],
    transaction_attachments: [],
    user_preferences: []
  }

  // Decimal / numeric columns that come from SQLite as numbers but must be strings for Postgres numeric columns
  const numericFields: Record<string, string[]> = {
    budgets: ['amount'],
    accounts: ['balance', 'savings_target_amount', 'debt_initial_amount'],
    transactions: ['amount'],
    attachments: [],
    categories: [],
    transaction_attachments: [],
    user_preferences: []
  }

  const timestampFieldsForTable = timestampFields[table] || []
  const dateFieldsForTable = dateFields[table] || []
  const booleanFieldsForTable = booleanFields[table] || []
  const numericFieldsForTable = numericFields[table] || []

  // ---------------------------------------------------------------------
  // 1) Convert snake_case → camelCase and handle timestamps/dates immediately
  // ---------------------------------------------------------------------
  for (const [key, value] of Object.entries(data)) {
    const camelKey = snakeToCamel(key)

    // Timestamp conversion: Unix millis → Date object
    if (
      timestampFieldsForTable.includes(key) &&
      typeof value === 'number' &&
      !Number.isNaN(value)
    ) {
      transformed[camelKey] = new Date(value)
      continue
    }

    // Date conversion: Unix millis → YYYY-MM-DD string
    if (
      dateFieldsForTable.includes(key) &&
      typeof value === 'number' &&
      !Number.isNaN(value)
    ) {
      transformed[camelKey] = new Date(value).toISOString().split('T')[0]
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

  // ---------------------------------------------------------------------
  // 3) Numeric conversion (number → string for numeric columns)
  // ---------------------------------------------------------------------
  for (const camelKey of numericFieldsForTable.map(snakeToCamel)) {
    if (camelKey in transformed) {
      const v = transformed[camelKey]
      if (typeof v === 'number' && !Number.isNaN(v)) {
        transformed[camelKey] = v.toString()
      }
    }
  }

  // ---------------------------------------------------------------------
  // 4) Enum sanitisation (already existed – kept intact)
  // ---------------------------------------------------------------------
  if (table === 'categories' && transformed.type) {
    const validTypes = ['expense', 'income']
    if (!validTypes.includes(transformed.type)) {
      transformed.type = 'expense'
    }
  }

  if (table === 'transactions' && transformed.type) {
    const validTypes = ['expense', 'income', 'transfer']
    if (!validTypes.includes(transformed.type)) {
      transformed.type = 'expense'
    }
  }

  return transformed
}
