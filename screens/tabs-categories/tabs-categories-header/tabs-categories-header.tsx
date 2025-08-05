import React from 'react'
import { View } from 'react-native'
import { TabsCategoriesNavBar } from './tabs-categories-nav-bar'
import { TabsCategoriesUpperHeader } from './tabs-categories-upper-header'

export function TabsCategoriesHeader() {
  return (
    <View className="px-4 py-2">
      <TabsCategoriesUpperHeader />
      <TabsCategoriesNavBar />
    </View>
  )
}
