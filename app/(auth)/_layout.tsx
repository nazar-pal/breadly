import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { View } from 'react-native'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return (
    <View className="flex-1 bg-old-background">
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#FFFFFF' // old-surface
          },
          headerTintColor: '#6366F1', // old-primary
          headerTitleStyle: {
            color: '#1A202C', // old-text
            fontWeight: '600'
          },
          contentStyle: { backgroundColor: '#F5F5F5' } // old-background
        }}
      />
    </View>
  )
}
