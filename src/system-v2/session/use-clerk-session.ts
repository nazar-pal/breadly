import { storage } from '@/lib/storage/mmkv'
import { useAuth } from '@clerk/clerk-expo'
import { randomUUID } from 'expo-crypto'
import { useEffect } from 'react'
import { GUEST_DATA_STORAGE_KEY } from '../const/storage-keys'
import { sessionStore, useSession } from './session-store'

/**
 * Get or create guest ID from persistent storage
 * If creating a new ID, persists it immediately to prevent data loss on crash
 */
function getOrCreateGuestId(): string {
  const persisted = storage.getString(GUEST_DATA_STORAGE_KEY)
  if (persisted) {
    try {
      const parsed = JSON.parse(persisted)
      if (parsed.state?.guestId) {
        return parsed.state.guestId
      }
    } catch {
      // Ignore parse errors, create new guest ID
    }
  }

  // Create and persist new guest ID immediately
  const newGuestId = randomUUID()
  storage.set(
    GUEST_DATA_STORAGE_KEY,
    JSON.stringify({ state: { guestId: newGuestId } })
  )
  return newGuestId
}

/**
 * Hook that syncs Clerk auth state to our session store
 * Creates a guest session for unauthenticated users
 */
export function useClerkSession() {
  const { isSignedIn, userId: clerkId } = useAuth()
  const { session } = useSession()

  useEffect(() => {
    // Access action directly from store (not a hook) to avoid hooks order violation
    // Zustand actions from getState() are stable references
    const { setSession } = sessionStore.getState().actions

    if (isSignedIn && clerkId) {
      // User is authenticated - set auth session
      // Only update if session doesn't match
      if (!session || session.userId !== clerkId || session.isGuest) {
        setSession({ userId: clerkId, isGuest: false })
      }
    } else {
      // User is not authenticated
      // Only create guest session if one doesn't exist or current session is not guest
      if (!session || !session.isGuest) {
        const guestId = getOrCreateGuestId()
        setSession({ userId: guestId, isGuest: true })
      }
    }
  }, [isSignedIn, clerkId, session])
}
