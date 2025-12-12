import { TABLES_TO_SYNC } from '@/data/const'
import { trpcClient } from '@/data/trpc/react'
import { env } from '@/env'
import { getClerkInstance } from '@clerk/clerk-expo'
import {
  AbstractPowerSyncDatabase,
  PowerSyncBackendConnector,
  UpdateType
} from '@powersync/react-native'
import * as Sentry from '@sentry/react-native'
import { z } from 'zod'

export class Connector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const clerkInstance = getClerkInstance()
    try {
      const authToken = await clerkInstance.session?.getToken({
        template: 'powersync'
      })
      if (!authToken) throw new Error('No auth token found for PowerSync')

      // Set Sentry user context for all future error reports
      const userId = clerkInstance.user?.id
      if (userId)
        Sentry.setUser({
          id: userId,
          email: clerkInstance.user?.emailAddresses[0].emailAddress,
          username: clerkInstance.user?.fullName ?? undefined
        })

      return {
        endpoint: env.EXPO_PUBLIC_POWERSYNC_WSS,
        token: authToken
      }
    } catch (err) {
      console.error('Connector.fetchCredentials failed', err)
      throw err
    }
  }

  async uploadData(database: AbstractPowerSyncDatabase) {
    const transaction = await database.getNextCrudTransaction()

    if (!transaction) return

    let lastOp: { table: string; op: UpdateType; id: string } | null = null
    try {
      for (const op of transaction.crud) {
        // The data that needs to be changed in the remote db
        lastOp = { table: op.table, op: op.op, id: op.id }

        const record = { ...op.opData, id: op.id }

        const result = z.enum(TABLES_TO_SYNC).safeParse(op.table)
        if (!result.success) {
          console.warn(
            `Connector.uploadData: Skipping unknown table: ${op.table}`
          )
          continue
        }

        const tableName = result.data

        switch (op.op) {
          case UpdateType.PUT: {
            await trpcClient.sync.insertRecord.mutate({
              table: tableName,
              op: op.op,
              opData: record
            })
            break
          }
          case UpdateType.PATCH: {
            await trpcClient.sync.updateRecord.mutate({
              table: tableName,
              op: op.op,
              opData: record
            })
            break
          }
          case UpdateType.DELETE: {
            await trpcClient.sync.deleteRecord.mutate({
              table: tableName,
              op: op.op,
              opData: record
            })
            break
          }
          default:
            console.warn(
              `Connector.uploadData: Unknown operation type: ${op.op}`
            )
        }
      }
      // Complete the transaction so PowerSync can proceed to the next.
      await transaction.complete()
      // If we get here, the transaction was successful.
    } catch (error) {
      const errorInfo = this.categorizeError(error)

      // Only report non-recoverable errors to Sentry
      // Transient network issues will resolve on retry - no need to report
      if (!errorInfo.isRecoverable) {
        Sentry.captureException(error, {
          tags: {
            context: 'powersync:uploadData',
            errorCategory: errorInfo.category,
            table: lastOp?.table ?? 'unknown',
            operation: lastOp?.op ?? 'unknown'
          },
          extra: {
            recordId: lastOp?.id,
            transactionId: transaction.transactionId,
            crudCount: transaction.crud.length
          }
        })
      }

      // Always log locally for debugging
      console.error(
        `[PowerSync] Upload failed - ${errorInfo.category}:`,
        { table: lastOp?.table, op: lastOp?.op, id: lastOp?.id },
        error
      )

      // Re-throw to block the queue (preserves order)
      throw error
    }
  }

  /**
   * Categorize errors to determine handling strategy
   */
  private categorizeError(error: unknown): {
    category: string
    isRecoverable: boolean
  } {
    const message = error instanceof Error ? error.message : String(error)

    // Constraint violations (likely client-side validation gaps)
    if (
      message.includes('violates foreign key') ||
      message.includes('does not belong to user') ||
      message.includes('currency') ||
      message.includes('constraint')
    ) {
      return { category: 'constraint_violation', isRecoverable: false }
    }

    // Network errors (transient, will retry automatically)
    if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('Network request failed') ||
      message.includes('ETIMEDOUT') ||
      message.includes('ECONNREFUSED')
    ) {
      return { category: 'network', isRecoverable: true }
    }

    // Auth errors - 403 is NOT recoverable (permission issue)
    // 401 could be transient if token refresh is working
    if (message.includes('403') || message.includes('Forbidden')) {
      return { category: 'auth_forbidden', isRecoverable: false }
    }
    if (message.includes('401') || message.includes('Unauthorized')) {
      return { category: 'auth_unauthorized', isRecoverable: true }
    }

    // Validation errors from Zod/tRPC
    if (message.includes('ZodError') || message.includes('validation')) {
      return { category: 'validation_error', isRecoverable: false }
    }

    return { category: 'unknown', isRecoverable: false }
  }
}
