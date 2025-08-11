import { powerSyncDb } from '@/data/client/powersync/system'
import { Storage } from '@/lib/storage/mmkv'
import { AUTO_MIGRATE_KEY, GUEST_KEY } from '@/lib/storage/mmkv/keys'
import { asyncTryCatch } from '@/lib/utils'
import { migrateGuestDataToAuthenticatedUser } from '../data/mutations'
import { userSessionStore } from '../store'

export async function handleAuthenticatedSession(clerkUserId: string) {
  const { actions } = userSessionStore.getState()
  const { setSession, setIsInitializing, setIsMigrating } = actions

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

        if (__DEV__)
          console.log(
            `🔍 Migrating data from guest ${existingGuestId} to user ${clerkUserId}`
          )
        const [error] = await asyncTryCatch(
          migrateGuestDataToAuthenticatedUser(existingGuestId, clerkUserId)
        )
        if (error) {
          if (__DEV__) console.error('❌ Failed to migrate guest data:', error)
          // IMPORTANT: Do NOT clear flags/guest key on failure so we can retry
          // on the next app start or present a retry prompt.
          setIsMigrating(false)
        } else {
          if (__DEV__) console.log('✅ Guest data migrated!')
          // Clear flags & guest key so next guest session starts fresh
          Storage.removeItem(AUTO_MIGRATE_KEY)
          Storage.removeItem(GUEST_KEY)
          setIsMigrating(false)
        }
      } else {
        // Existing account sign-in – discard any local guest data to avoid
        // uploading default categories/accounts that were seeded locally.
        if (__DEV__)
          console.log(
            '🔒 Existing account sign-in – skip guest data and clear local DB'
          )

        const [clearError] = await asyncTryCatch(
          powerSyncDb.disconnectAndClear({ clearLocal: true })
        )

        if (clearError) {
          console.error(
            'Failed to clear PowerSync DB on existing sign-in:',
            clearError
          )
        } else {
          if (__DEV__) console.log('🗑️ Local PowerSync database cleared')
          // Rely on PowerSyncContextProvider to reconnect based on isSignedIn
        }

        // Remove any stored guest identifier so future guest sessions start fresh
        Storage.removeItem(GUEST_KEY)
      }
    }
  }

  // Clear stale auto-migrate flag when authenticated without a guest
  if (!existingGuestId && Storage.getItem(AUTO_MIGRATE_KEY) === 'true') {
    if (__DEV__) console.log('🧹 Clearing stale AUTO_MIGRATE_KEY')
    Storage.removeItem(AUTO_MIGRATE_KEY)
  }

  setSession({ userId: clerkUserId, isGuest: false })
  setIsInitializing(false)
}
