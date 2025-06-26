import { Storage } from '@/lib/storage'
import { useAuth } from '@clerk/clerk-expo'
import { useTheme } from '@react-navigation/native'
import { randomUUID } from 'expo-crypto'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Text, View } from 'react-native'

type UserSession = {
  userId: string
  isGuest: boolean
}

const GUEST_KEY = 'guestUserId'
const AUTO_MIGRATE_KEY = 'AUTO_MIGRATE_AFTER_SIGNUP'

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
      // Determine if we should auto-migrate or ask the user.
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
        // Existing account – ask the user if they want to import the local (guest) data.
        try {
          const { getGuestDataStats } = await import(
            '@/lib/powersync/data/migrations'
          )

          const stats = await getGuestDataStats(existingGuestId)

          const message =
            stats.total > 0
              ? `We found ${stats.total} item${stats.total === 1 ? '' : 's'} created while using the app as a guest on this device. Would you like to sync this data to your account?\n\n• ${stats.transactions} transactions\n• ${stats.accounts} accounts\n• ${stats.categories} categories\n• ${stats.budgets} budgets\n• ${stats.attachments} attachments`
              : 'Would you like to sync the data you created while using the app as a guest on this device to your account?'

          const userChoice = await new Promise<boolean>(resolve => {
            Alert.alert(
              'Sync your data?',
              message,
              [
                {
                  text: 'Skip',
                  style: 'cancel',
                  onPress: () => resolve(false)
                },
                {
                  text: 'Sync',
                  onPress: () => resolve(true)
                }
              ],
              { cancelable: false }
            )
          })

          if (userChoice) {
            setIsMigrating(true)
            try {
              await migrateGuestDataToUser(existingGuestId, clerkUserId)
              console.log(
                '✅ Successfully migrated guest data after user consent'
              )
            } catch (error) {
              console.error(
                '❌ Failed to migrate guest data after consent:',
                error
              )
            } finally {
              setIsMigrating(false)
            }
          }
        } catch (err) {
          console.error('❌ Error while prompting for data migration:', err)
        }
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
