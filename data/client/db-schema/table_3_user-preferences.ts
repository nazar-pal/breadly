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

PowerSync Client Adaptations:
- Additional 'id' field: PowerSync requires primary key to be named 'id'
- PostgreSQL uses 'user_id' as PK, PowerSync sync rules alias it as 'id'
- Both 'id' and 'userId' exist in SQLite for proper queries and relationships
- Enables standard PowerSync conflict resolution and sync patterns
================================================================================
*/

import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
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
 * - One preference record per user (unique constraint on userId)
 * - Default currency must be a valid currency from the currencies table
 * - First weekday must be between 1-7 (1=Monday, 7=Sunday)
 * - Locale codes follow standard format (e.g., en-US, fr-FR, es-ES)
 * - All preferences have sensible defaults for new users
 * - Preferences persist across user sessions
 *
 * Schema Notes:
 * - PostgreSQL: Primary key is 'user_id' (Clerk user identifier)
 * - SQLite: PowerSync adds 'id' field (aliased from 'user_id' in sync rules)
 * - Both 'id' and 'userId' exist client-side for standard PowerSync operations
 * - Allows proper upsert patterns and relationship queries in SQLite
 */
export const userPreferences = sqliteTable(
  'user_preferences',
  {
    id: text().primaryKey(), // PowerSync-required primary key (aliased from 'user_id')
    userId: clerkUserIdColumn().notNull(), // Original user_id field for relationships
    defaultCurrency: isoCurrencyCodeColumn('default_currency').references(
      () => currencies.code
    ), // Default currency for new accounts/transactions
    firstWeekday: integer('first_weekday').default(1), // Week start day (1=Monday, 2=Tuesday, ..., 7=Sunday)
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
