import { useSession } from './session-store'

/**
 * Compatibility hook that matches the old useUserSession API
 * Throws if session is not available (matching old behavior)
 */
export function useUserSession() {
  const { session } = useSession()
  if (!session) {
    throw new Error('User session not found')
  }
  return session
}
