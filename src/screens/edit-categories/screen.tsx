import { CategoryType } from '@/data/client/db-schema'
import React from 'react'
import { View } from 'react-native'
import { Categories } from './components/categories'
import { LayoutHeader } from './components/layout-header'

export default function EditCategoriesLayout({
  type,
  archived
}: {
  type: CategoryType
  archived: boolean
}) {
  return (
    <View className="bg-background flex-1 px-4">
      <LayoutHeader activeCategoryType={type} />
      <Categories type={type} archived={archived} />
    </View>
  )
}
