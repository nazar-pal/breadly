import { Button } from '@/components/ui/button'
import { iconWithClassName } from '@/lib/icons/iconWithClassName'
import { router, Stack } from 'expo-router'
import { ArrowLeftIcon } from 'lucide-react-native'
import React from 'react'

iconWithClassName(ArrowLeftIcon)

export default function EditCategoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeftIcon className="text-foreground" />
          </Button>
        )
      }}
    >
      <Stack.Screen name="(main)" options={{ title: 'Edit Categories' }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Edit Category'
        }}
      />
    </Stack>
  )
}
