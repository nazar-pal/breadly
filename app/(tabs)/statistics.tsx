import { CategoryBreakdown, TopExpenses } from '@/components/statistics'
import { SummaryCards } from '@/components/statistics/summary-cards'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 16
      }}
    >
      <View className="px-4 py-4">
        <SummaryCards />
        <CategoryBreakdown />
        <TopExpenses />
      </View>
    </ScrollView>
  )
}
