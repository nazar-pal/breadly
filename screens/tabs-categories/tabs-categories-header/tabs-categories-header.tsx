import React from 'react'
import { View } from 'react-native'
import { TabsCategoriesNavBar } from './tabs-categories-nav-bar'
import { TabsCategoriesUpperHeader } from './tabs-categories-upper-header'

export function TabsCategoriesHeader() {
  return (
    <View className="border-b border-border/60 bg-background/95 px-4 py-3">
      <TabsCategoriesUpperHeader />
      <TabsCategoriesNavBar />
    </View>
  )
}
