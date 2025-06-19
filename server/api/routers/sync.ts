import { userPreferences } from '@/server/db/schema/table_3_user-preferences'
import { categories } from '@/server/db/schema/table_4_categories'
import { budgets } from '@/server/db/schema/table_5_budgets'
import { accounts } from '@/server/db/schema/table_6_accounts'
import { transactions } from '@/server/db/schema/table_7_transactions'
import { attachments } from '@/server/db/schema/table_8_attachments'
import { transactionAttachments } from '@/server/db/schema/table_9_transaction-attachments'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

import { eq } from 'drizzle-orm'

// Define the shape of one operation
const operationSchema = z.object({
  table: z.enum([
    'categories',
    'budgets',
    'accounts',
    'transactions',
    'attachments',
    'transactionAttachments',
    'userPreferences'
  ]),
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
          case 'transactionAttachments':
            await db.insert(transactionAttachments).values(transformedData)
            break
          case 'userPreferences':
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
              .where(eq(categories.id, id))
            break
          case 'budgets':
            await db
              .update(budgets)
              .set(transformedData)
              .where(eq(budgets.id, id))
            break
          case 'accounts':
            await db
              .update(accounts)
              .set(transformedData)
              .where(eq(accounts.id, id))
            break
          case 'transactions':
            await db
              .update(transactions)
              .set(transformedData)
              .where(eq(transactions.id, id))
            break
          case 'attachments':
            await db
              .update(attachments)
              .set(transformedData)
              .where(eq(attachments.id, id))
            break
          case 'transactionAttachments':
            await db
              .update(transactionAttachments)
              .set(transformedData)
              .where(eq(transactionAttachments.id, id))
            break
          case 'userPreferences':
            // userPreferences uses userId as primary key, not id
            const userId = transformedData.userId || id
            if (!userId) {
              throw new Error(
                `UPDATE operation missing 'userId' for userPreferences`
              )
            }
            await db
              .update(userPreferences)
              .set(transformedData)
              .where(eq(userPreferences.userId, userId))
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
      const { db } = ctx
      const { table, opData } = input
      const id = opData.id ?? opData

      if (!id) {
        console.error('❌ syncRouter.deleteRecord: Missing id')
        throw new Error(`DELETE operation missing 'id'`)
      }

      try {
        switch (table) {
          case 'categories':
            await db.delete(categories).where(eq(categories.id, id))
            break
          case 'budgets':
            await db.delete(budgets).where(eq(budgets.id, id))
            break
          case 'accounts':
            await db.delete(accounts).where(eq(accounts.id, id))
            break
          case 'transactions':
            await db.delete(transactions).where(eq(transactions.id, id))
            break
          case 'attachments':
            await db.delete(attachments).where(eq(attachments.id, id))
            break
          case 'transactionAttachments':
            await db
              .delete(transactionAttachments)
              .where(eq(transactionAttachments.id, id))
            break
          case 'userPreferences':
            // userPreferences uses userId as primary key, not id
            const userId = id
            await db
              .delete(userPreferences)
              .where(eq(userPreferences.userId, userId))
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
