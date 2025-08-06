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
- Unique constraint for relationship integrity
- User isolation through direct user ownership
- Automatic cleanup on transaction/attachment deletion
================================================================================
*/

import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { transactions } from './table_7_transactions'
import { attachments } from './table_8_attachments'
import { clerkUserIdColumn, createdAtColumn, uuidPrimaryKey } from './utils'

// ============================================================================
// Transaction attachments table - Many-to-many transaction ↔ attachment links
// ============================================================================

/**
 * Junction table linking transactions to their attachments
 * Many-to-many relationship: one transaction can have multiple attachments,
 * one attachment can be referenced by multiple transactions
 *
 * Business Rules:
 * - Each transaction-attachment pair can only exist once (unique constraint)
 * - Direct user ownership for efficient PowerSync filtering
 * - Cascade deletion when transactions or attachments are removed
 * - User_id is denormalized from transaction for PowerSync compatibility
 * - Supports sharing attachments across multiple transactions within user scope
 */
export const transactionAttachments = sqliteTable(
  'transaction_attachments',
  {
    id: uuidPrimaryKey(), // UUID primary key for PowerSync compatibility
    userId: clerkUserIdColumn(), // Denormalized user_id for PowerSync filtering
    transactionId: text('transaction_id')
      .references(() => transactions.id, { onDelete: 'cascade' })
      .notNull(), // Transaction that references the attachment
    attachmentId: text('attachment_id')
      .references(() => attachments.id, { onDelete: 'cascade' })
      .notNull(), // Attachment being referenced
    createdAt: createdAtColumn() // Link creation timestamp
  },
  table => [
    // Unique constraint ensures each transaction-attachment pair exists only once
    uniqueIndex('transaction_attachments_unique').on(
      table.transactionId,
      table.attachmentId
    ),

    // Performance indexes for common queries
    index('transaction_attachments_user_idx').on(table.userId), // User's transaction-attachments
    index('transaction_attachments_transaction_idx').on(table.transactionId), // Transaction's attachments
    index('transaction_attachments_attachment_idx').on(table.attachmentId) // Attachment's transactions
  ]
)
