import { EditCategoriesHeaderNavBar } from '@/components/categories/categories-edit-header-nav-bar'
import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export default function EditCategoriesLayout() {
  return (
    <View className="flex-1 bg-background px-4" collapsable={false}>
      <EditCategoriesHeaderNavBar />
      <Slot />
    </View>
  )
}
