import { useAuth } from '@clerk/clerk-expo'
import React, { useEffect } from 'react'
import { handleAuthenticatedSession } from './handle-authenticated-session'
import { handleGuestSession } from './handle-guest-session'
import { useActions, useUserSessionInitializingState } from './store'
import { UserSessionLoading } from './user-session-loading'

export function InitializeUserSession({
  children
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, userId: clerkId } = useAuth()
  const { session, isMigrating, isInitializing } =
    useUserSessionInitializingState()
  const { setSession, setIsMigrating, setIsInitializing } = useActions()

  useEffect(() => {
    if (isSignedIn && clerkId) {
      handleAuthenticatedSession({
        clerkUserId: clerkId,
        setSession,
        setIsInitializing,
        setIsMigrating,
        isMigrating
      })
    } else {
      handleGuestSession({
        setSession,
        setIsInitializing
      })
    }
  }, [
    isSignedIn,
    clerkId,
    setSession,
    setIsInitializing,
    setIsMigrating,
    isMigrating,
    isInitializing
  ])

  // Show loading state during initialization or migration
  if (isInitializing || isMigrating || !session) {
    return <UserSessionLoading />
  }

  return children
}
