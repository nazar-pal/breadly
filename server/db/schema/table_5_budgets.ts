/*
================================================================================
BUDGETS SCHEMA - Spending Limits & Financial Goals
================================================================================
Purpose: Manages user budget tracking for categories, allowing users to set
         spending limits and track progress against financial goals across
         different time periods.

Key Features:
- Category-based budget tracking
- Multiple budget periods (daily, weekly, monthly, quarterly, yearly)
- User-specific budgets with multi-tenant isolation
- Unique budget constraints per category+period+start date
- Integration with transaction categorization for spending analysis
- Row-level security for data protection
================================================================================
*/

import { sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import {
  check,
  date,
  index,
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core'
import { categories } from './table_4_categories'
import {
  clerkUserIdColumn,
  monetaryAmountColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Budgets table - Category-based spending limits
// ============================================================================

/**
 * Budget period types for tracking spending limits
 * - daily: Daily budget limits (for strict daily spending control)
 * - weekly: Weekly budget limits (for weekly allowances)
 * - monthly: Monthly budget limits (most common budget period)
 * - quarterly: Quarterly budget limits (for seasonal planning)
 * - yearly: Annual budget limits (for long-term financial planning)
 */
export const budgetPeriod = pgEnum('budget_period', [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly'
])

/**
 * Budget tracking for categories
 * Allows users to set spending limits and track progress
 *
 * Business Rules:
 * - Each budget belongs to a specific user (multi-tenant isolation)
 * - Budgets are tied to specific categories for granular control
 * - Only one budget per category+period+start date combination
 * - Budget amounts must be positive values
 * - Start dates define when the budget period begins
 * - Budget tracking compares actual spending against these limits
 */
export const budgets = pgTable(
  'budgets',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    categoryId: uuid()
      .references(() => categories.id, { onDelete: 'cascade' })
      .notNull(), // Category this budget applies to
    amount: monetaryAmountColumn(), // Budget limit amount
    period: budgetPeriod().default('monthly').notNull(), // Budget time period
    startDate: date().notNull() // When this budget period starts
  },
  table => [
    // Performance indexes for common query patterns
    index('budgets_user_idx').on(table.userId), // User's budgets lookup
    index('budgets_category_idx').on(table.categoryId), // Category budgets lookup
    index('budgets_user_period_idx').on(table.userId, table.period), // Budgets by period

    // Prevent duplicate budgets for same category+period+start date
    uniqueIndex('budgets_category_period_start_unq').on(
      table.categoryId,
      table.period,
      table.startDate
    ),

    // Business rule constraints
    check('budgets_positive_amount', sql`${table.amount} > 0`), // Budget amounts must be positive

    // RLS: Users can only access their own budgets
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
