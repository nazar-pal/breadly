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

import { relations, sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import { check, numeric, pgTable, varchar } from 'drizzle-orm/pg-core'
import { currencies } from '.'
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
export const userPreferences = pgTable(
  'user_preferences',
  {
    userId: clerkUserIdColumn().primaryKey(), // Clerk user ID (one record per user)
    defaultCurrency: isoCurrencyCodeColumn().references(() => currencies.code), // Default currency for new accounts/transactions
    firstWeekday: numeric().default('1'), // Week start day (1=Monday, 2=Tuesday, ..., 7=Sunday)
    locale: varchar({ length: 20 }).default('en-US') // Localization/language code (ISO format)
  },
  table => [
    // Business rule constraints
    check(
      'user_preferences_valid_weekday',
      sql`${table.firstWeekday} >= 1 AND ${table.firstWeekday} <= 7`
    ), // Valid weekday range

    // RLS: Users can only access their own preferences
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)

// ============================================================================
// USER PREFERENCES RELATIONSHIPS
// ============================================================================

/**
 * User preferences relationship mappings
 * Defines connections to currencies for default currency validation
 */
export const userPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    defaultCurrency: one(currencies, {
      fields: [userPreferences.defaultCurrency],
      references: [currencies.code]
    }) // Default currency relationship
  })
)
