import { CategoriesHeaderNavBar } from '@/components/categories/categories-header-nav-bar'
import { CategoryViewToggle } from '@/components/categories/category-view-toggle'
import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export default function EditCategoriesLayout() {
  return (
    <View className="flex-1 bg-background" collapsable={false}>
      <CategoriesHeaderNavBar isEditMode={true} />
      <CategoryViewToggle />
      <Slot />
    </View>
  )
}
