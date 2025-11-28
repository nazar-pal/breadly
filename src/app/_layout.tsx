import { env } from '@/env'
import * as Sentry from '@sentry/react-native'
import { Stack, type ErrorBoundaryProps } from 'expo-router'
import React from 'react'
import '../global.css'

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  React.useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div style={{ padding: 16 }}>
      <h1>Something went wrong</h1>
      <p>{String(error?.message ?? error)}</p>
      <button onClick={retry}>Try again</button>
    </div>
  )
}

Sentry.init({
  dsn: env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
  enabled: env.EXPO_PUBLIC_APP_VARIANT !== 'development',
  environment: env.EXPO_PUBLIC_APP_VARIANT
})

export default Sentry.wrap(function RootLayoutWeb() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="(tabs)/index" />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
})
