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
import { z } from 'zod/v4'
import {
  createTRPCContext,
  createTRPCRouter,
  protectedProcedure
} from '../trpc'
import { transformDataForPostgres, validateRecordUserId } from '../utils'

// Define the shape of one operation
const operationSchema = z.object({
  table: z.enum(TABLES_TO_SYNC),
  op: z.enum(['PUT', 'PATCH', 'DELETE']),
  opData: z.record(z.string(), z.unknown()).and(z.object({ id: z.string() }))
})

// -----------------------------------------------------------------------------
// Centralised configuration for every sync-able table
// -----------------------------------------------------------------------------
const withId = (schema: z.ZodObject) => schema.extend({ id: z.string() })
const tableConfigs = {
  user_preferences: {
    table: userPreferences,
    insertSchema: withId(userPreferencesInsertSchemaPg),
    updateSchema: withId(userPreferencesUpdateSchemaPg),
    idColumn: null
  },
  categories: {
    table: categories,
    insertSchema: withId(categoriesInsertSchemaPg),
    updateSchema: withId(categoriesUpdateSchemaPg),
    idColumn: categories.id
  },
  budgets: {
    table: budgets,
    insertSchema: withId(budgetsInsertSchemaPg),
    updateSchema: withId(budgetsUpdateSchemaPg),
    idColumn: budgets.id
  },
  accounts: {
    table: accounts,
    insertSchema: withId(accountsInsertSchemaPg),
    updateSchema: withId(accountsUpdateSchemaPg),
    idColumn: accounts.id
  },
  transactions: {
    table: transactions,
    insertSchema: withId(transactionsInsertSchemaPg),
    updateSchema: withId(transactionsUpdateSchemaPg),
    idColumn: transactions.id
  },
  attachments: {
    table: attachments,
    insertSchema: withId(attachmentsInsertSchemaPg),
    updateSchema: withId(attachmentsUpdateSchemaPg),
    idColumn: attachments.id
  },
  transaction_attachments: {
    table: transactionAttachments,
    insertSchema: withId(transactionAttachmentsInsertSchemaPg),
    updateSchema: withId(transactionAttachmentsUpdateSchemaPg),
    idColumn: transactionAttachments.id
  }
} as const

// Generic helpers -------------------------------------------------------------
type OperationData = Record<string, unknown> & { id: string }
type ProtectedContext = Awaited<ReturnType<typeof createTRPCContext>> & {
  session: { userId: string; authToken: string }
}

const insertHelper = async (
  ctx: ProtectedContext,
  tableName: keyof typeof tableConfigs,
  opData: OperationData
) => {
  const { db, session } = ctx
  const cfg = tableConfigs[tableName]

  const transformed = transformDataForPostgres(opData, tableName)
  validateRecordUserId(transformed, session, 'insert')

  const validated = cfg.insertSchema.parse(transformed)
  await db.insert(cfg.table).values(validated)
}

const updateHelper = async (
  ctx: ProtectedContext,
  tableName: keyof typeof tableConfigs,
  opData: OperationData
) => {
  const { db, session } = ctx
  const cfg = tableConfigs[tableName]

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
  ctx: ProtectedContext,
  tableName: keyof typeof tableConfigs,
  opData: OperationData
) => {
  const { db, session } = ctx
  const cfg = tableConfigs[tableName]

  const whereClause = cfg.idColumn
    ? and(eq(cfg.idColumn, opData.id), eq(cfg.table.userId, session.userId))
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
