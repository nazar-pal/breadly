import { Link, Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-old-background p-5">
        <Text className="mb-6 text-center text-xl font-semibold text-old-text">
          This screen doesn&apos;t exist.
        </Text>
        <Link href="/" className="rounded-lg bg-old-primary px-6 py-3">
          <Text className="text-center text-base font-semibold text-old-text-inverse">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  )
}
