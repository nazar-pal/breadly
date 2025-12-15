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
 * Business Rules:
 * - Each event belongs to a specific user (multi-tenant isolation)
 * - Events group transactions across ALL categories (not category-specific)
 * - Transactions are explicitly linked via eventId on transactions table
 * - Dates are informational only - transactions can be linked anytime
 * - If both dates exist, endDate must be >= startDate
 * - User manually archives when done tracking (isArchived = true)
 * - Deleting an event sets eventId to NULL on linked transactions
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
    archivedAt: timestamp({ withTimezone: true }), // When archived
    createdAt: createdAtColumn(), // Record creation timestamp
    updatedAt: updatedAtColumn()
  },
  table => [
    // Performance indexes
    index('events_user_idx').on(table.userId), // User's events lookup
    index('events_user_archived_idx').on(table.userId, table.isArchived), // Active events
    index('events_start_date_idx').on(table.startDate), // Date-based queries

    // Date range validation (if both provided, end >= start)
    check(
      'events_valid_date_range',
      sql`${table.startDate} IS NULL OR ${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`
    ),

    // RLS: Users can only access their own events
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
