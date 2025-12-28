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

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Foreign key references are NOT enforced
- Unique indexes are NOT enforced (uniqueness handled in application)
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)
- Cascade delete behavior is NOT enforced (handled in application code)

Note: The id column is explicitly defined for Drizzle ORM type safety.
================================================================================
*/

import { VALIDATION } from '@/data/const'
import type { BuildColumns } from 'drizzle-orm/column-builder'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  isoCurrencyCodeColumn,
  updatedAtColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Budget Period Type
// ============================================================================

/**
 * Budget period types
 * - monthly: Budget for a specific month (budget_month required)
 * - yearly: Budget for a whole year (budget_month must be NULL)
 */
export const BUDGET_PERIOD = ['monthly', 'yearly'] as const
export type BudgetPeriod = (typeof BUDGET_PERIOD)[number]

// ============================================================================
// Budgets table - Category spending limits per period
// ============================================================================

/**
 * Budget tracking for expense categories
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
 * Business Rules (enforced via Zod, not SQLite):
 * - Each budget belongs to a specific user (multi-tenant isolation)
 * - Budgets can ONLY be created for expense categories (not income)
 * - One budget per category + currency + year + month combination
 * - Monthly budgets: budget_month must be 1-12
 * - Yearly budgets: budget_month must be NULL
 * - Budget amounts must be positive integers (in smallest currency unit)
 * - budget_year must be 1970-2100
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  categoryId: text('category_id').notNull(), // Category this budget applies to (FK not enforced)
  amount: integer().notNull(), // Budget limit for this period
  currencyId: isoCurrencyCodeColumn('currency_id').notNull(), // Budget currency (FK not enforced)
  period: text({ enum: BUDGET_PERIOD }).notNull(), // 'monthly' or 'yearly'

  // Period identification (timezone-agnostic integers)
  budgetYear: integer('budget_year').notNull(), // The year (e.g., 2024)
  budgetMonth: integer('budget_month'), // The month 1-12 (NULL for yearly budgets)

  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn()
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('budgets_user_idx').on(table.userId),
  index('budgets_category_idx').on(table.categoryId),
  index('budgets_year_idx').on(table.budgetYear),
  index('budgets_period_idx').on(table.period), // Filter by budget period (monthly/yearly)
  index('budgets_currency_id_idx').on(table.currencyId) // Filter by currency
]

export const budgets = sqliteTable('budgets', columns, extraConfig)

export const getBudgetsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Budget insert schema with business rule validations.
 *
 * Server CHECK constraints replicated:
 * - budgets_positive_amount: amount > 0
 * - budgets_valid_year: budget_year >= 1970 AND budget_year <= 2100
 * - budgets_monthly_has_month: monthly budgets have month 1-12
 * - budgets_yearly_no_month: yearly budgets have NULL month
 * - Amount stored as integer in smallest currency unit
 *
 * IMPORTANT - Mutation-Level Validation Required:
 * ─────────────────────────────────────────────────────
 * The following unique constraint cannot be validated at Zod level:
 * - budgets_category_currency_period_unq: (categoryId, currencyId, budgetYear, budgetMonth)
 *
 * Mutations MUST check for existing budgets with the same combination before insert.
 *
 * Additional mutation-level validations required:
 * - Category exists and belongs to user (FK + ownership validation)
 * - Category is of type 'expense' (server trigger enforces this)
 * - Currency exists (FK validation)
 */
export const budgetInsertSchema = createInsertSchema(budgets, {
  id: s => s.default(randomUUID),
  amount: s => s.int().positive().max(VALIDATION.MAX_MONETARY_AMOUNT),
  currencyId: s => s.trim().length(VALIDATION.CURRENCY_CODE_LENGTH),
  budgetYear: s => s.int().min(VALIDATION.MIN_YEAR).max(VALIDATION.MAX_YEAR),
  budgetMonth: s => s.int().min(1).max(12).optional()
})
  .omit({ createdAt: true, updatedAt: true })
  // Monthly budgets must have month 1-12
  .refine(
    data =>
      data.period !== 'monthly' ||
      (data.budgetMonth != null &&
        data.budgetMonth >= 1 &&
        data.budgetMonth <= 12),
    {
      message: 'Monthly budgets must have budgetMonth between 1 and 12',
      path: ['budgetMonth']
    }
  )
  // Yearly budgets must have NULL month
  .refine(data => data.period !== 'yearly' || data.budgetMonth == null, {
    message: 'Yearly budgets must have budgetMonth = null',
    path: ['budgetMonth']
  })

export type BudgetInsertSchemaInput = z.input<typeof budgetInsertSchema>
export type BudgetInsertSchemaOutput = z.output<typeof budgetInsertSchema>

/**
 * Budget update schema with business rule validations.
 *
 * Only amount can be updated.
 * To change year, month, category, or currency: delete and create new.
 */
export const budgetUpdateSchema = createUpdateSchema(budgets, {
  amount: s => s.int().positive().max(VALIDATION.MAX_MONETARY_AMOUNT)
}).omit({
  id: true,
  userId: true,
  categoryId: true,
  currencyId: true,
  period: true,
  budgetYear: true,
  budgetMonth: true,
  createdAt: true,
  updatedAt: true
})

export type BudgetUpdateSchemaInput = z.input<typeof budgetUpdateSchema>
export type BudgetUpdateSchemaOutput = z.output<typeof budgetUpdateSchema>
