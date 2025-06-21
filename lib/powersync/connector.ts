import { env } from '@/env'
import { trpcClient } from '@/lib/trpc/react'
import { getClerkInstance } from '@clerk/clerk-expo'
import {
  AbstractPowerSyncDatabase,
  PowerSyncBackendConnector,
  UpdateType
} from '@powersync/react-native'

export class Connector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const clerkInstance = getClerkInstance()
    try {
      const authToken = await clerkInstance.session?.getToken({
        template: 'powersync'
      })
      if (!authToken) throw new Error('No auth token found for PowerSync')

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
    /**
     * For batched crud transactions, use data.getCrudBatch(n);
     * https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/SqliteBucketStorage#getcrudbatch
     */
    const transaction = await database.getNextCrudTransaction()

    if (!transaction) {
      return
    }

    let lastOp: { table: string; op: UpdateType } | null = null
    try {
      for (const op of transaction.crud) {
        // The data that needs to be changed in the remote db
        lastOp = { table: op.table, op: op.op }

        const record = { ...op.opData, id: op.id }

        // Type guard to ensure table is valid
        const validTables = [
          'categories',
          'budgets',
          'accounts',
          'transactions',
          'attachments',
          'transactionAttachments',
          'userPreferences'
        ] as const
        const tableName = op.table as (typeof validTables)[number]

        if (!validTables.includes(tableName)) {
          console.warn(
            `Connector.uploadData: Skipping unknown table: ${op.table}`
          )
          continue
        }

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
      console.error(
        `Connector.uploadData error on op ${lastOp?.op} for table ${lastOp?.table}:`,
        error
      )
      // Attempt to complete (discard) this transaction to avoid blocking the queue.
      try {
        await transaction.complete()
      } catch (completeError) {
        console.error(
          'Failed to complete PowerSync transaction after error:',
          completeError
        )
      }
      // Rethrow to allow PowerSync to potentially retry later.
      throw error
    }
  }
}
