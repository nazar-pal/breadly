import { useAuth } from '@clerk/clerk-expo'
import React, { useEffect } from 'react'
import { handleAuthenticatedSession } from '../../lib/user-session/lib/handle-authenticated-session'
import { handleGuestSession } from '../../lib/user-session/lib/handle-guest-session'
import { useUserSessionInitializingState } from '../../lib/user-session/lib/store'
import { UserSessionLoading } from './user-session-loading'

export function UserSessionInitializer({
  children
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, userId: clerkId } = useAuth()
  const { session, isMigrating, isInitializing } =
    useUserSessionInitializingState()

  useEffect(() => {
    if (isSignedIn && clerkId) {
      handleAuthenticatedSession(clerkId)
    } else {
      handleGuestSession()
    }
  }, [isSignedIn, clerkId])

  // Show loading state during initialization or migration
  if (isInitializing || isMigrating || !session) {
    return <UserSessionLoading />
  }

  return children
}
