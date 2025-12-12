/*
================================================================================
ATTACHMENTS SCHEMA - Transaction Documentation System
================================================================================
Purpose: Manages file attachments for transaction documentation including
         receipts, photos, PDFs, and voice messages. Supports many-to-many
         relationships allowing multiple transactions to reference the same
         attachment within a user's scope.

Key Features:
- Receipt and voice message attachment types
- Cloud storage integration with bucket path management
- File metadata tracking (size, MIME type, duration)
- User-specific attachment isolation for multi-tenant security
- Many-to-many transaction relationships within user scope

PowerSync Limitations (JSON-based views):
- CHECK constraints are NOT enforced (validated via Zod instead)
- Multi-column indexes are NOT supported
- Only single-column indexes work (basic support)

Note: The id column is explicitly defined for Drizzle ORM type safety.
================================================================================
*/

import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import type { BuildColumns } from 'drizzle-orm/column-builder'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { clerkUserIdColumn, createdAtColumn, uuidPrimaryKey } from './utils'

// ============================================================================
// Attachments table - File metadata (receipts, voice notes)
// ============================================================================

/**
 * Attachment types for transaction documentation
 * - receipt: Receipt photos/documents (images, PDFs, scanned documents)
 * - voice: Voice message recordings (audio files, voice notes)
 */
export const ATTACHMENT_TYPE = ['receipt', 'voice'] as const
export type AttachmentType = (typeof ATTACHMENT_TYPE)[number]

// ============================================================================
// ATTACHMENTS TABLE
// ============================================================================

/**
 * File attachments for transaction documentation
 * Supports receipts (photos/PDFs) and voice messages (audio)
 * User-specific attachments with many-to-many transaction relationships
 *
 * Business Rules (enforced via Zod, not SQLite):
 * - Attachments belong to specific users (multi-tenant isolation)
 * - Attachments can be referenced by multiple transactions within user scope
 * - Bucket paths must be non-empty for cloud storage integration
 * - File sizes must be positive values
 * - Voice messages must include duration metadata
 * - Receipt attachments may optionally include duration (for video receipts)
 * - MIME types help determine file handling and preview capabilities
 * - Attachment types: 'receipt' | 'voice'
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  type: text({ enum: ATTACHMENT_TYPE }).notNull(), // Attachment type ('receipt' | 'voice')
  bucketPath: text('bucket_path').notNull(), // Cloud storage path (S3, etc.)
  mime: text({ length: 150 }).notNull(), // File MIME type
  fileName: text('file_name', { length: 500 }).notNull(), // Original filename
  fileSize: integer('file_size').notNull(), // File size in bytes (for storage management)
  duration: integer(), // Duration in seconds (required for voice, optional for video receipts)
  createdAt: createdAtColumn() // Upload timestamp
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('attachments_user_idx').on(table.userId), // User's attachments lookup
  index('attachments_type_idx').on(table.type), // Filter by attachment type
  index('attachments_created_at_idx').on(table.createdAt) // Sort by upload date
]

export const attachments = sqliteTable('attachments', columns, extraConfig)

export const getAttachmentsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
// Business rules are enforced here since PowerSync JSON-based views
// do not support CHECK constraints.

/**
 * Attachment insert schema with business rule validations.
 * PowerSync's JSON-based views do not enforce constraints,
 * so Zod is used to validate input data in application code.
 */
export const attachmentInsertSchema = createInsertSchema(attachments, {
  // Bucket path must be non-empty
  bucketPath: schema =>
    schema.refine(val => val.trim().length > 0, 'Bucket path cannot be empty'),
  // File size must be positive
  fileSize: schema =>
    schema.refine(val => val > 0, 'File size must be positive'),
  // Duration must be positive (if provided)
  duration: schema =>
    schema
      .nullish()
      .transform(val => val ?? null)
      .refine(val => val === null || val > 0, 'Duration must be positive')
})
  // Voice messages require duration
  .refine(data => data.type !== 'voice' || data.duration != null, {
    message: 'Voice messages must include duration',
    path: ['duration']
  })

export const attachmentUpdateSchema = createUpdateSchema(attachments, {
  // Bucket path must be non-empty (if provided)
  bucketPath: schema =>
    schema.refine(
      val => val === undefined || val.trim().length > 0,
      'Bucket path cannot be empty'
    ),
  // File size must be positive (if provided)
  fileSize: schema =>
    schema.refine(
      val => val === undefined || val > 0,
      'File size must be positive'
    ),
  // Duration must be positive (if provided)
  duration: schema =>
    schema.refine(
      val => val === null || val === undefined || val > 0,
      'Duration must be positive'
    )
})
