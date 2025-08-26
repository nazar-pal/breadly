import { Storage } from '@/lib/storage/mmkv'
import { GUEST_KEY } from '@/lib/storage/mmkv/keys'
import { useAuth } from '@clerk/clerk-expo'
import { useTheme } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import {
  useUserSessionActions,
  useUserSessionInitializingState
} from '../store'
import { handleAuthenticatedSession, handleGuestSession } from '../utils'

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

function UserSessionLoading() {
  const { colors } = useTheme()
  const { isMigrating, isInitializing } = useUserSessionInitializingState()

  let message = 'Loading user session...'
  if (isMigrating) message = 'Transferring your data to your account...'
  else if (isInitializing) message = 'Initializing your session...'

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
