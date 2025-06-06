import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'EXPO_PUBLIC_',

  server: {
    // Neon DB owner connection string
    DATABASE_URL: z.string().min(1),
    // Neon DB "authenticated" role connection string
    DATABASE_AUTHENTICATED_URL: z.string().min(1)
  },

  client: {
    // Clerk
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1)
  },

  runtimeEnv: {
    // Clerk
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,

    // Neon DB owner connection string
    DATABASE_URL: process.env.DATABASE_URL,
    // Neon DB "authenticated" role connection string
    DATABASE_AUTHENTICATED_URL: process.env.DATABASE_AUTHENTICATED_URL
  },

  emptyStringAsUndefined: true
})
