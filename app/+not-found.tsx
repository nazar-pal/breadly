import { Link, Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="bg-background flex-1 items-center justify-center p-5">
        <Text className="text-foreground mb-6 text-center text-xl font-semibold">
          This screen doesn&apos;t exist.
        </Text>
        <Link href="/" className="rounded-lg px-6 py-3">
          <Text className="text-foreground text-center text-base font-semibold">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  )
}
