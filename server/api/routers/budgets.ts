import { budgets } from '@/server/db/schema/table_5_budgets'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const createBudgetSchema = createInsertSchema(budgets)
export const updateBudgetSchema = createUpdateSchema(budgets).required({
  id: true
})

export const budgetsRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.budgets.findFirst({
        where: and(
          eq(budgets.id, input.id),
          eq(budgets.userId, ctx.session.userId)
        )
      })
      if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
      return result
    }),

  getByIdWithCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.budgets.findFirst({
        where: and(
          eq(budgets.id, input.id),
          eq(budgets.userId, ctx.session.userId)
        ),
        with: {
          category: true
        }
      })
      if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
      return result
    }),

  create: protectedProcedure
    .input(createBudgetSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(budgets)
        .values({
          ...input,
          userId: ctx.session.userId
        })
        .returning({ id: budgets.id })
        .then(result => result[0])
    }),

  update: protectedProcedure
    .input(updateBudgetSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(budgets)
        .set(input)
        .where(
          and(eq(budgets.id, input.id), eq(budgets.userId, ctx.session.userId))
        )
        .returning({ id: budgets.id })
        .then(result => result[0])
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(budgets)
        .where(
          and(eq(budgets.id, input.id), eq(budgets.userId, ctx.session.userId))
        )
        .returning({ id: budgets.id })
        .then(result => result[0])
    })
})
