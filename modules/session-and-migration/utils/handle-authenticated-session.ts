import { userSessionStore } from '../store'

export async function handleAuthenticatedSession(clerkUserId: string) {
  const { actions } = userSessionStore.getState()
  const { setSession } = actions

  setSession({ userId: clerkUserId, isGuest: false })
}
