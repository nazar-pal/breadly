import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http'
import { appRouter } from '../../data/server/api/root'
import { createTRPCContext } from '../../data/server/api/trpc'

const allowOrigin = '*'

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin)
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.status(204).end()
    return
  }

  // Minimal Web Request for auth (headers-only) used by Clerk in context
  const authHeaders = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') authHeaders.set(key, value)
    else if (Array.isArray(value)) authHeaders.set(key, value.join(','))
  }
  const authReq = new Request('http://localhost', { headers: authHeaders })

  // CORS
  res.setHeader('Access-Control-Allow-Origin', allowOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.setHeader('Access-Control-Allow-Headers', '*')

  await nodeHTTPRequestHandler({
    req,
    res,
    path: '/api/trpc',
    router: appRouter,
    createContext: async () => createTRPCContext({ req: authReq }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error)
    }
  })
}
