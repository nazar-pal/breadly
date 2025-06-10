import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { ChevronLeft } from '@/lib/icons'
import { useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  const segments = useSegments()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) {
      // Redirect to home if user is signed in and tries to access auth screens
      router.replace('/')
    }
  }, [isSignedIn, segments, isLoaded, router])

  return (
    <View className="bg-background flex-1" style={{ paddingTop: insets.top }}>
      <Button
        variant="ghost"
        className="h-10 w-10 items-center justify-center rounded-full p-0"
        onPress={() => router.push('/(tabs)/settings')}
      >
        <ChevronLeft className="text-foreground" size={24} />
        <Text className="text-foreground">Back to settings</Text>
      </Button>

      <Slot />
    </View>
  )
}
