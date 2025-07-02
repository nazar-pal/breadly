import { Storage } from '@/lib/storage/mmkv'
import { GUEST_KEY } from '@/lib/storage/mmkv/keys'
import {
  useUserSessionActions,
  useUserSessionInitializingState
} from '@/lib/storage/user-session-store'
import {
  handleAuthenticatedSession,
  handleGuestSession
} from '@/lib/utils/user-session'
import { useAuth } from '@clerk/clerk-expo'
import React, { useEffect } from 'react'
import { UserSessionLoading } from './user-session-loading'

// Bootstraps the correct session (guest or authenticated) and keeps the UI
// in a loading state until everything is ready.
export function UserSessionInitializer({
  children
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, userId: clerkId } = useAuth()
  const { session, isMigrating, isInitializing } =
    useUserSessionInitializingState()
  const { setIsInitializing } = useUserSessionActions()

  useEffect(() => {
    const initializeSession = async () => {
      if (isSignedIn && clerkId) {
        if (__DEV__)
          console.log(`🔍 Authenticated session detected: ${clerkId}`)
        await handleAuthenticatedSession(clerkId)
        if (__DEV__) console.log(`✅ Authenticated session ready: ${clerkId}`)
      } else {
        if (__DEV__) console.log('🔍 Guest session detected')
        await handleGuestSession()
        const guestId = Storage.getItem(GUEST_KEY)
        if (__DEV__) console.log(`✅ Guest session ready: ${guestId}`)
      }
    }
    setIsInitializing(true)
    initializeSession()
  }, [isSignedIn, clerkId, setIsInitializing])

  // Show loading state during initialization or migration
  if (isInitializing || isMigrating || !session) {
    return <UserSessionLoading />
  }

  return children
}
