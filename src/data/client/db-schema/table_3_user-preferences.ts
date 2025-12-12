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

PowerSync Client Adaptations:
- Additional 'id' field: PowerSync requires primary key to be named 'id'
- PostgreSQL uses 'user_id' as PK, PowerSync sync rules alias it as 'id'
- Both 'id' and 'userId' exist in SQLite for proper queries and relationships
- Enables standard PowerSync conflict resolution and sync patterns

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Foreign key references are NOT enforced
- Default values must be handled in application code
================================================================================
*/

import type { BuildColumns } from 'drizzle-orm/column-builder'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { clerkUserIdColumn, isoCurrencyCodeColumn } from './utils'

// ============================================================================
// User preferences table - User-specific application settings
// ============================================================================

/**
 * User-specific application preferences and settings
 * Controls UI behavior, localization, and default values
 *
 * Business Rules (enforced via Zod, not SQLite):
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

const columns = {
  id: text().primaryKey(), // PowerSync-required primary key (aliased from 'user_id')
  userId: clerkUserIdColumn().notNull(), // Original user_id field for relationships
  defaultCurrency: isoCurrencyCodeColumn('default_currency'), // Default currency (FK not enforced)
  firstWeekday: integer('first_weekday').default(1), // Week start day (1=Monday, 7=Sunday)
  locale: text({ length: 20 }).default('en-US') // Localization/language code (ISO format)
}

// No indexes needed for this table (single row per user, accessed by id)
const extraConfig = (
  _table: BuildColumns<string, typeof columns, 'sqlite'>
) => []

export const userPreferences = sqliteTable(
  'user_preferences',
  columns,
  extraConfig
)

export const getUserPreferencesSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
// Business rules are enforced here since PowerSync JSON-based views
// do not support CHECK constraints.

/**
 * User preference insert schema with business rule validations.
 * PowerSync's JSON-based views do not enforce constraints,
 * so Zod is used to validate input data in application code.
 */
export const userPreferenceInsertSchema = createInsertSchema(userPreferences, {
  // First weekday must be 1-7 (Monday-Sunday)
  firstWeekday: schema =>
    schema.refine(
      val => val == null || (val >= 1 && val <= 7),
      'First weekday must be between 1 (Monday) and 7 (Sunday)'
    )
})

export const userPreferenceUpdateSchema = createUpdateSchema(userPreferences, {
  // First weekday must be 1-7 (Monday-Sunday)
  firstWeekday: schema =>
    schema.refine(
      val => val === undefined || val == null || (val >= 1 && val <= 7),
      'First weekday must be between 1 (Monday) and 7 (Sunday)'
    )
})
