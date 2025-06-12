import { useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  if (!isLoaded) return null

  if (isSignedIn) router.replace('/')

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Slot />
    </View>
  )
}
