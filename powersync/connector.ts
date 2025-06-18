import { env } from '@/env'
import { trpcClient } from '@/trpc/react'
import { getClerkInstance } from '@clerk/clerk-expo'
import {
  AbstractPowerSyncDatabase,
  PowerSyncBackendConnector,
  UpdateType
} from '@powersync/react-native'

export class Connector implements PowerSyncBackendConnector {
  /**
   * Implement fetchCredentials to obtain a JWT from your authentication service.
   * See https://docs.powersync.com/installation/authentication-setup
   * If you're using Supabase or Firebase, you can re-use the JWT from those clients, see:
   * https://docs.powersync.com/installation/authentication-setup/supabase-auth
   * https://docs.powersync.com/installation/authentication-setup/firebase-auth
   */
  async fetchCredentials() {
    const clerkInstance = getClerkInstance()

    // Use `getToken()` to get the current session token
    const authToken = await clerkInstance.session?.getToken({
      template: 'powersync' // Use the custom JWT template for PowerSync
    })

    if (!authToken) {
      throw new Error('No auth token found')
    }
    return {
      // The PowerSync instance URL or self-hosted endpoint
      endpoint: env.EXPO_PUBLIC_POWERSYNC_WSS,
      /**
       * To get started quickly, use a development token, see:
       * Authentication Setup https://docs.powersync.com/installation/authentication-setup/development-tokens) to get up and running quickly
       */
      // TODO: Remove this once we have a proper auth token
      token: authToken
      // ||
      // 'eyJhbGciOiJSUzI1NiIsImtpZCI6InBvd2Vyc3luYy1kZXYtMzIyM2Q0ZTMifQ.eyJzdWIiOiJ1c2VyXzJ5M0d6MXJtanlmNHZZVTlqSzNKb0Zvd1VwUiIsImlhdCI6MTc1MDA2MzQzOCwiaXNzIjoiaHR0cHM6Ly9wb3dlcnN5bmMtYXBpLmpvdXJuZXlhcHBzLmNvbSIsImF1ZCI6Imh0dHBzOi8vNjg0ZDY2MWJhMjZjODViY2FiZjFlZTE1LnBvd2Vyc3luYy5qb3VybmV5YXBwcy5jb20iLCJleHAiOjE3NTAxMDY2Mzh9.cj6-9UzKJKlyATkQPEmflFu4n5HPKOeQCL1cuNngmN67fL-JFLlW4mAFadHnCMlhz73T5SsslNCCDfJeH6CKei2H9x9LsS8O_TPjP8ggWs-hDRTlWDb-1A-STeXxXTzAN31O8_9PzRoffTgAMKpmzMOpOklKJoW9vjmbTunUKt-L_rn0lELilOU4SSjfTZhtSjCbmkR0S7AGJd7yXKgQoDtpwpf_wJbFW8GVZd9dK04jea6PQJsEBkYGZqU2xMzzek27-ADh_dpdDxFlGsWvyd1rbZzPacjNx0IQ2VF7XPW-XsG-VIeVuysO0JxD32hcbXUwUc7Z0MiD9R8S_eFM2Q'
    }
  }

  /**
   * Implement uploadData to send local changes to your backend service.
   * You can omit this method if you only want to sync data from the database to the client
   * See example implementation here:https://docs.powersync.com/client-sdk-references/react-native-and-expo#3-integrate-with-your-backend
   */
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
