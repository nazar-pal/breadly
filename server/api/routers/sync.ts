import { TABLES_TO_SYNC } from '@/lib/powersync/const'
import { userPreferences } from '@/server/db/schema/table_3_user-preferences'
import { categories } from '@/server/db/schema/table_4_categories'
import { budgets } from '@/server/db/schema/table_5_budgets'
import { accounts } from '@/server/db/schema/table_6_accounts'
import { transactions } from '@/server/db/schema/table_7_transactions'
import { attachments } from '@/server/db/schema/table_8_attachments'
import { transactionAttachments } from '@/server/db/schema/table_9_transaction-attachments'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

// Define the shape of one operation
const operationSchema = z.object({
  table: z.enum(TABLES_TO_SYNC),
  op: z.enum(['PUT', 'PATCH', 'DELETE']),
  opData: z.any() // opData will be validated per type below if needed
})

/**
 * Convert snake_case string to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Transform PowerSync data to PostgreSQL-compatible format
 * Handles:
 * 1. Universal field name mapping (snake_case → camelCase)
 * 2. Timestamp conversion (Unix milliseconds → Date objects)
 * 3. Enum value mapping (text → PostgreSQL enums)
 */
function transformDataForPostgres(data: any, table: string): any {
  if (!data || typeof data !== 'object') return data

  const transformed: any = {}

  // Define timestamp fields that need conversion from Unix milliseconds to Date objects
  const timestampFields: Record<string, string[]> = {
    categories: ['created_at'],
    budgets: ['created_at'],
    accounts: ['created_at'],
    transactions: ['created_at', 'tx_date'],
    attachments: ['created_at'],
    transactionAttachments: ['created_at'],
    userPreferences: ['created_at']
  }

  const timestampFieldsForTable = timestampFields[table] || []

  // Universal field transformation: snake_case → camelCase + timestamp conversion
  for (const [key, value] of Object.entries(data)) {
    const camelKey = snakeToCamel(key)

    // Convert timestamp fields from Unix milliseconds to Date objects
    if (timestampFieldsForTable.includes(key) && typeof value === 'number') {
      transformed[camelKey] = new Date(value)
    } else {
      transformed[camelKey] = value
    }
  }

  // Table-specific enum validations
  if (table === 'categories' && transformed.type) {
    const validTypes = ['expense', 'income']
    if (!validTypes.includes(transformed.type)) {
      transformed.type = 'expense'
    }
  }

  if (table === 'transactions' && transformed.type) {
    const validTypes = ['expense', 'income', 'transfer']
    if (!validTypes.includes(transformed.type)) {
      transformed.type = 'expense'
    }
  }

  return transformed
}

export const syncRouter = createTRPCRouter({
  insertRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx
      const { table, opData } = input

      // Transform data from PowerSync format to PostgreSQL format
      const transformedData = transformDataForPostgres(opData, table)

      try {
        // Ensure the record belongs to the authenticated user (second-line defence).
        const recordUserId = (transformedData as any).userId

        if (recordUserId && recordUserId !== session.userId) {
          throw new Error(
            `Attempted to insert record for a different user (record userId ${recordUserId} !== session userId ${session.userId})`
          )
        }

        switch (table) {
          case 'categories':
            await db.insert(categories).values(transformedData)
            break
          case 'budgets':
            await db.insert(budgets).values(transformedData)
            break
          case 'accounts':
            await db.insert(accounts).values(transformedData)
            break
          case 'transactions':
            await db.insert(transactions).values(transformedData)
            break
          case 'attachments':
            await db.insert(attachments).values(transformedData)
            break
          case 'transaction_attachments':
            await db.insert(transactionAttachments).values(transformedData)
            break
          case 'user_preferences':
            await db.insert(userPreferences).values(transformedData)
            break
        }

        return { status: 'success' }
      } catch (error) {
        console.error('❌ syncRouter.insertRecord: Error inserting record:', {
          table,
          error: error instanceof Error ? error.message : String(error),
          recordId: transformedData.id
        })
        throw error
      }
    }),

  updateRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx
      const { table, opData } = input
      const id = opData.id

      if (!id) {
        throw new Error(`UPDATE operation missing 'id' in opData`)
      }

      // Transform data from PowerSync format to PostgreSQL format
      const transformedData = transformDataForPostgres(opData, table)

      try {
        switch (table) {
          case 'categories':
            await db
              .update(categories)
              .set(transformedData)
              .where(
                and(
                  eq(categories.id, id),
                  eq(categories.userId, session.userId)
                )
              )
            break
          case 'budgets':
            await db
              .update(budgets)
              .set(transformedData)
              .where(
                and(eq(budgets.id, id), eq(budgets.userId, session.userId))
              )
            break
          case 'accounts':
            await db
              .update(accounts)
              .set(transformedData)
              .where(
                and(eq(accounts.id, id), eq(accounts.userId, session.userId))
              )
            break
          case 'transactions':
            await db
              .update(transactions)
              .set(transformedData)
              .where(
                and(
                  eq(transactions.id, id),
                  eq(transactions.userId, session.userId)
                )
              )
            break
          case 'attachments':
            await db
              .update(attachments)
              .set(transformedData)
              .where(
                and(
                  eq(attachments.id, id),
                  eq(attachments.userId, session.userId)
                )
              )
            break
          case 'transaction_attachments':
            await db
              .update(transactionAttachments)
              .set(transformedData)
              .where(
                and(
                  eq(transactionAttachments.id, id),
                  eq(transactionAttachments.userId, session.userId)
                )
              )
            break
          case 'user_preferences':
            // userPreferences uses userId as primary key, not id
            const userIdPref = transformedData.userId
            await db
              .update(userPreferences)
              .set(transformedData)
              .where(eq(userPreferences.userId, userIdPref))
            break
        }

        return { status: 'success' }
      } catch (error) {
        console.error('❌ syncRouter.updateRecord: Error updating record:', {
          table,
          error: error instanceof Error ? error.message : String(error),
          recordId: id
        })
        throw error
      }
    }),

  deleteRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx
      const { table, opData } = input
      const id = opData.id ?? opData

      if (!id) {
        console.error('❌ syncRouter.deleteRecord: Missing id')
        throw new Error(`DELETE operation missing 'id'`)
      }

      try {
        switch (table) {
          case 'categories':
            await db
              .delete(categories)
              .where(
                and(
                  eq(categories.id, id),
                  eq(categories.userId, session.userId)
                )
              )
            break
          case 'budgets':
            await db
              .delete(budgets)
              .where(
                and(eq(budgets.id, id), eq(budgets.userId, session.userId))
              )
            break
          case 'accounts':
            await db
              .delete(accounts)
              .where(
                and(eq(accounts.id, id), eq(accounts.userId, session.userId))
              )
            break
          case 'transactions':
            await db
              .delete(transactions)
              .where(
                and(
                  eq(transactions.id, id),
                  eq(transactions.userId, session.userId)
                )
              )
            break
          case 'attachments':
            await db
              .delete(attachments)
              .where(
                and(
                  eq(attachments.id, id),
                  eq(attachments.userId, session.userId)
                )
              )
            break
          case 'transaction_attachments':
            await db
              .delete(transactionAttachments)
              .where(
                and(
                  eq(transactionAttachments.id, id),
                  eq(transactionAttachments.userId, session.userId)
                )
              )
            break
          case 'user_preferences':
            await db
              .delete(userPreferences)
              .where(eq(userPreferences.userId, session.userId))
            break
        }

        return { status: 'success' }
      } catch (error) {
        console.error('❌ syncRouter.deleteRecord: Error deleting record:', {
          table,
          error: error instanceof Error ? error.message : String(error),
          recordId: id
        })
        throw error
      }
    })
})
