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
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'
import {
  clerkUserIdColumn,
  createdAtColumn,
  updatedAtColumn,
  uuidPrimaryKey
} from './utils'

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

/**
 * Attachment upload status for tracking file upload lifecycle
 * - pending: Record created, upload not yet started or in progress
 * - ready: File successfully uploaded and available in cloud storage
 * - failed: Upload failed (should be cleaned up by background job)
 */
export const ATTACHMENT_STATUS = ['pending', 'ready', 'failed'] as const
export type AttachmentStatus = (typeof ATTACHMENT_STATUS)[number]

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
 * - Bucket paths must be non-empty for cloud storage integration
 * - File sizes are required and must be positive values (NOT NULL, > 0)
 * - Voice messages must include duration metadata
 * - Attachment types: 'receipt' | 'voice'
 */
const columns = {
  // Explicitly defined for Drizzle ORM type safety
  id: uuidPrimaryKey(),
  userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
  type: text({ enum: ATTACHMENT_TYPE }).notNull(), // Attachment type ('receipt' | 'voice')
  status: text({ enum: ATTACHMENT_STATUS }).default('pending').notNull(), // Upload lifecycle status
  bucketPath: text('bucket_path').notNull(), // Cloud storage path (S3, etc.)
  mime: text({ length: 150 }).notNull(), // File MIME type
  fileName: text('file_name', { length: 500 }).notNull(), // Original filename
  fileSize: integer('file_size').notNull(), // File size in bytes (for storage management)
  duration: integer(), // Duration in seconds (required for voice, optional for video receipts)
  uploadedAt: integer('uploaded_at', { mode: 'timestamp_ms' }), // When upload completed successfully
  createdAt: createdAtColumn(), // Record creation timestamp
  updatedAt: updatedAtColumn()
}

// Only single-column indexes are supported in PowerSync JSON-based views
const extraConfig = (table: BuildColumns<string, typeof columns, 'sqlite'>) => [
  index('attachments_user_idx').on(table.userId),
  index('attachments_type_idx').on(table.type),
  index('attachments_status_idx').on(table.status),
  index('attachments_created_at_idx').on(table.createdAt)
]

export const attachments = sqliteTable('attachments', columns, extraConfig)

export const getAttachmentsSqliteTable = (name: string) =>
  sqliteTable(name, columns, extraConfig)

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

const MAX_FILE_NAME_LENGTH = 500
const MAX_MIME_LENGTH = 150

/**
 * Attachment insert schema with business rule validations.
 *
 * Server CHECK constraints replicated:
 * - attachments_bucket_path_not_empty: bucket path must be non-empty
 * - attachments_file_size_positive: file size must be positive
 * - attachments_duration_positive: duration must be positive (if set)
 * - attachments_voice_has_duration: voice messages must have duration
 * - attachments_ready_has_uploaded_at: ready attachments must have uploaded_at
 */
export const attachmentInsertSchema = createInsertSchema(attachments, {
  id: s => s.default(randomUUID),
  bucketPath: s => s.trim().min(1),
  fileName: s => s.trim().min(1).max(MAX_FILE_NAME_LENGTH),
  mime: s => s.trim().min(1).max(MAX_MIME_LENGTH),
  fileSize: s => s.positive(),
  duration: s => s.positive().optional()
})
  .omit({ createdAt: true, updatedAt: true })
  // Voice messages require duration
  .refine(data => data.type !== 'voice' || data.duration != null, {
    message: 'Voice messages must include duration',
    path: ['duration']
  })
  // Ready attachments must have uploadedAt timestamp
  .refine(data => data.status !== 'ready' || data.uploadedAt != null, {
    message: 'Ready attachments must have uploadedAt timestamp',
    path: ['uploadedAt']
  })

export type AttachmentInsertSchemaInput = z.input<typeof attachmentInsertSchema>
export type AttachmentInsertSchemaOutput = z.output<
  typeof attachmentInsertSchema
>

export const attachmentUpdateSchema = createUpdateSchema(attachments, {
  bucketPath: s => s.trim().min(1),
  fileName: s => s.trim().min(1).max(MAX_FILE_NAME_LENGTH),
  mime: s => s.trim().min(1).max(MAX_MIME_LENGTH),
  fileSize: s => s.positive(),
  duration: s => s.positive()
}).omit({
  id: true,
  userId: true,
  type: true,
  createdAt: true,
  updatedAt: true
})
// Note: Cross-field validation for status='ready' requiring uploadedAt cannot be
// fully validated at schema level for partial updates. Validate in mutation with merged state.

export type AttachmentUpdateSchemaInput = z.input<typeof attachmentUpdateSchema>
export type AttachmentUpdateSchemaOutput = z.output<
  typeof attachmentUpdateSchema
>
