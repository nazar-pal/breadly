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

// -----------------------------------------------------------------------------
// Centralised configuration for every sync-able table
// -----------------------------------------------------------------------------
const tableConfigs = {
  user_preferences: {
    table: userPreferences,
    insertSchema: userPreferencesInsertSchemaPg,
    updateSchema: userPreferencesUpdateSchemaPg,
    idColumn: null
  },
  categories: {
    table: categories,
    insertSchema: categoriesInsertSchemaPg,
    updateSchema: categoriesUpdateSchemaPg,
    idColumn: categories.id
  },
  budgets: {
    table: budgets,
    insertSchema: budgetsInsertSchemaPg,
    updateSchema: budgetsUpdateSchemaPg,
    idColumn: budgets.id
  },
  accounts: {
    table: accounts,
    insertSchema: accountsInsertSchemaPg,
    updateSchema: accountsUpdateSchemaPg,
    idColumn: accounts.id
  },
  transactions: {
    table: transactions,
    insertSchema: transactionsInsertSchemaPg,
    updateSchema: transactionsUpdateSchemaPg,
    idColumn: transactions.id
  },
  attachments: {
    table: attachments,
    insertSchema: attachmentsInsertSchemaPg,
    updateSchema: attachmentsUpdateSchemaPg,
    idColumn: attachments.id
  },
  transaction_attachments: {
    table: transactionAttachments,
    insertSchema: transactionAttachmentsInsertSchemaPg,
    updateSchema: transactionAttachmentsUpdateSchemaPg,
    idColumn: transactionAttachments.id
  }
} as const

// Generic helpers -------------------------------------------------------------
const insertHelper = async (
  ctx: any,
  tableName: keyof typeof tableConfigs,
  opData: any
) => {
  const { db, session } = ctx
  const cfg = tableConfigs[tableName]
  if (!cfg) throw new Error(`Unsupported table: ${tableName}`)

  const transformed = transformDataForPostgres(opData, tableName)
  validateRecordUserId(transformed, session, 'insert')

  const validated = cfg.insertSchema.parse(transformed)
  await db.insert(cfg.table).values(validated)
}

const updateHelper = async (
  ctx: any,
  tableName: keyof typeof tableConfigs,
  opData: any
) => {
  const { db, session } = ctx
  const cfg = tableConfigs[tableName]
  if (!cfg) throw new Error(`Unsupported table: ${tableName}`)

  const { id } = opData
  if (!id) throw new Error(`UPDATE operation missing 'id' in opData`)

  const transformed = transformDataForPostgres(opData, tableName)
  const userId = validateRecordUserId(transformed, session, 'update')

  const validated = cfg.updateSchema.parse(transformed)

  const whereClause = cfg.idColumn
    ? and(eq(cfg.idColumn, id), eq(cfg.table.userId, userId))
    : eq(cfg.table.userId, userId)

  await db.update(cfg.table).set(validated).where(whereClause)
}

const deleteHelper = async (
  ctx: any,
  tableName: keyof typeof tableConfigs,
  opData: any
) => {
  const { db, session } = ctx
  const cfg = tableConfigs[tableName]
  if (!cfg) throw new Error(`Unsupported table: ${tableName}`)

  const id = opData.id ?? opData
  if (!id || typeof id !== 'string') {
    throw new Error(`DELETE operation missing 'id'`)
  }

  const whereClause = cfg.idColumn
    ? and(eq(cfg.idColumn, id), eq(cfg.table.userId, session.userId))
    : eq(cfg.table.userId, session.userId)

  await db.delete(cfg.table).where(whereClause)
}

// -----------------------------------------------------------------------------
// Router definition
// -----------------------------------------------------------------------------
export const syncRouter = createTRPCRouter({
  insertRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      await insertHelper(ctx, input.table, input.opData)
    }),

  updateRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      await updateHelper(ctx, input.table, input.opData)
    }),

  deleteRecord: protectedProcedure
    .input(operationSchema)
    .mutation(async ({ ctx, input }) => {
      await deleteHelper(ctx, input.table, input.opData)
    })
})
