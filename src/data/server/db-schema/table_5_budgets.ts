/*
================================================================================
BUDGETS SCHEMA - Recurring Spending Limits
================================================================================
Purpose: Manages user budget tracking for categories, allowing users to set
         recurring spending limits per category with monthly or yearly periods.

Key Features:
- Category-based budget tracking
- Monthly and yearly budget periods
- Year + month based period identification (no date ambiguity)
- User-specific budgets with multi-tenant isolation
- Only one active budget per category+currency
- Unique budget constraints per category+currency+period
- Integration with transaction categorization for spending analysis
- Row-level security for data protection
================================================================================
*/

import { sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import {
  check,
  index,
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core'
import { currencies } from './table_1_currencies'
import { categories } from './table_4_categories'
import {
  clerkUserIdColumn,
  createdAtColumn,
  isArchivedColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  updatedAtColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Budget Period Enum
// ============================================================================

/**
 * Budget recurrence periods
 * - monthly: Budget resets each calendar month
 * - yearly: Budget resets each calendar year
 */
export const budgetPeriod = pgEnum('budget_period', ['monthly', 'yearly'])

// ============================================================================
// Budgets table - Category-based spending limits
// ============================================================================

/**
 * Budget tracking for categories
 * Allows users to set recurring spending limits per category
 *
 * Business Rules:
 * - Each budget belongs to a specific user (multi-tenant isolation)
 * - Budgets are tied to specific categories for granular control
 * - Only one active budget per category+currency at any time
 * - Budget amounts must be positive values
 * - startMonth must be 1-12, startYear must be 1970-2100
 * - Yearly budgets must have startMonth = 1 (January)
 * - Budget periods are calendar-based (no custom anchoring)
 * - Archived budgets are hidden but preserve historical data
 * - When changing budget amount: archive old, create new with new startYear/startMonth
 */
export const budgets = pgTable(
  'budgets',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    categoryId: uuid()
      .references(() => categories.id, { onDelete: 'cascade' })
      .notNull(), // Category this budget applies to
    amount: monetaryAmountColumn(), // Budget limit amount per period
    currency: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .notNull(), // Budget currency
    period: budgetPeriod().notNull(), // 'monthly' or 'yearly'
    startYear: smallint().notNull(), // Year this budget config takes effect (e.g., 2024)
    startMonth: smallint().notNull(), // Month this budget config takes effect (1-12)
    isArchived: isArchivedColumn(), // Soft deletion flag
    archivedAt: timestamp({ withTimezone: true }), // When the budget was archived
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  table => [
    // Performance indexes for common query patterns
    index('budgets_user_idx').on(table.userId), // User's budgets lookup
    index('budgets_category_idx').on(table.categoryId), // Category budgets lookup
    index('budgets_user_archived_idx').on(table.userId, table.isArchived), // Active budgets only

    // Only ONE active budget per category+currency at any time
    uniqueIndex('budgets_category_currency_active_unq')
      .on(table.categoryId, table.currency)
      .where(sql`${table.isArchived} = false`),

    // No duplicate periods for same category+currency (even archived)
    uniqueIndex('budgets_category_currency_period_unq').on(
      table.categoryId,
      table.currency,
      table.startYear,
      table.startMonth
    ),

    // Business rule constraints
    check('budgets_positive_amount', sql`${table.amount} > 0`), // Budget amounts must be positive
    check(
      'budgets_valid_month',
      sql`${table.startMonth} >= 1 AND ${table.startMonth} <= 12`
    ), // Month must be 1-12
    check(
      'budgets_valid_year',
      sql`${table.startYear} >= 1970 AND ${table.startYear} <= 2100`
    ), // Year must be reasonable
    check(
      'budgets_yearly_starts_january',
      sql`${table.period} != 'yearly' OR ${table.startMonth} = 1`
    ), // Yearly budgets must start in January

    // RLS: Users can only access their own budgets
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
