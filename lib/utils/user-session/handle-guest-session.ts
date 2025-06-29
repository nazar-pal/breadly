import { Storage } from '@/lib/storage/mmkv'
import { GUEST_KEY } from '@/lib/storage/mmkv/keys'
import { userSessionStore } from '@/lib/storage/user-session-store'
import { randomUUID } from 'expo-crypto'

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
