import { CategoryType } from '@/data/client/db-schema'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
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
    <SafeAreaView
      className="flex-1 bg-background px-4"
      collapsable={false}
      edges={['bottom']}
      mode="padding"
    >
      <LayoutHeader activeCategoryType={type} />
      <Categories type={type} archived={archived} />
    </SafeAreaView>
  )
}
