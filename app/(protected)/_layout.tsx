import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import * as React from 'react'

export default function ProtectedLayout() {
  const authState = useAuth()

  if (!authState.isLoaded) {
    return null
  }

  if (!authState.isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="expenses" />
      <Stack.Screen name="accounts" />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
