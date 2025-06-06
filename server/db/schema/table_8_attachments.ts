/*
================================================================================
ATTACHMENTS SCHEMA - Transaction Documentation System
================================================================================
Purpose: Manages file attachments for transaction documentation including
         receipts, photos, PDFs, and voice messages. Supports many-to-many
         relationships allowing multiple transactions to reference the same
         attachment.

Key Features:
- Receipt and voice message attachment types
- Cloud storage integration with bucket path management
- File metadata tracking (size, MIME type, duration)
- Many-to-many transaction relationships
- Comprehensive file validation rules
- Optimized for file retrieval and management
================================================================================
*/

import { relations, sql } from 'drizzle-orm'
import {
  check,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  varchar
} from 'drizzle-orm/pg-core'

import { transactionAttachments, transactions } from '.'
import { createdAtColumn, uuidPrimaryKey } from './utils'

// ============================================================================
// ATTACHMENT TYPE DEFINITIONS
// ============================================================================

/**
 * Attachment types for transaction documentation
 * - receipt: Receipt photos/documents (images, PDFs, scanned documents)
 * - voice: Voice message recordings (audio files, voice notes)
 */
export const attachmentType = pgEnum('attachment_type', ['receipt', 'voice'])

// ============================================================================
// ATTACHMENTS TABLE
// ============================================================================

/**
 * File attachments for transaction documentation
 * Supports receipts (photos/PDFs) and voice messages (audio)
 * Many-to-many relationship: multiple transactions can reference same attachment
 *
 * Business Rules:
 * - Attachments are shared resources (multiple transactions can reference one file)
 * - Bucket paths must be non-empty for cloud storage integration
 * - File sizes must be positive values (when specified)
 * - Voice messages must include duration metadata
 * - Receipt attachments may optionally include duration (for video receipts)
 * - MIME types help determine file handling and preview capabilities
 */
export const attachments = pgTable(
  'attachments',
  {
    id: uuidPrimaryKey(),
    type: attachmentType().notNull(), // receipt or voice message type
    bucketPath: text().notNull(), // Cloud storage path (S3, etc.) - unlimited length for complex paths
    mime: varchar({ length: 150 }).notNull(), // File MIME type - supports complex MIME types
    fileName: varchar({ length: 500 }).notNull(), // Original filename - supports very long file names
    fileSize: numeric().notNull(), // File size in bytes (for storage management)
    duration: numeric(), // Duration in seconds (required for voice, optional for video receipts)
    createdAt: createdAtColumn() // Upload timestamp
  },
  table => [
    // Performance indexes for common queries
    index('attachments_type_idx').on(table.type), // Filter by attachment type
    index('attachments_created_at_idx').on(table.createdAt), // Sort by upload date

    // Business rule constraints
    check(
      'attachments_bucket_path_not_empty',
      sql`length(trim(${table.bucketPath})) > 0`
    ), // Valid bucket paths
    check(
      'attachments_file_size_positive',
      sql`${table.fileSize} IS NULL OR ${table.fileSize} > 0`
    ), // Positive file sizes
    check(
      'attachments_duration_positive',
      sql`${table.duration} IS NULL OR ${table.duration} > 0`
    ), // Positive durations
    check(
      'attachments_voice_has_duration',
      sql`${table.type} != 'voice' OR ${table.duration} IS NOT NULL`
    ) // Voice messages require duration
  ]
)

// ============================================================================
// ATTACHMENT RELATIONSHIPS
// ============================================================================

/**
 * Attachment relationship mappings
 * Defines connections to transactions through junction table
 */
export const attachmentsRelations = relations(attachments, ({ many }) => ({
  transactionAttachments: many(transactionAttachments) // Many-to-many with transactions
}))
/**
 * Transaction-attachment junction relationship mappings
 * Links attachments to their associated transactions
 */
export const transactionAttachmentsRelations = relations(
  transactionAttachments,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [transactionAttachments.transactionId],
      references: [transactions.id]
    }), // Transaction that references this attachment
    attachment: one(attachments, {
      fields: [transactionAttachments.attachmentId],
      references: [attachments.id]
    }) // Attachment referenced by this transaction
  })
)
