import { TABLES_TO_SYNC } from '@/data/const'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import {
  accounts,
  accountsInsertSchemaPg,
  accountsUpdateSchemaPg,
  attachments,
  attachmentsInsertSchemaPg,
  attachmentsUpdateSchemaPg,
  budgets,
  budgetsInsertSchemaPg,
  budgetsUpdateSchemaPg,
  categories,
  categoriesInsertSchemaPg,
  categoriesUpdateSchemaPg,
  events,
  eventsInsertSchemaPg,
  eventsUpdateSchemaPg,
  transactionAttachments,
  transactionAttachmentsInsertSchemaPg,
  transactionAttachmentsUpdateSchemaPg,
  transactions,
  transactionsInsertSchemaPg,
  transactionsUpdateSchemaPg,
  userPreferences,
  userPreferencesInsertSchemaPg,
  userPreferencesUpdateSchemaPg
} from '../../db-schema'
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
  events: {
    table: events,
    insertSchema: eventsInsertSchemaPg,
    updateSchema: eventsUpdateSchemaPg,
    idColumn: events.id
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

  const validated = cfg.insertSchema
    .extend({ id: z.string() })
    .parse(transformed)

  // Use onConflictDoNothing for idempotent inserts as recommended by PowerSync.
  // If the record already exists (same ID), skip the insert silently.
  // This handles sync replays where the same INSERT operation may be sent multiple times.
  await db.insert(cfg.table).values(validated).onConflictDoNothing()
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

  const validated = cfg.updateSchema
    .extend({ id: z.string() })
    .parse(transformed)

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
