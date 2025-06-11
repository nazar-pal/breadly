import { categories } from '@/server/db/schema/table_4_categories'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const createCategorySchema = createInsertSchema(categories)
export const updateCategorySchema = createUpdateSchema(categories).required({
  id: true
})

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.categories.findMany({
      where: eq(categories.userId, ctx.session.userId)
    })
    return result
  }),

  getAllWithBudgets: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.categories.findMany({
      where: eq(categories.userId, ctx.session.userId),
      with: {
        budgets: true
      }
    })
    return result
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.categories.findFirst({
        where: and(
          eq(categories.id, input.id),
          eq(categories.userId, ctx.session.userId)
        )
      })
      if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
      return result
    }),

  getByIdWithBudgets: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.categories.findFirst({
        where: and(
          eq(categories.id, input.id),
          eq(categories.userId, ctx.session.userId)
        ),
        with: {
          budgets: true
        }
      })
      if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
      return result
    }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(categories)
        .values(input)
        .returning({ id: categories.id })
        .then(result => result[0])
    }),

  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(categories)
        .set(input)
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.userId, ctx.session.userId)
          )
        )
        .returning({ id: categories.id })
        .then(result => result[0])
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(categories)
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.userId, ctx.session.userId)
          )
        )
        .returning({ id: categories.id })
        .then(result => result[0])
    })
})
