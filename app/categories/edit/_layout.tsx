import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/lib/icons'
import { router, Stack } from 'expo-router'
import React from 'react'

export default function EditCategoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={24} className="text-foreground" />
          </Button>
        )
      }}
    >
      <Stack.Screen name="(main)" options={{ title: 'Edit Categories' }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Edit Category',
          animation: 'none'
        }}
      />
    </Stack>
  )
}
