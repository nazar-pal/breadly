import { Stack } from 'expo-router'
import React from 'react'
import './global.css'

export { ErrorBoundary } from 'expo-router'

export default function RootLayoutWeb() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
