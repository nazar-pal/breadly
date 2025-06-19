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
- Comprehensive file validation rules
- Optimized for file retrieval and management
================================================================================
*/

import {
  check,
  index,
  integer,
  sqliteTable,
  text
} from 'drizzle-orm/sqlite-core'

import { sql } from 'drizzle-orm'
import { clerkUserIdColumn, createdAtColumn, uuidPrimaryKey } from './utils'

// ============================================================================
// Attachments table - File metadata (receipts, voice notes)
// ============================================================================

/**
 * Attachment types for transaction documentation
 * - receipt: Receipt photos/documents (images, PDFs, scanned documents)
 * - voice: Voice message recordings (audio files, voice notes)
 */
const ATTACHMENT_TYPE = ['receipt', 'voice'] as const

// ============================================================================
// ATTACHMENTS TABLE
// ============================================================================

/**
 * File attachments for transaction documentation
 * Supports receipts (photos/PDFs) and voice messages (audio)
 * User-specific attachments with many-to-many transaction relationships
 *
 * Business Rules:
 * - Attachments belong to specific users (multi-tenant isolation)
 * - Attachments can be referenced by multiple transactions within user scope
 * - Bucket paths must be non-empty for cloud storage integration
 * - File sizes must be positive values (when specified)
 * - Voice messages must include duration metadata
 * - Receipt attachments may optionally include duration (for video receipts)
 * - MIME types help determine file handling and preview capabilities
 * - Attachment types: 'receipt' | 'voice'
 */
export const attachments = sqliteTable(
  'attachments',
  {
    id: uuidPrimaryKey(),
    userId: clerkUserIdColumn(), // Clerk user ID for multi-tenant isolation
    type: text({ enum: ATTACHMENT_TYPE }).notNull(), // attachment type ('receipt' | 'voice')
    bucketPath: text('bucket_path').notNull(), // Cloud storage path (S3, etc.)
    mime: text({ length: 150 }).notNull(), // File MIME type
    fileName: text('file_name', { length: 500 }).notNull(), // Original filename
    fileSize: integer('file_size').notNull(), // File size in bytes (for storage management)
    duration: integer(), // Duration in seconds (required for voice, optional for video receipts)
    createdAt: createdAtColumn() // Upload timestamp
  },
  table => [
    // Performance indexes for common queries
    index('attachments_user_idx').on(table.userId), // User's attachments lookup
    index('attachments_type_idx').on(table.type), // Filter by attachment type
    index('attachments_user_type_idx').on(table.userId, table.type), // User's attachments by type
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
