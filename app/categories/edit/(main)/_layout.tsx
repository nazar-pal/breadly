import { CategoriesHeaderNavBar } from '@/components/categories/categories-header-nav-bar'
import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export default function EditCategoriesLayout() {
  return (
    <View className="flex-1 bg-background" collapsable={false}>
      <CategoriesHeaderNavBar isEditMode={true} />
      <Slot />
    </View>
  )
}
