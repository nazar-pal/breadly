import { Stack } from 'expo-router'
import * as React from 'react'

export default function DbLayout() {
  if (!__DEV__) return null

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[...slug]" />
    </Stack>
  )
}
