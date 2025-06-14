import { z } from 'zod/v4'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const appTestRouter = createTRPCRouter({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string()
      })
    )
    .query(async opts => {
      return {
        greeting: `hello ${opts.input.text}`
      }
    }),
  testAuth: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId
    return {
      userId
    }
  })
})
// export type definition of API
export type AppTestRouter = typeof appTestRouter
