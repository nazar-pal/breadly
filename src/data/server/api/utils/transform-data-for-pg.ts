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
    categories: ['created_at', 'updated_at', 'archived_at'],
    budgets: ['archived_at', 'created_at', 'updated_at'],
    accounts: ['created_at', 'updated_at', 'archived_at'],
    events: ['created_at', 'updated_at', 'archived_at'],
    transactions: ['created_at', 'updated_at'],
    attachments: ['created_at', 'updated_at', 'uploaded_at'],
    transaction_attachments: ['created_at', 'updated_at'],
    user_preferences: ['created_at', 'updated_at']
  }

  // Date fields (date only - expect 'YYYY-MM-DD' string or unix ms)
  const dateFields: Record<string, string[]> = {
    budgets: [], // No date fields - uses startYear/startMonth integers
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
    budgets: ['is_archived'],
    accounts: ['is_archived'],
    events: ['is_archived'],
    transactions: ['is_recurring'],
    attachments: [],
    transaction_attachments: [],
    user_preferences: []
  }

  // Decimal / numeric columns that come from SQLite as numbers but must be strings for Postgres numeric columns
  const numericFields: Record<string, string[]> = {
    budgets: ['amount'],
    accounts: ['balance', 'savings_target_amount', 'debt_initial_amount'],
    events: [],
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

    // Date conversion: Accept Unix millis and convert to YYYY-MM-DD string; if already string keep as is
    if (
      dateFieldsForTable.includes(key) &&
      ((typeof value === 'number' && !Number.isNaN(value)) ||
        typeof value === 'string')
    ) {
      if (typeof value === 'number') {
        transformed[camelKey] = new Date(value).toISOString().split('T')[0]
      } else {
        // Assume already 'YYYY-MM-DD'
        transformed[camelKey] = value
      }
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
