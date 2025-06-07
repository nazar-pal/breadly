import { appTestRouter } from './routers/_app-test'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  appTest: appTestRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
