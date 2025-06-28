import { Storage } from '@/lib/storage'
import { useAuth } from '@clerk/clerk-expo'
import { useTheme } from '@react-navigation/native'
import { randomUUID } from 'expo-crypto'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

type UserSession = {
  userId: string
  isGuest: boolean
}

const GUEST_KEY = 'guestUserId'
export const AUTO_MIGRATE_KEY = 'AUTO_MIGRATE_AFTER_SIGNUP'

const UserContext = React.createContext<UserSession | undefined>(undefined)

// Loading component for user session initialization
function UserSessionLoading({ message }: { message: string }) {
  const { colors } = useTheme()

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="items-center space-y-6">
        {/* Loading spinner */}
        <View className="rounded-full bg-primary/10 p-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>

        {/* Loading message */}
        <View className="items-center space-y-2">
          <Text className="text-xl font-semibold text-foreground">
            {message}
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            This will only take a moment
          </Text>
        </View>
      </View>
    </View>
  )
}

// Migration function to move data from guest ID to authenticated ID
async function migrateGuestDataToUser(
  guestUserId: string,
  authenticatedUserId: string
) {
  const { migrateGuestDataToAuthenticatedUser } = await import(
    '@/lib/powersync/data/migrations'
  )

  console.log(
    `Migrating data from guest ${guestUserId} to user ${authenticatedUserId}`
  )

  const result = await migrateGuestDataToAuthenticatedUser(
    guestUserId,
    authenticatedUserId
  )

  if (!result.success) {
    throw result.error || new Error('Migration failed')
  }

  // Clear the guest ID after successful migration
  Storage.removeItem(GUEST_KEY)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, userId: clerkId } = useAuth()
  const [session, setSession] = useState<UserSession | null>(null)
  const [isMigrating, setIsMigrating] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  async function handleGuestSession() {
    try {
      let guestId = Storage.getItem(GUEST_KEY)
      if (!guestId) {
        guestId = randomUUID()
        Storage.setItem(GUEST_KEY, guestId)
      }
      setSession({
        userId: guestId,
        isGuest: true
      })
    } catch (error) {
      console.error('Failed to handle guest session:', error)
      // Fallback: create a temporary session that won't persist
      const tempId = randomUUID()
      setSession({ userId: tempId, isGuest: true })
    } finally {
      setIsInitializing(false)
    }
  }

  async function handleAuthenticatedSession(clerkUserId: string) {
    setIsInitializing(false)

    const existingGuestId = Storage.getItem(GUEST_KEY)

    if (existingGuestId && !isMigrating) {
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

    setSession({ userId: clerkUserId, isGuest: false })
  }

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && clerkId) {
      handleAuthenticatedSession(clerkId)
    } else {
      handleGuestSession()
    }
  }, [isLoaded, isSignedIn, clerkId])

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

export function useUserSession(): UserSession {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(
      'useUserSession must be used within a UserProvider and after session is initialized'
    )
  }
  return context
}
