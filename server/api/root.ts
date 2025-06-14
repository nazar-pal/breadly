import { appTestRouter } from './routers/_app-test'
import { accountsRouter } from './routers/accounts'
import { attachmentsRouter } from './routers/attachments'
import { budgetsRouter } from './routers/budgets'
import { categoriesRouter } from './routers/categories'
import { transactionsRouter } from './routers/transactions'
import { userPreferencesRouter } from './routers/user-preferences'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  appTest: appTestRouter,
  accounts: accountsRouter,
  attachments: attachmentsRouter,
  budgets: budgetsRouter,
  categories: categoriesRouter,
  transactions: transactionsRouter,
  userPreferences: userPreferencesRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
