/*
================================================================================
USER PREFERENCES SCHEMA - System Configuration & Personalization
================================================================================
Purpose: Manages user-specific application preferences and settings that control
         UI behavior, localization, default values, and personal customization
         options throughout the Breadly application.

Key Features:
- User-specific preference isolation
- Default currency selection for new accounts/transactions
- Week start day customization for calendar displays
- Locale/language preference for internationalization
- Extensible structure for future preference additions
- Row-level security for data protection
================================================================================
*/

import { sql } from 'drizzle-orm'
import { check, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { currencies } from './table_1_currencies'
import { clerkUserIdColumn, isoCurrencyCodeColumn } from './utils'

// ============================================================================
// User preferences table - User-specific application settings
// ============================================================================

/**
 * User-specific application preferences and settings
 * Controls UI behavior, localization, and default values
 *
 * Business Rules:
 * - One preference record per user (userId as primary key)
 * - Default currency must be a valid currency from the currencies table
 * - First weekday must be between 1-7 (1=Monday, 7=Sunday)
 * - Locale codes follow standard format (e.g., en-US, fr-FR, es-ES)
 * - All preferences have sensible defaults for new users
 * - Preferences persist across user sessions
 */
export const userPreferences = sqliteTable(
  'user_preferences',
  {
    userId: clerkUserIdColumn().primaryKey(), // Clerk user ID (one record per user)
    defaultCurrency: isoCurrencyCodeColumn('default_currency').references(
      () => currencies.code
    ), // Default currency for new accounts/transactions
    firstWeekday: real('first_weekday').default(1), // Week start day (1=Monday, 2=Tuesday, ..., 7=Sunday)
    locale: text({ length: 20 }).default('en-US') // Localization/language code (ISO format)
  },
  table => [
    // Business rule constraints
    check(
      'user_preferences_valid_weekday',
      sql`${table.firstWeekday} >= 1 AND ${table.firstWeekday} <= 7`
    ) // Valid weekday range
  ]
)
