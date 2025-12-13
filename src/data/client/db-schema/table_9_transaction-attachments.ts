/*
================================================================================
TRANSACTION ATTACHMENTS SCHEMA - Junction Table for Document Links
================================================================================
Purpose: Manages the many-to-many relationship between transactions and their
         attachments (receipts, voice messages). Allows multiple transactions
         to reference the same attachment and one transaction to have multiple
         attachments.

Key Features:
- Many-to-many relationship management
- UUID primary key for PowerSync compatibility
- Direct user_id for efficient PowerSync filtering
- User isolation through direct user ownership

PowerSync Limitations (JSON-based views):
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
import { clerkUserIdColumn, createdAtColumn, uuidPrimaryKey } from './utils'

// ============================================================================
// Transaction attachments table - Many-to-many transaction ↔ attachment links
// ============================================================================

/**
 * Junction table linking transactions to their attachments
 * Many-to-many relationship: one transaction can have multiple attachments,
 * one attachment can be referenced by multiple transactions
 *
 * Business Rules (enforced in application, not SQLite):
 * - Each transaction-attachment pair can only exist once
 * - Direct user ownership for efficient PowerSync filtering
 * - User_id is denormalized from transaction for PowerSync compatibility
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(), // UUID primary key for PowerSync compatibility
  userId: clerkUserIdColumn(), // Denormalized user_id for PowerSync filtering
  transactionId: text('transaction_id').notNull(), // Transaction reference (FK not enforced)
  attachmentId: text('attachment_id').notNull(), // Attachment reference (FK not enforced)
  createdAt: createdAtColumn() // Link creation timestamp
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('transaction_attachments_user_idx').on(table.userId),
  index('transaction_attachments_transaction_idx').on(table.transactionId),
  index('transaction_attachments_attachment_idx').on(table.attachmentId)
]

export const transactionAttachments = sqliteTable(
  'transaction_attachments',
  columns,
  extraConfig
)

export const getTransactionAttachmentsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Transaction attachment insert schema.
 * Basic validation - uniqueness is enforced in application code.
 *
 * IMPORTANT: When creating a transaction-attachment mutation, you MUST also validate:
 * - Transaction exists and belongs to user (FK validation)
 * - Attachment exists and belongs to user (FK validation)
 * - Unique constraint: transaction_attachments_unique (transactionId, attachmentId)
 */
export const transactionAttachmentInsertSchema = createInsertSchema(
  transactionAttachments,
  {
    id: s => s.default(randomUUID),
    createdAt: s => s.default(new Date())
  }
)

export type TransactionAttachmentInsertSchemaInput = z.input<
  typeof transactionAttachmentInsertSchema
>
export type TransactionAttachmentInsertSchemaOutput = z.output<
  typeof transactionAttachmentInsertSchema
>

export const transactionAttachmentUpdateSchema = createUpdateSchema(
  transactionAttachments
).omit({ id: true, userId: true, createdAt: true })

export type TransactionAttachmentUpdateSchemaInput = z.input<
  typeof transactionAttachmentUpdateSchema
>
export type TransactionAttachmentUpdateSchemaOutput = z.output<
  typeof transactionAttachmentUpdateSchema
>
