import { LayoutHeader } from '@/screens/categories'
import { Slot } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditCategoriesLayout() {
  return (
    <SafeAreaView
      className="flex-1 bg-background px-4"
      collapsable={false}
      edges={['bottom']}
      mode="padding"
    >
      <LayoutHeader />
      <Slot />
    </SafeAreaView>
  )
}
