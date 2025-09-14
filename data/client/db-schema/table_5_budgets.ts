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
import type { BuildColumns } from 'drizzle-orm/column-builder'
import {
  check,
  index,
  sqliteTable,
  text,
  uniqueIndex
} from 'drizzle-orm/sqlite-core'
import { currencies } from './table_1_currencies'
import { categories } from './table_4_categories'
import {
  clerkUserIdColumn,
  dateOnlyText,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Budgets table - Category-based spending limits
// ============================================================================

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
 * - Budget periods: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
 */
const columns = {
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  categoryId: text('category_id')
    .references(() => categories.id, { onDelete: 'cascade' })
    .notNull(), // Category this budget applies to
  amount: monetaryAmountColumn(), // Budget limit amount
  currency: isoCurrencyCodeColumn('currency')
    .references(() => currencies.code)
    .notNull(), // Budget currency (e.g., USD in USD/EUR)
  startDate: dateOnlyText('start_date').notNull(), // When this budget period starts (stored as YYYY-MM-DD TEXT)
  endDate: dateOnlyText('end_date').notNull() // When this budget period ends (stored as YYYY-MM-DD TEXT)
}

const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  // Performance indexes for common query patterns
  index('budgets_user_idx').on(table.userId), // User's budgets lookup
  index('budgets_category_idx').on(table.categoryId), // Category budgets lookup

  // Prevent duplicate budgets for same category+start date+end date
  uniqueIndex('budgets_category_start_end_unq').on(
    table.categoryId,
    table.currency,
    table.startDate,
    table.endDate
  ),

  // Business rule constraints
  check('budgets_positive_amount', sql`${table.amount} > 0`) // Budget amounts must be positive
]

export const budgets = sqliteTable('budgets', columns, extraConfig)

export const getBudgetsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)
