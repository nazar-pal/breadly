import { useTheme } from '@/context/ThemeContext'
import { Link, Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function NotFoundScreen() {
  const { colors } = useTheme()

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View
        className="flex-1 items-center justify-center p-5"
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className="mb-6 text-center text-xl font-semibold"
          style={{ color: colors.text }}
        >
          This screen doesn&apos;t exist.
        </Text>
        <Link
          href="/"
          className="rounded-lg px-6 py-3"
          style={{ backgroundColor: colors.primary }}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{ color: colors.textInverse }}
          >
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  )
}
