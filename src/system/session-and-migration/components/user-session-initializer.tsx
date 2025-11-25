import { useAuth } from '@clerk/clerk-expo'
import React, { useEffect } from 'react'
import {
  useUserSessionActions,
  useUserSessionInitializingState
} from '../store'
import { handleAuthenticatedSession, handleGuestSession } from '../utils'
import { UserSessionLoading } from './user-session-loading'

// Bootstraps the correct session (guest or authenticated) and keeps the UI
// in a loading state until everything is ready.
export function UserSessionInitializer({
  children
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, userId: clerkId } = useAuth()

  const { session, isInitializing } = useUserSessionInitializingState()
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
        const guestId = await handleGuestSession()
        if (__DEV__) console.log(`✅ Guest session ready: ${guestId}`)
      }
    }
    let mounted = true
    ;(async () => {
      setIsInitializing(true)
      try {
        await initializeSession()
      } finally {
        if (mounted) setIsInitializing(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [isSignedIn, clerkId, setIsInitializing])

  // Show loading state during initialization or migration
  if (isInitializing || !session) {
    return <UserSessionLoading message="Initializing your session..." />
  }

  return children
}
