/*
================================================================================
BUDGETS SCHEMA - Spending Limits & Financial Goals
================================================================================
Purpose: Manages user budget tracking for categories, allowing users to set
         spending limits and track progress against financial goals across
         different time periods.

Key Features:
- Category-based budget tracking
- User-specific budgets with multi-tenant isolation
- Start/end date range for budget periods
- Integration with transaction categorization for spending analysis

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
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
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
 * Business Rules (enforced via Zod/application, not SQLite):
 * - Each budget belongs to a specific user (multi-tenant isolation)
 * - Budgets are tied to specific categories for granular control
 * - Only one budget per category+currency+start date+end date combination
 * - Budget amounts must be positive values
 * - Start dates define when the budget period begins
 * - Budget tracking compares actual spending against these limits
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  categoryId: text('category_id').notNull(), // Category this budget applies to (FK not enforced)
  amount: monetaryAmountColumn(), // Budget limit amount
  currency: isoCurrencyCodeColumn('currency').notNull(), // Budget currency (FK not enforced)
  startDate: dateOnlyText('start_date').notNull(), // When this budget period starts (YYYY-MM-DD TEXT)
  endDate: dateOnlyText('end_date').notNull() // When this budget period ends (YYYY-MM-DD TEXT)
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('budgets_user_idx').on(table.userId), // User's budgets lookup
  index('budgets_category_idx').on(table.categoryId) // Category budgets lookup
]

export const budgets = sqliteTable('budgets', columns, extraConfig)

export const getBudgetsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
// Business rules are enforced here since PowerSync JSON-based views
// do not support CHECK constraints.

/**
 * Budget insert schema with business rule validations.
 * PowerSync's JSON-based views do not enforce constraints,
 * so Zod is used to validate input data in application code.
 */
export const budgetInsertSchema = createInsertSchema(budgets, {
  // Budget amount must be positive
  amount: schema =>
    schema.refine(val => val > 0, 'Budget amount must be positive')
})
  // End date must be after or equal to start date
  .refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be after or equal to start date',
    path: ['endDate']
  })

export const budgetUpdateSchema = createUpdateSchema(budgets, {
  // Budget amount must be positive (if provided)
  amount: schema =>
    schema.refine(
      val => val === undefined || val > 0,
      'Budget amount must be positive'
    )
})
