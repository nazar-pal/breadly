import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'EXPO_PUBLIC_',

  server: {
    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_JWT_KEY: z.string().min(1),

    // Neon DB owner connection string
    DATABASE_URL: z.string().min(1),
    // Neon DB "authenticated" role connection string
    DATABASE_AUTHENTICATED_URL: z.string().min(1),

    SENTRY_AUTH_TOKEN: z.string().min(1)
  },

  client: {
    // API
    EXPO_PUBLIC_API_URL: z.string().optional(),

    EXPO_PUBLIC_APP_VARIANT: z.enum(['development', 'preview', 'production']),

    // Clerk
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),

    // PowerSync WebSocket Secure URL
    EXPO_PUBLIC_POWERSYNC_WSS: z.string().min(1),

    // RevenueCat
    EXPO_PUBLIC_REVENUECAT_IOS_API_KEY: z.string().min(1),
    EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY: z.string().min(1),

    // Ordering
    EXPO_PUBLIC_SORT_ORDER_INCREMENT: z.coerce
      .number()
      .int()
      .positive()
      .default(1000),

    // Sentry
    EXPO_PUBLIC_SENTRY_DSN: z.string().min(1)
  },

  runtimeEnv: {
    // API
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,

    EXPO_PUBLIC_APP_VARIANT: process.env.EXPO_PUBLIC_APP_VARIANT,

    // Clerk
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_JWT_KEY: process.env.CLERK_JWT_KEY,

    // Neon DB owner connection string
    DATABASE_URL: process.env.DATABASE_URL,
    // Neon DB "authenticated" role connection string
    DATABASE_AUTHENTICATED_URL: process.env.DATABASE_AUTHENTICATED_URL,

    // PowerSync WebSocket Secure URL
    EXPO_PUBLIC_POWERSYNC_WSS: process.env.EXPO_PUBLIC_POWERSYNC_WSS,

    // RevenueCat
    EXPO_PUBLIC_REVENUECAT_IOS_API_KEY:
      process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY:
      process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,

    // Ordering
    EXPO_PUBLIC_SORT_ORDER_INCREMENT:
      process.env.EXPO_PUBLIC_SORT_ORDER_INCREMENT,

    // Sentry
    EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN
  },

  emptyStringAsUndefined: true
})
