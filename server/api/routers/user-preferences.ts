import { userPreferences } from '@/server/db/schema/table_3_user-preferences'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const createUserPreferencesSchema = createInsertSchema(userPreferences)
export const updateUserPreferencesSchema = createUpdateSchema(
  userPreferences
).required({
  userId: true
})

export const userPreferencesRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, ctx.session.userId),
      with: {
        defaultCurrency: true
      }
    })
    if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
    return result
  }),

  create: protectedProcedure
    .input(createUserPreferencesSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(userPreferences)
        .values({
          ...input,
          userId: ctx.session.userId
        })
        .returning({ userId: userPreferences.userId })
        .then(result => result[0])
    }),

  update: protectedProcedure
    .input(updateUserPreferencesSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(userPreferences)
        .set(input)
        .where(eq(userPreferences.userId, ctx.session.userId))
        .returning({ userId: userPreferences.userId })
        .then(result => result[0])
    }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db
      .delete(userPreferences)
      .where(eq(userPreferences.userId, ctx.session.userId))
      .returning({ userId: userPreferences.userId })
      .then(result => result[0])
  })
})
