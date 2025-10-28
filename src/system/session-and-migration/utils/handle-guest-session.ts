import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { randomUUID } from 'expo-crypto'
import { userSessionStore } from '../store'

export async function handleGuestSession(): Promise<string> {
  const { actions } = userSessionStore.getState()
  const { setSession } = actions

  const {
    setNeedToSeedDefaultDataForGuestUser,
    setGuestId,
    guestId: currentGuestId
  } = sessionPersistentStore.getState()

  let guestId = currentGuestId
  let isNewGuestUser = false

  if (!guestId) {
    guestId = randomUUID()
    setGuestId(guestId)
    isNewGuestUser = true
  }

  setSession({
    userId: guestId,
    isGuest: true
  })

  // Seed defaults for new guests before UI shows
  if (isNewGuestUser) {
    setNeedToSeedDefaultDataForGuestUser(true)
  }

  return guestId
}
