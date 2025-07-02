import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { LogOut } from '@/lib/icons'
import { userSessionStore } from '@/lib/storage/user-session-store'
import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { View } from 'react-native'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    try {
      await signOut()
      // Immediately reset the client-side session so UI reverts to guest state instantly
      userSessionStore.setState({ session: null })
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }
  return (
    <Button
      variant="destructive"
      onPress={handleSignOut}
      className="h-14 w-full rounded-xl"
    >
      <View className="flex-row items-center gap-2">
        <LogOut size={20} className="text-destructive-foreground" />
        <Text className="text-base font-semibold">Sign Out</Text>
      </View>
    </Button>
  )
}
