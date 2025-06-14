import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod/v4'

export const env = createEnv({
  clientPrefix: 'EXPO_PUBLIC_',

  server: {
    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_JWT_KEY: z.string().min(1),

    // Neon DB owner connection string
    DATABASE_URL: z.string().min(1),
    // Neon DB "authenticated" role connection string
    DATABASE_AUTHENTICATED_URL: z.string().min(1)
  },

  client: {
    // API
    EXPO_PUBLIC_API_URL: z.string().optional(),

    // Clerk
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1)
  },

  runtimeEnv: {
    // API
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,

    // Clerk
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_JWT_KEY: process.env.CLERK_JWT_KEY,

    // Neon DB owner connection string
    DATABASE_URL: process.env.DATABASE_URL,
    // Neon DB "authenticated" role connection string
    DATABASE_AUTHENTICATED_URL: process.env.DATABASE_AUTHENTICATED_URL
  },

  emptyStringAsUndefined: true
})
