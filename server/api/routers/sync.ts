import { TABLES_TO_SYNC } from '@/lib/powersync/const'
import {
  userPreferences,
  userPreferencesInsertSchemaPg,
  userPreferencesUpdateSchemaPg
} from '@/server/db/schema/table_3_user-preferences'
import {
  categories,
  categoriesInsertSchemaPg,
  categoriesUpdateSchemaPg
} from '@/server/db/schema/table_4_categories'
import {
  budgets,
  budgetsInsertSchemaPg,
  budgetsUpdateSchemaPg
} from '@/server/db/schema/table_5_budgets'
import {
  accounts,
  accountsInsertSchemaPg,
  accountsUpdateSchemaPg
} from '@/server/db/schema/table_6_accounts'
import {
  transactions,
  transactionsInsertSchemaPg,
  transactionsUpdateSchemaPg
} from '@/server/db/schema/table_7_transactions'
import {
  attachments,
  attachmentsInsertSchemaPg,
  attachmentsUpdateSchemaPg
} from '@/server/db/schema/table_8_attachments'
import {
  transactionAttachments,
  transactionAttachmentsInsertSchemaPg,
  transactionAttachmentsUpdateSchemaPg
} from '@/server/db/schema/table_9_transaction-attachments'
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

  // ---------------------------------------------------------------------
  // Field mappings per table
  // ---------------------------------------------------------------------
  const timestampFields: Record<string, string[]> = {
    categories: ['created_at'],
    budgets: ['created_at'],
    accounts: ['created_at'],
    transactions: ['created_at'],
    attachments: ['created_at'],
    transaction_attachments: ['created_at'],
    user_preferences: []
  }

  // Date fields (date only - need YYYY-MM-DD string format)
  const dateFields: Record<string, string[]> = {
    budgets: ['start_date'],
    accounts: ['savings_target_date', 'debt_due_date'],
    transactions: ['tx_date'],
    categories: [],
    attachments: [],
    transaction_attachments: [],
    user_preferences: []
  }

  // Boolean columns that come from SQLite as 0/1 integers
  const booleanFields: Record<string, string[]> = {
    categories: ['is_archived'],
    budgets: ['is_active'], // (future-proof, not present in current schema)
    accounts: ['is_archived', 'debt_is_owed_to_me'],
    transactions: ['is_recurring'],
    attachments: [],
    transaction_attachments: [],
    user_preferences: []
  }

  // Decimal / numeric columns that come from SQLite as numbers but must be strings for Postgres numeric columns
  const numericFields: Record<string, string[]> = {
    budgets: ['amount'],
    accounts: ['balance', 'savings_target_amount', 'debt_initial_amount'],
    transactions: ['amount'],
    attachments: [],
    categories: [],
    transaction_attachments: [],
    user_preferences: []
  }

  const timestampFieldsForTable = timestampFields[table] || []
  const dateFieldsForTable = dateFields[table] || []
  const booleanFieldsForTable = booleanFields[table] || []
  const numericFieldsForTable = numericFields[table] || []

  // ---------------------------------------------------------------------
  // 1) Convert snake_case → camelCase and handle timestamps/dates immediately
  // ---------------------------------------------------------------------
  for (const [key, value] of Object.entries(data)) {
    const camelKey = snakeToCamel(key)

    // Timestamp conversion: Unix millis → Date object
    if (
      timestampFieldsForTable.includes(key) &&
      typeof value === 'number' &&
      !Number.isNaN(value)
    ) {
      transformed[camelKey] = new Date(value)
      continue
    }

    // Date conversion: Unix millis → YYYY-MM-DD string
    if (
      dateFieldsForTable.includes(key) &&
      typeof value === 'number' &&
      !Number.isNaN(value)
    ) {
      transformed[camelKey] = new Date(value).toISOString().split('T')[0]
      continue
    }

    transformed[camelKey] = value
  }

  // ---------------------------------------------------------------------
  // 2) Boolean conversion (0/1 → true/false)
  // ---------------------------------------------------------------------
  for (const camelKey of booleanFieldsForTable.map(snakeToCamel)) {
    if (camelKey in transformed) {
      const v = transformed[camelKey]
      if (typeof v === 'number') transformed[camelKey] = v === 1
      else if (typeof v === 'string') transformed[camelKey] = v === '1'
    }
  }

  // ---------------------------------------------------------------------
  // 3) Numeric conversion (number → string for numeric columns)
  // ---------------------------------------------------------------------
  for (const camelKey of numericFieldsForTable.map(snakeToCamel)) {
    if (camelKey in transformed) {
      const v = transformed[camelKey]
      if (typeof v === 'number' && !Number.isNaN(v)) {
        transformed[camelKey] = v.toString()
      }
    }
  }

  // ---------------------------------------------------------------------
  // 4) Enum sanitisation (already existed – kept intact)
  // ---------------------------------------------------------------------
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

function validateRecordUserId(
  transformedData: Record<string, unknown>,
  session: { userId: string; authToken: string },
  operation: 'insert' | 'update'
) {
  const { userId: sessionUserId } = session

  if (!('userId' in transformedData)) {
    transformedData.userId = sessionUserId
    return sessionUserId
  }

  if (typeof transformedData.userId !== 'string') {
    throw new Error(
      `Error ${operation} record: userId has invalid type: ${typeof transformedData.userId}`
    )
  }

  let recordUserId = transformedData.userId

  // If the userId is not a valid authenticated user, replace it
  if (!recordUserId.startsWith('user_')) {
    if (__DEV__) {
      console.info(
        `🔄 Replacing guest user ID "${recordUserId}" with authenticated user "${sessionUserId}"`
      )
    }
    transformedData.userId = sessionUserId
    recordUserId = sessionUserId
  } else if (recordUserId !== sessionUserId) {
    throw new Error(
      `Error ${operation} record: userId mismatch (record userId "${recordUserId}" !== session userId "${sessionUserId}")`
    )
  }

  return recordUserId
}

export const syncRouter = createTRPCRouter({
  insertRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx
      const { table, opData } = input

      // Transform data from PowerSync format to PostgreSQL format
      const transformedData = transformDataForPostgres(opData, table)

      validateRecordUserId(transformedData, session, 'insert')

      switch (table) {
        case 'user_preferences':
          const { id: _, ...rest } = transformedData
          const validatedUserPreferences =
            userPreferencesInsertSchemaPg.parse(rest)
          await db.insert(userPreferences).values(validatedUserPreferences)
          break
        case 'categories':
          const validatedCategories =
            categoriesInsertSchemaPg.parse(transformedData)
          await db.insert(categories).values(validatedCategories)
          break
        case 'budgets':
          const validatedBudgets = budgetsInsertSchemaPg.parse(transformedData)
          await db.insert(budgets).values(validatedBudgets)
          break
        case 'accounts':
          const validatedAccounts =
            accountsInsertSchemaPg.parse(transformedData)
          await db.insert(accounts).values(validatedAccounts)
          break
        case 'transactions':
          const validatedTransactions =
            transactionsInsertSchemaPg.parse(transformedData)
          await db.insert(transactions).values(validatedTransactions)
          break
        case 'attachments':
          const validatedAttachments =
            attachmentsInsertSchemaPg.parse(transformedData)
          await db.insert(attachments).values(validatedAttachments)
          break
        case 'transaction_attachments':
          const validatedTransactionAttachments =
            transactionAttachmentsInsertSchemaPg.parse(transformedData)
          await db
            .insert(transactionAttachments)
            .values(validatedTransactionAttachments)
          break
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

      const userId = validateRecordUserId(transformedData, session, 'update')

      switch (table) {
        case 'user_preferences':
          const { id: _, ...rest } = transformedData
          const validatedUserPreferences =
            userPreferencesUpdateSchemaPg.parse(rest)
          await db
            .update(userPreferences)
            .set(validatedUserPreferences)
            .where(eq(userPreferences.userId, userId))
          break
        case 'categories':
          const validatedCategories =
            categoriesUpdateSchemaPg.parse(transformedData)
          await db
            .update(categories)
            .set(validatedCategories)
            .where(and(eq(categories.id, id), eq(categories.userId, userId)))
          break
        case 'budgets':
          const validatedBudgets = budgetsUpdateSchemaPg.parse(transformedData)
          await db
            .update(budgets)
            .set(validatedBudgets)
            .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
          break
        case 'accounts':
          const validatedAccounts =
            accountsUpdateSchemaPg.parse(transformedData)
          await db
            .update(accounts)
            .set(validatedAccounts)
            .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
          break
        case 'transactions':
          const validatedTransactions =
            transactionsUpdateSchemaPg.parse(transformedData)
          await db
            .update(transactions)
            .set(validatedTransactions)
            .where(
              and(eq(transactions.id, id), eq(transactions.userId, userId))
            )
          break
        case 'attachments':
          const validatedAttachments =
            attachmentsUpdateSchemaPg.parse(transformedData)
          await db
            .update(attachments)
            .set(validatedAttachments)
            .where(and(eq(attachments.id, id), eq(attachments.userId, userId)))
          break
        case 'transaction_attachments':
          const validatedTransactionAttachments =
            transactionAttachmentsUpdateSchemaPg.parse(transformedData)
          await db
            .update(transactionAttachments)
            .set(validatedTransactionAttachments)
            .where(
              and(
                eq(transactionAttachments.id, id),
                eq(transactionAttachments.userId, userId)
              )
            )
          break
      }
    }),

  deleteRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx
      const { table, opData } = input
      const id = opData.id ?? opData

      if (!id || typeof id !== 'string')
        throw new Error(`DELETE operation missing 'id'`)

      switch (table) {
        case 'categories':
          await db
            .delete(categories)
            .where(
              and(eq(categories.id, id), eq(categories.userId, session.userId))
            )
          break
        case 'budgets':
          await db
            .delete(budgets)
            .where(and(eq(budgets.id, id), eq(budgets.userId, session.userId)))
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
    })
})
