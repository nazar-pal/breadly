import { TABLES_TO_SYNC } from '@/data/const'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import {
  accounts,
  attachments,
  budgets,
  categories,
  events,
  transactionAttachments,
  transactions,
  userPreferences
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
    idColumn: null
  },
  categories: {
    table: categories,
    idColumn: categories.id
  },
  budgets: {
    table: budgets,
    idColumn: budgets.id
  },
  accounts: {
    table: accounts,
    idColumn: accounts.id
  },
  events: {
    table: events,
    idColumn: events.id
  },
  transactions: {
    table: transactions,
    idColumn: transactions.id
  },
  attachments: {
    table: attachments,
    idColumn: attachments.id
  },
  transaction_attachments: {
    table: transactionAttachments,
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

  // Use onConflictDoNothing for idempotent inserts as recommended by PowerSync.
  // If the record already exists (same ID), skip the insert silently.
  // This handles sync replays where the same INSERT operation may be sent multiple times.
  // Database constraints and triggers handle validation.
  await db.insert(cfg.table).values(transformed).onConflictDoNothing()
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

  const whereClause = cfg.idColumn
    ? and(eq(cfg.idColumn, id), eq(cfg.table.userId, userId))
    : eq(cfg.table.userId, userId)

  // Database constraints and triggers handle validation.
  await db.update(cfg.table).set(transformed).where(whereClause)
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
