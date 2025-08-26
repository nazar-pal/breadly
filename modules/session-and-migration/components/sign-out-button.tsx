import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { asyncTryCatch } from '@/lib/utils'
import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { View } from 'react-native'
import { userSessionStore } from '../store'
import { resetDatabaseAndCreateNewGuestSession } from '../utils'

export function SignOutButton() {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    try {
      // Step 1: Sign out from Clerk
      await signOut()

      // Step 2: Reset PowerSync database and create new guest session
      if (__DEV__) console.log('🔄 Starting database reset after sign out')
      const [error, newGuestUserId] = await asyncTryCatch(
        resetDatabaseAndCreateNewGuestSession()
      )

      if (!error) {
        if (__DEV__)
          console.log(
            `✅ Database reset successful. New guest ID: ${newGuestUserId}`
          )

        // Step 3: Update user session store to guest state with new ID
        userSessionStore.setState({
          session: {
            userId: newGuestUserId,
            isGuest: true
          },
          isInitializing: false
        })
      } else {
        console.error('❌ Database reset failed:', error)
        // Fallback: just reset to null session state
        userSessionStore.setState({ session: null, isInitializing: true })
      }

      // Step 4: Redirect to home page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Sign out failed:', JSON.stringify(err, null, 2))

      // Fallback: reset session state even if sign out failed
      userSessionStore.setState({ session: null, isInitializing: true })
    }
  }

  return (
    <Button
      variant="destructive"
      onPress={handleSignOut}
      className="h-14 w-full rounded-xl"
    >
      <View className="flex-row items-center gap-2">
        <Icon name="LogOut" size={20} className="text-destructive-foreground" />
        <Text className="text-base font-semibold">Sign Out</Text>
      </View>
    </Button>
  )
}
