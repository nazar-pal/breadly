import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export const appTestRouter = createTRPCRouter({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string()
      })
    )
    .query(async opts => {
      await sleep(2000)
      return {
        greeting: `hello ${opts.input.text}`
      }
    })
})
// export type definition of API
export type AppTestRouter = typeof appTestRouter
