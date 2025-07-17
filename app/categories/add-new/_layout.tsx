import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/lib/icons'
import { router, Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
              <ArrowLeft size={24} className="text-foreground" />
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
