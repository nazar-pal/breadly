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
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'
import {
  clerkUserIdColumn,
  dateOnlyText,
  isoCurrencyCodeColumn,
  monetaryAmountColumn,
  roundToTwoDecimals,
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
 * - End date must be after or equal to start date
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
  index('budgets_user_idx').on(table.userId),
  index('budgets_category_idx').on(table.categoryId)
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
 * - NUMERIC(14,2) precision: rounded to 2 decimal places
 *
 * IMPORTANT: When creating a budget mutation, you MUST also validate:
 * - Category exists and belongs to user (FK validation)
 * - Category is not archived (business rule)
 * - Currency exists (FK validation)
 * - Unique constraint: budgets_category_start_end_unq (categoryId, currency, startDate, endDate)
 */
export const budgetInsertSchema = createInsertSchema(budgets, {
  id: s => s.default(randomUUID),
  amount: s => s.positive().transform(roundToTwoDecimals),
  currency: s => s.trim().length(3)
})
  // End date must be after or equal to start date
  .refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be after or equal to start date',
    path: ['endDate']
  })

export type BudgetInsertSchemaInput = z.input<typeof budgetInsertSchema>
export type BudgetInsertSchemaOutput = z.output<typeof budgetInsertSchema>

/**
 * Budget update schema with business rule validations.
 *
 * Note: Cross-field validation for startDate/endDate cannot be fully validated
 * at schema level for partial updates since we don't know existing values.
 * Full validation should happen in the mutation with merged state.
 */
export const budgetUpdateSchema = createUpdateSchema(budgets, {
  amount: s => s.positive().transform(roundToTwoDecimals),
  currency: s => s.trim().length(3)
}).omit({
  id: true,
  userId: true,
  startDate: true,
  endDate: true,
  categoryId: true,
  currency: true
})

export type BudgetUpdateSchemaInput = z.input<typeof budgetUpdateSchema>
export type BudgetUpdateSchemaOutput = z.output<typeof budgetUpdateSchema>
