import { Stack } from 'expo-router'
import * as React from 'react'

export default function DbLayout() {
  if (!__DEV__) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Database' }} />
      <Stack.Screen name="[...slug]" options={{ title: 'Table' }} />
    </Stack>
  )
}
