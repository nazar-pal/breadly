import { Storage } from '@/lib/storage'
import { randomUUID } from 'expo-crypto'
import { GUEST_KEY } from './constants'
import { userSessionStore } from './store'

export async function handleGuestSession() {
  const { actions } = userSessionStore.getState()
  const { setSession, setIsInitializing } = actions

  try {
    let guestId = Storage.getItem(GUEST_KEY)
    if (!guestId) {
      guestId = randomUUID()
      Storage.setItem(GUEST_KEY, guestId)
    }
    setSession({
      userId: guestId,
      isGuest: true
    })
  } catch (error) {
    console.error('Failed to handle guest session:', error)
    // Fallback: create a temporary session that won't persist
    const tempId = randomUUID()
    setSession({ userId: tempId, isGuest: true })
  } finally {
    setIsInitializing(false)
  }
}
