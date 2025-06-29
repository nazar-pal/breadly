import { useAuth } from '@clerk/clerk-expo'
import React, { useEffect, useState } from 'react'
import { handleAuthenticatedSession } from './handle-authenticated-session'
import { handleGuestSession } from './handle-guest-session'
import { UserSessionLoading } from './user-session-loadin'

export type UserSession = {
  userId: string
  isGuest: boolean
}

export const UserContext = React.createContext<UserSession | undefined>(
  undefined
)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, userId: clerkId } = useAuth()
  const [session, setSession] = useState<UserSession | null>(null)
  const [isMigrating, setIsMigrating] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

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
      handleGuestSession({ setSession, setIsInitializing })
    }
  }, [isSignedIn, clerkId])

  // Show loading state during initialization or migration
  if (isInitializing || isMigrating || !session) {
    let message = 'Loading user session...'

    if (isMigrating) {
      message = 'Transferring your data to your account...'
    } else if (isInitializing) {
      message = 'Initializing your session...'
    }

    return <UserSessionLoading message={message} />
  }

  return <UserContext.Provider value={session}>{children}</UserContext.Provider>
}
