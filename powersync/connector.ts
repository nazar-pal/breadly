import { env } from '@/env'
import { trpcClient } from '@/trpc/react'
import { getClerkInstance } from '@clerk/clerk-expo'
import {
  AbstractPowerSyncDatabase,
  PowerSyncBackendConnector,
  UpdateType
} from '@powersync/react-native'

export class Connector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const clerkInstance = getClerkInstance()
    const authToken = await clerkInstance.session?.getToken({
      template: 'powersync'
    })
    if (!authToken) throw new Error('No auth token found')

    return {
      endpoint: env.EXPO_PUBLIC_POWERSYNC_WSS,
      token: authToken
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

    for (const op of transaction.crud) {
      // The data that needs to be changed in the remote db
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
          `⚠️ Connector.uploadData: Skipping unknown table: ${op.table}`
        )
        continue
      }

      try {
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
        }
      } catch (error) {
        console.error(
          `Failed to sync operation ${op.op} for table ${op.table}:`,
          error
        )
        throw error
      }
    }

    // Completes the transaction and moves onto the next one
    await transaction.complete()
  }
}
