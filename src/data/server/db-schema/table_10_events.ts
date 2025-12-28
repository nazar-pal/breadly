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
- Multi-tenant isolation with row-level security
================================================================================
*/

import { sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import { check, date, index, pgTable, timestamp } from 'drizzle-orm/pg-core'
import {
  clerkUserIdColumn,
  createdAtColumn,
  descriptionColumn,
  isArchivedColumn,
  nameColumn,
  serverCreatedAtColumn,
  serverUpdatedAtColumn,
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
 * Business Rules:
 * - Each event belongs to a specific user (multi-tenant isolation)
 * - Events group transactions across ALL categories (not category-specific)
 * - Transactions are explicitly linked via eventId on transactions table
 * - Dates are informational only - transactions can be linked anytime
 * - If both dates exist, endDate must be >= startDate
 * - User manually archives when done tracking (isArchived = true)
 * - Deleting an event sets eventId to NULL on linked transactions
 *
 * Archive Columns Design:
 * ─────────────────────────────────────────────────────
 * `is_archived` and `archived_at` are intentionally independent columns.
 * When a user unarchives an event, performs no operations, then re-archives it,
 * the original `archived_at` timestamp is preserved. This is intentional behavior
 * to maintain historical archive timestamps.
 */
export const events = pgTable(
  'events',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    name: nameColumn(), // Required: "Italy Vacation", "Wedding"
    description: descriptionColumn(), // Optional notes about the event
    startDate: date(), // Optional: when event starts (informational)
    endDate: date(), // Optional: when event ends (informational)
    isArchived: isArchivedColumn(), // User marks when done tracking
    archivedAt: timestamp({ withTimezone: true, precision: 3 }), // When archived
    createdAt: createdAtColumn(), // Record creation timestamp
    updatedAt: updatedAtColumn(),
    serverCreatedAt: serverCreatedAtColumn(),
    serverUpdatedAt: serverUpdatedAtColumn()
  },
  table => [
    // Essential indexes (server-side operations only)
    index('events_user_idx').on(table.userId), // PowerSync sync queries

    // Business rule constraints
    check('events_name_not_empty', sql`length(trim(${table.name})) > 0`), // Non-empty names
    check(
      'events_valid_date_range',
      sql`${table.startDate} IS NULL OR ${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`
    ), // Date range validation (if both provided, end >= start)

    // RLS: Users can only access their own events
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
