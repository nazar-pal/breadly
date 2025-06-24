import { AccountModal } from '@/components/accounts/modal-account'
import { Stack } from 'expo-router'
import * as React from 'react'

export default function ProtectedLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="expenses" />
        <Stack.Screen name="accounts" />
        <Stack.Screen name="+not-found" />
      </Stack>

      <AccountModal />
    </>
  )
}
