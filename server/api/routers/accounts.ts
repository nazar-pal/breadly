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
      // Build the values object based on account type
      const baseValues = {
        userId: ctx.session.userId,
        type: input.type,
        name: input.name,
        description: input.description,
        currencyId: input.currencyId,
        balance: input.balance,
        isArchived: input.isArchived
      }

      // Only include type-specific fields for the appropriate account type
      let values: any = { ...baseValues }

      if (input.type === 'saving') {
        values.savingsTargetAmount = input.savingsTargetAmount
        values.savingsTargetDate = input.savingsTargetDate
      } else if (input.type === 'debt') {
        values.debtInitialAmount = input.debtInitialAmount
        values.debtIsOwedToMe = input.debtIsOwedToMe ?? false // Default to false for debt accounts
        values.debtDueDate = input.debtDueDate
      }

      return await ctx.db
        .insert(accounts)
        .values(values)
        .returning({ id: accounts.id })
        .then(result => result[0])
    }),

  update: protectedProcedure
    .input(updateAccountSchema)
    .mutation(async ({ ctx, input }) => {
      // Build the update values based on account type
      const baseValues = {
        name: input.name,
        description: input.description,
        currencyId: input.currencyId,
        balance: input.balance,
        isArchived: input.isArchived
      }

      let values: any = { ...baseValues }

      // Only include type-specific fields for the appropriate account type
      if (input.type === 'saving') {
        values.savingsTargetAmount = input.savingsTargetAmount
        values.savingsTargetDate = input.savingsTargetDate
        // Explicitly set debt fields to null for saving accounts
        values.debtInitialAmount = null
        values.debtIsOwedToMe = null
        values.debtDueDate = null
      } else if (input.type === 'debt') {
        values.debtInitialAmount = input.debtInitialAmount
        values.debtIsOwedToMe = input.debtIsOwedToMe ?? false
        values.debtDueDate = input.debtDueDate
        // Explicitly set savings fields to null for debt accounts
        values.savingsTargetAmount = null
        values.savingsTargetDate = null
      } else if (input.type === 'payment') {
        // Explicitly set all type-specific fields to null for payment accounts
        values.savingsTargetAmount = null
        values.savingsTargetDate = null
        values.debtInitialAmount = null
        values.debtIsOwedToMe = null
        values.debtDueDate = null
      }

      return await ctx.db
        .update(accounts)
        .set(values)
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
