import { env } from '@/env'
import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { schema } from './db-schema'

// start TODO: remove this once we have a proper serverless db
// import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless'
// const db = drizzleServerless(env.DATABASE_AUTHENTICATED_URL, {
//   schema,
//   casing: 'snake_case'
// })
// export { db }
// end TODO

// Improve stability on serverless runtimes (Vercel):
// - Reuse fetch connections within the same lambda invocation
// - Fail fast instead of hanging until the Vercel max runtime
neonConfig.fetchConnectionCache = true

export const db = drizzle(neon(env.DATABASE_AUTHENTICATED_URL), {
  schema,
  casing: 'snake_case'
})
