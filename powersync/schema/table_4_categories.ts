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
import {
  check,
  foreignKey,
  index,
  sqliteTable,
  text,
  uniqueIndex
} from 'drizzle-orm/sqlite-core'
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
 * - Category types: 'expense' or 'income'
 */
export const categories = sqliteTable(
  'categories',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: text({ enum: CATEGORY_TYPE }).notNull(), // Income or expense category classification
    parentId: text('parent_id'), // Self-reference for hierarchy (null = root category)
    name: nameColumn(), // Category display name
    description: descriptionColumn(), // Optional user notes about the category
    icon: text({ length: 50 }).notNull().default('circle'), // Lucide icon name for UI
    isArchived: isArchivedColumn(), // Soft deletion flag
    createdAt: createdAtColumn()
  },
  table => [
    // Self-referencing foreign key for hierarchy
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'categories_parent_id_fk'
    }).onDelete('cascade'), // Cascade deletion to prevent orphaned categories

    // Performance indexes for common query patterns
    index('categories_user_idx').on(table.userId), // User's categories lookup
    index('categories_parent_idx').on(table.parentId), // Child categories lookup
    index('categories_user_archived_idx').on(table.userId, table.isArchived), // Active categories only
    index('categories_user_type_idx').on(table.userId, table.type), // Categories by type

    // Unique constraint: same name per user+parent (null parent duplicates allowed)
    uniqueIndex('categories_user_parent_name_unq').on(
      table.userId,
      table.parentId,
      table.name
    ),

    // Business rule constraints
    check('categories_name_not_empty', sql`length(trim(${table.name})) > 0`), // Non-empty names
    check(
      'categories_no_self_parent',
      sql`${table.parentId} IS NULL OR ${table.parentId} != ${table.id}`
    ) // Prevent self-referencing
  ]
)
