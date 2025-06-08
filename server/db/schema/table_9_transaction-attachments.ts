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
- Composite primary key for relationship integrity
- User isolation through transaction ownership validation
- Automatic cleanup on transaction/attachment deletion
- Row-level security for multi-tenant access control
================================================================================
*/

import { sql } from 'drizzle-orm'
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon'
import { index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { transactions } from './table_7_transactions'
import { attachments } from './table_8_attachments'
import { createdAtColumn } from './utils'

// ============================================================================
// Transaction attachments table - Many-to-many transaction ↔ attachment links
// ============================================================================

/**
 * Junction table linking transactions to their attachments
 * Many-to-many relationship: one transaction can have multiple attachments,
 * one attachment can be referenced by multiple transactions
 *
 * Business Rules:
 * - Each transaction-attachment pair can only exist once (composite primary key)
 * - Users can only access attachments through their own transactions (RLS)
 * - Cascade deletion when transactions or attachments are removed
 * - Attachment access is controlled by transaction ownership
 * - Supports sharing attachments across multiple transactions (e.g., one receipt for split expenses)
 */
export const transactionAttachments = pgTable(
  'transaction_attachments',
  {
    transactionId: uuid()
      .references(() => transactions.id, { onDelete: 'cascade' })
      .notNull(), // Transaction that references the attachment
    attachmentId: uuid()
      .references(() => attachments.id, { onDelete: 'cascade' })
      .notNull(), // Attachment being referenced
    createdAt: createdAtColumn() // Link creation timestamp
  },
  table => [
    // Composite primary key ensures unique transaction-attachment pairs
    primaryKey({ columns: [table.transactionId, table.attachmentId] }),

    // Performance indexes for foreign key lookups
    index('transaction_attachments_transaction_idx').on(table.transactionId), // Transaction's attachments
    index('transaction_attachments_attachment_idx').on(table.attachmentId), // Attachment's transactions

    // RLS: Users can only access attachments through their own transactions
    crudPolicy({
      role: authenticatedRole,
      read: sql`EXISTS (
        SELECT 1 FROM transactions t 
        WHERE t.id = ${table.transactionId} 
        AND t.user_id = auth.user_id()
      )`, // Read access through transaction ownership
      modify: sql`EXISTS (
        SELECT 1 FROM transactions t 
        WHERE t.id = ${table.transactionId} 
        AND t.user_id = auth.user_id()
      )` // Modify access through transaction ownership
    })
  ]
)
