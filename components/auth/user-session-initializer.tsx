import { useUserSessionInitializingState } from '@/lib/storage/user-session-store'
import {
  handleAuthenticatedSession,
  handleGuestSession
} from '@/lib/utils/user-session'
import { useAuth } from '@clerk/clerk-expo'
import React, { useEffect } from 'react'
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
