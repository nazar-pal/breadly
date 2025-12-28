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

import { VALIDATION } from '@/data/const'
import type { BuildColumns } from 'drizzle-orm/column-builder'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { clerkUserIdColumn, createdAtColumn, updatedAtColumn } from './utils'

// ============================================================================
// User preferences table - User-specific application settings
// ============================================================================

/**
 * User-specific application preferences and settings
 * Controls UI behavior, localization, and default values
 *
 * Business Rules (enforced via Zod, not SQLite):
 * - One preference record per user (unique constraint on userId)
 * - First weekday must be between 1-7 (1=Monday, 7=Sunday)
 * - Locale codes follow standard format (e.g., en-US, fr-FR, es-ES)
 *
 * Schema Notes:
 * - PostgreSQL: Primary key is 'user_id' (Clerk user identifier)
 * - SQLite: PowerSync adds 'id' field (aliased from 'user_id' in sync rules)
 */

const columns = {
  id: text().primaryKey(), // PowerSync-required primary key (aliased from 'user_id')
  userId: clerkUserIdColumn().notNull(), // Original user_id field for relationships
  defaultCurrency: text('default_currency', { length: 3 }), // Default currency (nullable, FK not enforced)
  firstWeekday: integer('first_weekday').default(1), // Week start day (1=Monday, 7=Sunday)
  locale: text({ length: 20 }).default('en-US'), // Localization/language code (ISO format)
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn()
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

/**
 * User preference insert schema with business rule validations.
 *
 * Server CHECK constraints replicated:
 * - user_preferences_valid_weekday: firstWeekday between 1 and 7
 */
export const userPreferenceInsertSchema = createInsertSchema(userPreferences, {
  firstWeekday: s =>
    s.min(VALIDATION.MIN_WEEKDAY).max(VALIDATION.MAX_WEEKDAY).default(1),
  locale: s =>
    s.trim().min(2).max(VALIDATION.MAX_LOCALE_LENGTH).default('en-US'),
  defaultCurrency: s =>
    s.trim().toUpperCase().length(VALIDATION.CURRENCY_CODE_LENGTH).optional()
}).omit({ createdAt: true, updatedAt: true })

export type UserPreferenceInsertSchemaInput = z.input<
  typeof userPreferenceInsertSchema
>
export type UserPreferenceInsertSchemaOutput = z.output<
  typeof userPreferenceInsertSchema
>

export const userPreferenceUpdateSchema = createUpdateSchema(userPreferences, {
  firstWeekday: s => s.min(VALIDATION.MIN_WEEKDAY).max(VALIDATION.MAX_WEEKDAY),
  locale: s => s.trim().min(2).max(VALIDATION.MAX_LOCALE_LENGTH),
  defaultCurrency: s =>
    s.trim().toUpperCase().length(VALIDATION.CURRENCY_CODE_LENGTH).optional()
}).omit({ id: true, userId: true, createdAt: true, updatedAt: true })

export type UserPreferenceUpdateSchemaInput = z.input<
  typeof userPreferenceUpdateSchema
>
export type UserPreferenceUpdateSchemaOutput = z.output<
  typeof userPreferenceUpdateSchema
>
