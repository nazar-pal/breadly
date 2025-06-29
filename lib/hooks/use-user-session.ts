import { useUserSessionStore } from '@/lib/user-session'

export function useUserSession() {
  const session = useUserSessionStore(state => state.session)
  if (!session) throw new Error('User session not found')

  return session
}
