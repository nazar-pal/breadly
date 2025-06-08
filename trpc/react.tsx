import { createTRPCClient, httpBatchStreamLink, loggerLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@/server/api'

import { env } from '@/env'
import { getClerkInstance } from '@clerk/clerk-expo'
import { queryClient } from './query-client'

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: op =>
          __DEV__ || (op.direction === 'down' && op.result instanceof Error),
        colorMode: 'none'
      }),
      httpBatchStreamLink({
        transformer: SuperJSON,
        url: `${getBaseUrl()}/api/trpc`,
        async headers() {
          const headers = new Headers()
          headers.set('x-trpc-source', 'expo-react')
          headers.set('Content-Type', 'application/json')

          const clerkInstance = getClerkInstance()
          // Use `getToken()` to get the current session token
          const token = await clerkInstance.session?.getToken()

          if (token) {
            headers.set('Authorization', `Bearer ${token}`)
          }
          return Object.fromEntries(headers)
        }
      })
    ]
  }),
  queryClient
})

function getBaseUrl() {
  let url
  if (__DEV__) {
    url = 'http://localhost:8081'
  } else {
    url = `https://${env.EXPO_PUBLIC_API_URL}`
  }
  console.log('[trpc] getBaseUrl:', url)
  return url
}
