import { seedDefaultDataForGuestUser } from '@/lib/powersync/data/seeding'
import { Storage } from '@/lib/storage/mmkv'
import { AUTO_MIGRATE_KEY, GUEST_KEY } from '@/lib/storage/mmkv/keys'
import { userSessionStore } from '@/lib/storage/user-session-store'
import { randomUUID } from 'expo-crypto'

export async function handleGuestSession() {
  const { actions } = userSessionStore.getState()
  const { setSession, setIsInitializing } = actions

  let guestId = Storage.getItem(GUEST_KEY)
  let isNewGuestUser = false

  if (!guestId) {
    guestId = randomUUID()
    Storage.setItem(GUEST_KEY, guestId)
    isNewGuestUser = true
  }

  setSession({
    userId: guestId,
    isGuest: true
  })

  // Seed defaults for new guests before UI shows
  if (isNewGuestUser) {
    if (__DEV__)
      console.log(`🆕 [GUEST_SESSION] New guest ${guestId} – seeding defaults`)

    const seeding = await seedDefaultDataForGuestUser(guestId)

    if (!seeding.success) {
      console.warn('⚠️ [GUEST_SESSION] Seeding failed:', seeding.error)
    }
  }

  // Clear auto-migrate flag (just in case)
  Storage.removeItem(AUTO_MIGRATE_KEY)

  // Only set initialization to false after seeding is complete
  // This ensures the app loading state persists until seeded data is available
  setIsInitializing(false)
}
