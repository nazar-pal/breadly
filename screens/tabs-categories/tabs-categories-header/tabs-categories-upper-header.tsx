import React from 'react'
import { View } from 'react-native'
import { TabsCategoriesDateRangeSelector } from './tabs-categories-date-range-selector'
import { TabsCategoriesNetBalance } from './tabs-categories-net-balance'

export function TabsCategoriesUpperHeader() {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <TabsCategoriesNetBalance />
      <TabsCategoriesDateRangeSelector />
    </View>
  )
}
