import { Stack } from 'expo-router'
import * as React from 'react'
import 'react-native-reanimated'

export default function ImportLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="categories"
        options={{ title: 'Import Categories' }}
      />
    </Stack>
  )
}
