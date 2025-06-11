import { transactions } from '@/server/db/schema/table_7_transactions'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const createTransactionSchema = createInsertSchema(transactions)
export const updateTransactionSchema = createUpdateSchema(
  transactions
).required({
  id: true
})

export const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.transactions.findMany({
      where: eq(transactions.userId, ctx.session.userId),
      with: {
        account: true,
        counterAccount: true,
        category: true,
        currency: true,
        transactionAttachments: {
          with: {
            attachment: true
          }
        }
      },
      orderBy: (transactions, { desc }) => [desc(transactions.txDate)]
    })
    return result
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.transactions.findFirst({
        where: and(
          eq(transactions.id, input.id),
          eq(transactions.userId, ctx.session.userId)
        ),
        with: {
          account: true,
          counterAccount: true,
          category: true,
          currency: true,
          transactionAttachments: {
            with: {
              attachment: true
            }
          }
        }
      })
      if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
      return result
    }),

  getByAccount: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.transactions.findMany({
        where: and(
          eq(transactions.accountId, input.accountId),
          eq(transactions.userId, ctx.session.userId)
        ),
        with: {
          account: true,
          counterAccount: true,
          category: true,
          currency: true,
          transactionAttachments: {
            with: {
              attachment: true
            }
          }
        },
        orderBy: (transactions, { desc }) => [desc(transactions.txDate)]
      })
      return result
    }),

  getByCategory: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.transactions.findMany({
        where: and(
          eq(transactions.categoryId, input.categoryId),
          eq(transactions.userId, ctx.session.userId)
        ),
        with: {
          account: true,
          counterAccount: true,
          category: true,
          currency: true,
          transactionAttachments: {
            with: {
              attachment: true
            }
          }
        },
        orderBy: (transactions, { desc }) => [desc(transactions.txDate)]
      })
      return result
    }),

  create: protectedProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(transactions)
        .values({
          ...input,
          userId: ctx.session.userId
        })
        .returning({ id: transactions.id })
        .then(result => result[0])
    }),

  update: protectedProcedure
    .input(updateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(transactions)
        .set(input)
        .where(
          and(
            eq(transactions.id, input.id),
            eq(transactions.userId, ctx.session.userId)
          )
        )
        .returning({ id: transactions.id })
        .then(result => result[0])
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, input.id),
            eq(transactions.userId, ctx.session.userId)
          )
        )
        .returning({ id: transactions.id })
        .then(result => result[0])
    })
})
