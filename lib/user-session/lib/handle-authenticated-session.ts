import { Storage } from '@/lib/storage/mmkv'
import { AUTO_MIGRATE_KEY, GUEST_KEY } from '../../storage/mmkv/keys'
import { userSessionStore } from '../../storage/user-session-store'
import { migrateGuestDataToUser } from './migrate-guest-data'

export async function handleAuthenticatedSession(clerkUserId: string) {
  const { actions } = userSessionStore.getState()
  const { setSession, setIsInitializing, setIsMigrating } = actions

  setIsInitializing(false)

  const existingGuestId = Storage.getItem(GUEST_KEY)

  if (existingGuestId) {
    // Check if migration is already in progress
    const { isMigrating } = userSessionStore.getState()

    if (!isMigrating) {
      // Only auto-migrate for new accounts that just signed up
      const shouldAutoMigrate = Storage.getItem(AUTO_MIGRATE_KEY) === 'true'

      if (shouldAutoMigrate) {
        // New account that was just created – migrate automatically.
        setIsMigrating(true)
        try {
          await migrateGuestDataToUser(existingGuestId, clerkUserId)
          console.log(
            '✅ Successfully migrated guest data to authenticated user'
          )
        } catch (error) {
          console.error('❌ Failed to migrate guest data:', error)
        } finally {
          // Clean up flag regardless of success.
          Storage.removeItem(AUTO_MIGRATE_KEY)
          setIsMigrating(false)
        }
      } else {
        // Existing account sign-in – clear guest ID without migration
        // This ensures existing cloud data takes precedence
        Storage.removeItem(GUEST_KEY)
        console.log(
          '🔒 Signed into existing account, prioritizing cloud data over local guest data'
        )
      }
    }
  }

  setSession({ userId: clerkUserId, isGuest: false })
}
