/*
================================================================================
EVENTS SCHEMA - Cross-Category Spending Tracking
================================================================================
Purpose: Manages event-based spending tracking, allowing users to group
         transactions across all categories for specific occasions like
         vacations, weddings, home renovations, or business trips.

Key Features:
- Cross-category transaction grouping
- Optional date ranges (informational only, not restrictive)
- Manual archiving when user is done tracking
- Transactions can be linked anytime regardless of event dates

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Foreign key references are NOT enforced
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)

Note: The id column is explicitly defined for Drizzle ORM type safety.
================================================================================
*/

import { VALIDATION } from '@/data/const'
import type { BuildColumns } from 'drizzle-orm/column-builder'
import { index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  dateOnlyText,
  descriptionColumn,
  isArchivedColumn,
  nameColumn,
  updatedAtColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Events table - Cross-category spending tracking
// ============================================================================

/**
 * Events for tracking spending across categories
 * Examples: Vacation, Wedding, Home Renovation, Business Trip
 *
 * DESIGN NOTE - NO EVENT BUDGETS:
 * ─────────────────────────────────────────────────────
 * Events intentionally do NOT have budget fields (budgetAmount, budgetCurrency).
 * This is by design because:
 * - Events group transactions across multiple categories and potentially multiple currencies
 * - Managing event-level budgets with multi-currency transactions adds significant complexity
 * - Total event spending can be calculated dynamically from linked transactions
 * - Users who need budget tracking should use the per-category budgets table instead
 *
 * Business Rules (enforced via Zod/application, not SQLite):
 * - Each event belongs to a specific user (multi-tenant isolation)
 * - Events group transactions across ALL categories
 * - Transactions are explicitly linked via eventId on transactions table
 * - Dates are informational only - transactions can be linked anytime
 * - If both dates exist, endDate must be >= startDate
 * - User manually archives when done tracking
 *
 * Archive Columns Design:
 * ─────────────────────────────────────────────────────
 * `is_archived` and `archived_at` are intentionally independent columns.
 * When a user unarchives an event, performs no operations, then re-archives it,
 * the original `archived_at` timestamp is preserved. This is intentional behavior
 * to maintain historical archive timestamps.
 */
const columns = {
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  name: nameColumn(), // Required: "Italy Vacation", "Wedding"
  description: descriptionColumn(), // Optional notes about the event
  startDate: dateOnlyText('start_date'), // Optional: when event starts (YYYY-MM-DD)
  endDate: dateOnlyText('end_date'), // Optional: when event ends (YYYY-MM-DD)
  isArchived: isArchivedColumn(), // User marks when done tracking
  archivedAt: integer('archived_at', { mode: 'timestamp_ms' }), // When archived
  createdAt: createdAtColumn(), // Record creation timestamp
  updatedAt: updatedAtColumn()
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('events_user_idx').on(table.userId),
  index('events_is_archived_idx').on(table.isArchived),
  index('events_start_date_idx').on(table.startDate)
]

export const events = sqliteTable('events', columns, extraConfig)

export const getEventsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Event insert schema with business rule validations.
 *
 * Server CHECK constraints replicated:
 * - events_valid_date_range: endDate IS NULL OR startDate IS NULL OR endDate >= startDate
 *
 * IMPORTANT: When creating an event mutation, you MUST also validate:
 * - Name is not empty
 */
export const eventInsertSchema = createInsertSchema(events, {
  id: s => s.default(randomUUID),
  name: s => s.trim().min(1).max(VALIDATION.MAX_NAME_LENGTH),
  description: s =>
    s.trim().min(1).max(VALIDATION.MAX_DESCRIPTION_LENGTH).optional()
})
  .omit({ createdAt: true, updatedAt: true })

  // End date must be on or after start date (if both provided)
  .refine(
    data => !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: 'End date must be on or after start date',
      path: ['endDate']
    }
  )

export type EventInsertSchemaInput = z.input<typeof eventInsertSchema>
export type EventInsertSchemaOutput = z.output<typeof eventInsertSchema>

/**
 * Event update schema with business rule validations.
 *
 * Note: Cross-field validation for startDate/endDate cannot be fully validated
 * at schema level for partial updates since we don't know existing values.
 * Full validation should happen in the mutation with merged state.
 */
export const eventUpdateSchema = createUpdateSchema(events, {
  name: s => s.trim().min(1).max(VALIDATION.MAX_NAME_LENGTH),
  description: s => s.trim().min(1).max(VALIDATION.MAX_DESCRIPTION_LENGTH)
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  archivedAt: true,
  updatedAt: true
})

export type EventUpdateSchemaInput = z.input<typeof eventUpdateSchema>
export type EventUpdateSchemaOutput = z.output<typeof eventUpdateSchema>
