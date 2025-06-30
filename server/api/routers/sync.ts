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
import { transformDataForPostgres, validateRecordUserId } from '../utils'

// Define the shape of one operation
const operationSchema = z.object({
  table: z.enum(TABLES_TO_SYNC),
  op: z.enum(['PUT', 'PATCH', 'DELETE']),
  opData: z.any() // opData will be validated per type below if needed
})

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
