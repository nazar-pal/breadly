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
- Unique naming within user+parent scope
================================================================================
*/

import { sql } from 'drizzle-orm'
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon'
import {
  check,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'
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
// Categories table - Hierarchical transaction classification
// ============================================================================

/**
 * Category types for transaction classification
 * - expense: Money going out (groceries, rent, utilities, entertainment)
 * - income: Money coming in (salary, freelance, investments, gifts)
 */
export const categoryType = pgEnum('category_type', ['expense', 'income'])

/**
 * Hierarchical transaction categories (income/expense classification)
 * Supports parent-child relationships for nested categorization
 *
 * Business Rules:
 * - Categories belong to individual users (multi-tenant isolation)
 * - Categories can have parent-child relationships for organization
 * - Category names must be unique within user+parent scope
 * - Self-referencing parent relationships are prevented
 * - Categories cannot be deleted if they have child categories
 * - Archived categories are hidden but preserve historical data
 *
 * Archive Columns Design:
 * ─────────────────────────────────────────────────────
 * `is_archived` and `archived_at` are intentionally independent columns.
 * When a user unarchives a category, performs no operations, then re-archives it,
 * the original `archived_at` timestamp is preserved. This is intentional behavior
 * to maintain historical archive timestamps.
 */
export const categories = pgTable(
  'categories',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: categoryType().notNull(), // Income or expense category classification
    parentId: uuid(), // Self-reference for hierarchy (null = root category)
    name: nameColumn(), // Category display name
    description: descriptionColumn(), // Optional user notes about the category
    icon: varchar({ length: 50 }).notNull().default('circle'), // Lucide icon name for UI
    sortOrder: integer('sort_order').notNull().default(1000),
    isArchived: isArchivedColumn(), // Soft deletion flag
    archivedAt: timestamp({ withTimezone: true }),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  table => [
    // Self-referencing foreign key for hierarchy
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'categories_parent_id_fk'
    }).onDelete('restrict'), // Prevent deletion of parent category if it has children

    // Essential indexes (server-side operations only)
    index('categories_user_idx').on(table.userId), // PowerSync sync queries
    index('categories_parent_idx').on(table.parentId), // FK ON DELETE RESTRICT lookups

    // Unique constraint: same name per user+parent
    // Uses nullsNotDistinct() to ensure NULL parent_id values are treated as equal,
    // preventing duplicate root category names per user
    unique('categories_user_parent_name_unq')
      .on(table.userId, table.parentId, table.name)
      .nullsNotDistinct(),
    // Business rule constraints
    check('categories_name_not_empty', sql`length(trim(${table.name})) > 0`), // Non-empty names
    check(
      'categories_no_self_parent',
      sql`${table.parentId} IS NULL OR ${table.parentId} != ${table.id}`
    ), // Prevent self-referencing

    // RLS: Users can only access their own categories
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId)
    })
  ]
)
