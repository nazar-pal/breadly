import { createClerkClient } from '@clerk/backend'

export const getServerSession = async (req: Request) => {
  try {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
    })

    const requestState = await clerkClient.authenticateRequest(req, {
      jwtKey: process.env.CLERK_JWT_KEY
      // TODO: Add authorizedParties
      // authorizedParties: ['https://example.com']
    })

    const { userId, getToken } = requestState?.toAuth() || {}

    if (typeof getToken !== 'function' || typeof userId !== 'string') {
      return null
    }

    const authToken = await getToken()
    if (typeof authToken !== 'string') {
      return null
    }

    return {
      userId,
      authToken
    }
  } catch (error) {
    console.error('Error authenticating request:', error)
    return null
  }
}
