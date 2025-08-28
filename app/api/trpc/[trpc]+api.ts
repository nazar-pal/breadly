import { appRouter } from '@/data/server/api/root'
import { createTRPCContext } from '@/data/server/api/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Request-Method', '*')
  res.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.headers.set('Access-Control-Allow-Headers', '*')
}

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204
  })
  setCorsHeaders(response)
  return response
}

const handler = async (req: Request) => {
  // Enforce a per-request timeout shorter than Vercel's hard limit to avoid 504s
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000) // 25s

  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: () => createTRPCContext({ req }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error)
    }
  })

  setCorsHeaders(response)
  clearTimeout(timeout)
  return response
}

export { handler as GET, handler as POST }
