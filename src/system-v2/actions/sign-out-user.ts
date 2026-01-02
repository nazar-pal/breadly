import { storage } from '@/lib/storage/mmkv'
import { getClerkInstance } from '@clerk/clerk-expo'
import { randomUUID } from 'expo-crypto'
import * as Linking from 'expo-linking'
import { GUEST_DATA_STORAGE_KEY } from '../const/storage-keys'
import { powersync } from '../powersync/database'
import { persistedSyncState } from '../session/persistent-state'
import type { SyncEvent } from '../state-machine/events'
import { seedGuestData } from './seed-guest-data'
import { switchToLocalSchema } from './switch-to-local-schema'

/**
 * Performs the sign-out side effects and returns SIGN_OUT_COMPLETE event.
 * Called from executeStateAction when in 'signing_out' state.
 *
 * Flow:
 * 1. Signs out from Clerk
 * 2. Disconnects PowerSync and clears synced data
 * 3. Switches to local-only schema
 * 4. Creates a new guest session with seeded data
 * 5. Clears persisted sync state
 * 6. Redirects to home
 *
 * Note: Session update is handled by the orchestrator after SIGN_OUT_COMPLETE
 * event is dispatched to avoid race conditions.
 */
export async function performSignOut(): Promise<SyncEvent> {
  try {
    // Step 1: Sign out from Clerk
    const clerk = getClerkInstance()
    await clerk.signOut()

    // Step 2: Disconnect PowerSync and clear ALL local data (synced + local tables)
    // Note: disconnectAndClear handles already-disconnected state gracefully
    await powersync.disconnectAndClear({ clearLocal: true })

    // Step 3: Switch to local-only schema
    // Note: switchToLocalSchema's disconnect check will be a no-op since we already disconnected above
    await switchToLocalSchema(powersync)

    // Step 4: Create new guest session
    const newGuestUserId = randomUUID()

    // Seed default data for new guest
    await seedGuestData(newGuestUserId)

    // Step 5: Persist the new guest ID for future sessions
    storage.set(
      GUEST_DATA_STORAGE_KEY,
      JSON.stringify({ state: { guestId: newGuestUserId } })
    )

    // Step 6: Clear persisted sync state (will be recreated with guest state)
    persistedSyncState.clear()

    if (__DEV__) {
      console.log(`✅ Sign out successful. New guest ID: ${newGuestUserId}`)
    }

    // Step 7: Redirect to home page
    Linking.openURL(Linking.createURL('/'))

    // Return SIGN_OUT_COMPLETE with new guest ID
    // Session update will be handled by orchestrator after this event is dispatched
    return { type: 'SIGN_OUT_COMPLETE', newGuestId: newGuestUserId }
  } catch (error) {
    console.error('Sign out failed:', error)
    return {
      type: 'ERROR',
      error: error instanceof Error ? error : new Error(String(error))
    }
  }
}
