import { accounts } from '@/server/db/schema/table_6_accounts'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const createAccountSchema = createInsertSchema(accounts)
export const updateAccountSchema = createUpdateSchema(accounts).required({
  id: true
})

export const accountsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.accounts.findMany({
      where: eq(accounts.userId, ctx.session.userId),
      with: {
        currency: true
      }
    })
    if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
    return result
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.accounts.findFirst({
        where: and(
          eq(accounts.id, input.id),
          eq(accounts.userId, ctx.session.userId)
        ),
        with: {
          currency: true
        }
      })
      if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
      return result
    }),

  create: protectedProcedure
    .input(createAccountSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(accounts)
        .values({
          ...input,
          userId: ctx.session.userId
        })
        .returning({ id: accounts.id })
        .then(result => result[0])
    }),

  update: protectedProcedure
    .input(updateAccountSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(accounts)
        .set(input)
        .where(
          and(
            eq(accounts.id, input.id),
            eq(accounts.userId, ctx.session.userId)
          )
        )
        .returning({ id: accounts.id })
        .then(result => result[0])
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(accounts)
        .where(
          and(
            eq(accounts.id, input.id),
            eq(accounts.userId, ctx.session.userId)
          )
        )
        .returning({ id: accounts.id })
        .then(result => result[0])
    })
})
