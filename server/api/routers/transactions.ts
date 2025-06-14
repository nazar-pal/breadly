import { transactions } from '@/server/db/schema/table_7_transactions'
import { TRPCError } from '@trpc/server'
import { and, eq, sql } from 'drizzle-orm'
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
    }),

  getTotalAmount: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        accountType: z.enum(['payment', 'saving', 'debt']).optional(),
        transactionType: z.enum(['expense', 'income', 'transfer']).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.transactions.findMany({
        where: and(
          eq(transactions.userId, ctx.session.userId),
          input.categoryId
            ? eq(transactions.categoryId, input.categoryId)
            : undefined,
          input.transactionType
            ? eq(transactions.type, input.transactionType)
            : undefined,
          input.startDate
            ? sql`${transactions.txDate} >= ${input.startDate}`
            : undefined,
          input.endDate
            ? sql`${transactions.txDate} <= ${input.endDate}`
            : undefined
        ),
        with: {
          account: true
        }
      })

      // Filter by account type if specified
      const filteredTransactions = input.accountType
        ? result.filter(
            transaction => transaction.account?.type === input.accountType
          )
        : result

      // Calculate total amount
      const totalAmount = filteredTransactions.reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount),
        0
      )

      return {
        totalAmount,
        transactionCount: filteredTransactions.length,
        transactions: filteredTransactions
      }
    })
})
