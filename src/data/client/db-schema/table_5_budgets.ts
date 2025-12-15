/*
================================================================================
BUDGETS SCHEMA - Recurring Spending Limits
================================================================================
Purpose: Manages user budget tracking for categories, allowing users to set
         recurring spending limits per category with monthly or yearly periods.

Key Features:
- Category-based budget tracking
- Monthly and yearly budget periods
- Year + month based period identification
- User-specific budgets with multi-tenant isolation

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

import type { BuildColumns } from 'drizzle-orm/column-builder'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  isArchivedColumn,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  roundToTwoDecimals,
  updatedAtColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Budget Period Type
// ============================================================================

/**
 * Budget recurrence periods
 * - monthly: Budget resets each calendar month
 * - yearly: Budget resets each calendar year
 */
export const BUDGET_PERIOD = ['monthly', 'yearly'] as const
export type BudgetPeriod = (typeof BUDGET_PERIOD)[number]

// ============================================================================
// Budgets table - Category-based spending limits
// ============================================================================

/**
 * Budget tracking for expense categories
 * Allows users to set recurring spending limits per category
 *
 * Business Rules (enforced via Zod/application, not SQLite):
 * - Each budget belongs to a specific user (multi-tenant isolation)
 * - Budgets can ONLY be created for expense categories (not income)
 * - Budgets are tied to specific categories for granular control
 * - Only one active budget per category+currency at any time
 * - Budget amounts must be positive values
 * - startMonth must be 1-12, startYear must be 1970-2100
 * - Yearly budgets must have startMonth = 1 (January)
 * - Archived budgets are hidden but preserve historical data
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  categoryId: text('category_id').notNull(), // Category this budget applies to (FK not enforced)
  amount: monetaryAmountColumn(), // Budget limit amount per period
  currency: isoCurrencyCodeColumn('currency').notNull(), // Budget currency (FK not enforced)
  period: text({ enum: BUDGET_PERIOD }).notNull(), // 'monthly' or 'yearly'
  startYear: integer('start_year').notNull(), // Year this budget config takes effect (e.g., 2024)
  startMonth: integer('start_month').notNull(), // Month this budget config takes effect (1-12)
  isArchived: isArchivedColumn(), // Soft deletion flag
  archivedAt: integer('archived_at', { mode: 'timestamp_ms' }), // When the budget was archived
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn()
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('budgets_user_idx').on(table.userId),
  index('budgets_category_idx').on(table.categoryId),
  index('budgets_is_archived_idx').on(table.isArchived)
]

export const budgets = sqliteTable('budgets', columns, extraConfig)

export const getBudgetsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Minimum valid year for budgets
 */
const MIN_YEAR = 1970

/**
 * Maximum valid year for budgets
 */
const MAX_YEAR = 2100

/**
 * Budget insert schema with business rule validations.
 *
 * Server CHECK constraints replicated:
 * - budgets_positive_amount: amount > 0
 * - budgets_valid_month: startMonth >= 1 AND startMonth <= 12
 * - budgets_valid_year: startYear >= 1970 AND startYear <= 2100
 * - budgets_yearly_starts_january: period != 'yearly' OR startMonth = 1
 * - NUMERIC(14,2) precision: rounded to 2 decimal places
 *
 * IMPORTANT: When creating a budget mutation, you MUST also validate:
 * - Category exists and belongs to user (FK + ownership validation)
 * - Category is of type 'expense' (server trigger enforces this)
 * - Category is not archived (business rule)
 * - Currency exists (FK validation)
 * - Unique constraint: budgets_category_currency_active_unq (only one active per category+currency)
 * - Unique constraint: budgets_category_currency_period_unq (no duplicate periods)
 */
export const budgetInsertSchema = createInsertSchema(budgets, {
  id: s => s.default(randomUUID),
  amount: s => s.positive().transform(roundToTwoDecimals),
  currency: s => s.trim().length(3),
  startYear: s => s.int().min(MIN_YEAR).max(MAX_YEAR),
  startMonth: s => s.int().min(1).max(12)
})
  .omit({ archivedAt: true, createdAt: true, updatedAt: true })
  // Yearly budgets must start in January
  .refine(data => data.period !== 'yearly' || data.startMonth === 1, {
    message: 'Yearly budgets must start in January (month = 1)',
    path: ['startMonth']
  })

export type BudgetInsertSchemaInput = z.input<typeof budgetInsertSchema>
export type BudgetInsertSchemaOutput = z.output<typeof budgetInsertSchema>

/**
 * Budget update schema with business rule validations.
 *
 * Only amount and isArchived can be updated.
 * To change period, startYear, startMonth, categoryId, or currency:
 * archive the current budget and create a new one.
 */
export const budgetUpdateSchema = createUpdateSchema(budgets, {
  amount: s => s.positive().transform(roundToTwoDecimals)
}).omit({
  id: true,
  userId: true,
  categoryId: true,
  currency: true,
  period: true,
  startYear: true,
  startMonth: true,
  archivedAt: true,
  createdAt: true,
  updatedAt: true
})

export type BudgetUpdateSchemaInput = z.input<typeof budgetUpdateSchema>
export type BudgetUpdateSchemaOutput = z.output<typeof budgetUpdateSchema>
