export const TABLES_TO_SYNC = [
  'categories',
  'budgets',
  'accounts',
  'events',
  'transactions',
  'attachments',
  'transaction_attachments',
  'user_preferences'
] as const

// Validation Constants (shared between client and server schemas)
export const VALIDATION = {
  // String lengths
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_NOTES_LENGTH: 1000,
  MAX_ICON_LENGTH: 50,
  MAX_FILE_NAME_LENGTH: 500,
  MAX_MIME_LENGTH: 150,
  MAX_LOCALE_LENGTH: 20,
  CURRENCY_CODE_LENGTH: 3,

  // Monetary
  // Maximum monetary amount in smallest currency unit
  // Limited by JavaScript's Number.MAX_SAFE_INTEGER (2^53 - 1)
  // For 4-decimal currencies: ~900 billion in display units
  // For 2-decimal currencies: ~90 trillion in display units
  MAX_MONETARY_AMOUNT: Number.MAX_SAFE_INTEGER,

  // Date ranges
  MIN_YEAR: 1970,
  MAX_YEAR: 2100,

  // Weekday range
  MIN_WEEKDAY: 1,
  MAX_WEEKDAY: 7
} as const
