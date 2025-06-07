import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchStreamLink, loggerLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { useState } from 'react'
import SuperJSON from 'superjson'

import type { AppRouter } from '@/server/api'

import { env } from '@/env'
import { createQueryClient } from './query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  // Server: always make a new query client
  if (typeof window === 'undefined') return createQueryClient()

  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: op =>
            __DEV__ || (op.direction === 'down' && op.result instanceof Error)
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + '/api/trpc',
          headers() {
            const headers = new Headers()
            headers.set('x-trpc-source', 'expo-react')
            return headers
          }
        })
      ]
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (env.EXPO_PUBLIC_API_URL) return `https://${env.EXPO_PUBLIC_API_URL}`

  return 'http://localhost:8081'
}
