/*
================================================================================
CATEGORIES SCHEMA - Transaction Classification System
================================================================================
Purpose: Manages hierarchical transaction categories for income and expense
         classification. Supports parent-child relationships for nested
         categorization and organization.

Key Features:
- Hierarchical category structure (parent-child relationships)
- Income and expense category types
- User-specific categories with multi-tenant isolation
- Icon support for visual representation
- Soft deletion with archive functionality

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Foreign key references are NOT enforced (including self-reference)
- Unique indexes are NOT enforced
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)
- Cascade delete behavior is NOT enforced (handled in application code)

Note: The id column is explicitly defined for Drizzle ORM type safety.
================================================================================
*/

import type { BuildColumns } from 'drizzle-orm/column-builder'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  descriptionColumn,
  isArchivedColumn,
  nameColumn,
  uuidPrimaryKey
} from './utils'

// ============================================================================
// Categories table - Hierarchical transaction classification
// ============================================================================

/**
 * Category types for transaction classification
 * - expense: Money going out (groceries, rent, utilities, entertainment)
 * - income: Money coming in (salary, freelance, investments, gifts)
 */
export const CATEGORY_TYPE = ['expense', 'income'] as const
export type CategoryType = (typeof CATEGORY_TYPE)[number]

/**
 * Hierarchical transaction categories (income/expense classification)
 * Supports parent-child relationships for nested categorization
 *
 * Business Rules (enforced via Zod, not SQLite):
 * - Categories belong to individual users (multi-tenant isolation)
 * - Categories can have parent-child relationships for organization
 * - Category names must be unique within user+parent scope (enforced in app)
 * - Self-referencing parent relationships are prevented
 * - Archived categories are hidden but preserve historical data
 * - Category types: 'expense' or 'income'
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  type: text({ enum: CATEGORY_TYPE }).notNull(), // Income or expense category classification
  parentId: text('parent_id'), // Self-reference for hierarchy (null = root category, FK not enforced)
  name: nameColumn(), // Category display name
  description: descriptionColumn(), // Optional user notes about the category
  icon: text({ length: 50 }).notNull().default('circle'), // Lucide icon name for UI
  sortOrder: integer('sort_order').notNull().default(1000),
  isArchived: isArchivedColumn(), // Soft deletion flag
  archivedAt: integer('archived_at', { mode: 'timestamp_ms' }),
  createdAt: createdAtColumn()
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('categories_user_idx').on(table.userId), // User's categories lookup
  index('categories_parent_idx').on(table.parentId), // Child categories lookup
  index('categories_type_idx').on(table.type), // Filter by category type
  index('categories_is_archived_idx').on(table.isArchived) // Filter by archived status
]

export const categories = sqliteTable('categories', columns, extraConfig)

export const getCategoriesSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
// Business rules are enforced here since PowerSync JSON-based views
// do not support CHECK constraints or foreign keys.

/**
 * Category insert schema with business rule validations.
 * PowerSync's JSON-based views do not enforce constraints,
 * so Zod is used to validate input data in application code.
 */
export const categoryInsertSchema = createInsertSchema(categories, {
  // Non-empty name after trimming whitespace
  name: schema =>
    schema.refine(
      name => name.trim().length > 0,
      'Category name cannot be empty'
    )
})
  // Prevent self-referencing parent
  .refine(data => data.parentId == null || data.parentId !== data.id, {
    message: 'Category cannot be its own parent',
    path: ['parentId']
  })

export const categoryUpdateSchema = createUpdateSchema(categories, {
  // Non-empty name after trimming whitespace (when updating name)
  name: schema =>
    schema.refine(
      name => name === undefined || name.trim().length > 0,
      'Category name cannot be empty'
    )
})
