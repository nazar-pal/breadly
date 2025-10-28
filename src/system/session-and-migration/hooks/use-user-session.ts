import { useUserSessionStore } from '../store'

export function useUserSession() {
  const session = useUserSessionStore(state => state.session)
  if (!session) throw new Error('User session not found')

  return session
}
