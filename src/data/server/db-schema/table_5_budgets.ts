/*
================================================================================
BUDGETS SCHEMA - Category Spending Limits
================================================================================
Purpose: Manages user budget tracking for categories. Each budget row represents
         a spending limit for ONE specific period (month or year).

Key Features:
- One row = one budget for one period (simple and explicit)
- Monthly budgets: year + month identifies the period
- Yearly budgets: year only (month is NULL)
- Client creates new budget rows for each period (can be automated)
- Timezone-agnostic (integers only, no timestamps for business logic)
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
  unique,
  uuid
} from 'drizzle-orm/pg-core'
import { currencies } from './table_1_currencies'
import { categories } from './table_4_categories'
import {
  clerkUserIdColumn,
  createdAtColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  updatedAtColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Budget Period Enum
// ============================================================================

/**
 * Budget period types
 * - monthly: Budget for a specific month (budget_month required)
 * - yearly: Budget for a whole year (budget_month must be NULL)
 */
export const budgetPeriod = pgEnum('budget_period', ['monthly', 'yearly'])

// ============================================================================
// Budgets table - Category spending limits per period
// ============================================================================

/**
 * Budget tracking for categories
 * Each row is a budget for ONE specific period (month or year)
 *
 * DESIGN PHILOSOPHY:
 * ─────────────────────────────────────────────────────
 * Simple and explicit: one row = one budget for one period.
 * No complex validity ranges or archiving semantics.
 *
 * PERIOD IDENTIFICATION:
 *   - Monthly: budget_year + budget_month (e.g., 2024 + 3 = March 2024)
 *   - Yearly: budget_year only, budget_month = NULL (e.g., 2024 = all of 2024)
 *
 * QUERY EXAMPLES:
 *   Find monthly budget for Food in March 2024:
 *     WHERE category_id = X AND budget_year = 2024 AND budget_month = 3
 *
 *   Find yearly budget for Food in 2024:
 *     WHERE category_id = X AND budget_year = 2024 AND budget_month IS NULL
 *
 * WORKFLOW:
 *   1. User sets $500 monthly budget for "Food" in Jan 2024
 *   2. Client creates: {budget_year: 2024, budget_month: 1, amount: 500}
 *   3. When February starts, client can auto-create February budget
 *      (copy from previous month or use a template)
 *   4. User can adjust individual months as needed
 *
 * Business Rules:
 * - Each budget belongs to a specific user (multi-tenant isolation)
 * - One budget per category + currency + year + month combination
 * - Monthly budgets: budget_month must be 1-12
 * - Yearly budgets: budget_month must be NULL
 * - Budget amounts must be positive values
 * - budget_year must be 1970-2100
 */
export const budgets = pgTable(
  'budgets',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    categoryId: uuid()
      .references(() => categories.id, { onDelete: 'restrict' })
      .notNull(), // Category this budget applies to
    amount: monetaryAmountColumn(), // Budget limit for this period
    currency: isoCurrencyCodeColumn()
      .references(() => currencies.code)
      .notNull(), // Budget currency
    period: budgetPeriod().notNull(), // 'monthly' or 'yearly'

    // Period identification (timezone-agnostic integers)
    budgetYear: smallint('budget_year').notNull(), // The year (e.g., 2024)
    budgetMonth: smallint('budget_month'), // The month 1-12 (NULL for yearly budgets)

    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  table => [
    // Essential indexes (server-side operations only)
    index('budgets_user_idx').on(table.userId), // PowerSync sync queries
    index('budgets_category_idx').on(table.categoryId), // FK ON DELETE RESTRICT lookups

    // One budget per category + currency + period
    // Uses nullsNotDistinct() to ensure NULL budget_month values are treated as equal,
    // preventing duplicate yearly budgets (where budget_month is NULL) for same category/currency/year
    unique('budgets_category_currency_period_unq')
      .on(table.categoryId, table.currency, table.budgetYear, table.budgetMonth)
      .nullsNotDistinct(),

    // Business rule constraints
    check('budgets_positive_amount', sql`${table.amount} > 0`),
    check(
      'budgets_valid_year',
      sql`${table.budgetYear} >= 1970 AND ${table.budgetYear} <= 2100`
    ),

    // Monthly budgets must have month 1-12, yearly budgets must have NULL month
    check(
      'budgets_monthly_has_month',
      sql`${table.period} != 'monthly' OR (${table.budgetMonth} >= 1 AND ${table.budgetMonth} <= 12)`
    ),
    check(
      'budgets_yearly_no_month',
      sql`${table.period} != 'yearly' OR ${table.budgetMonth} IS NULL`
    ),

    // RLS: Users can only access their own budgets
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
