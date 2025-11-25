import { CategoryType } from '@/data/client/db-schema'
import React from 'react'
import { View } from 'react-native'
import { TabsCategoriesNavBar } from './tabs-categories-nav-bar'
import { TabsCategoriesUpperHeader } from './tabs-categories-upper-header'

export function TabsCategoriesHeader({ type }: { type: CategoryType }) {
  return (
    <View className="border-b border-border/60 bg-background/95 px-4 py-2">
      <TabsCategoriesUpperHeader />
      <TabsCategoriesNavBar type={type} />
    </View>
  )
}
