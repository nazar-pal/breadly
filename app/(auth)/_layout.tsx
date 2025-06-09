import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { View } from 'react-native'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#FFFFFF' // card
          },
          headerTintColor: '#6366F1', // old-primary
          headerTitleStyle: {
            color: '#1A202C', // foreground
            fontWeight: '600'
          },
          contentStyle: { backgroundColor: '#F5F5F5' } // background
        }}
      />
    </View>
  )
}
