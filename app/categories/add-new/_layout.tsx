import { Button } from '@/components/ui/button'
import { iconWithClassName } from '@/lib/icons/iconWithClassName'
import { router, Stack } from 'expo-router'
import { ArrowLeftIcon } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

iconWithClassName(ArrowLeftIcon)

export default function AddNewCategoryLayout() {
  const insets = useSafeAreaInsets()
  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <Stack
        screenOptions={{
          headerLeft: () => (
            <Button variant="ghost" size="icon" onPress={() => router.back()}>
              <ArrowLeftIcon className="text-foreground" />
            </Button>
          )
        }}
      >
        <Stack.Screen
          name="expense"
          options={{
            title: 'Add Expense Category'
          }}
        />
        <Stack.Screen
          name="income"
          options={{
            title: 'Add Income Category'
          }}
        />
      </Stack>
    </View>
  )
}
