import { CategoryBreakdown, TopTransactions } from '@/components/statistics'
import { SummaryCards } from '@/components/statistics/summary-cards'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16
        }}
      >
        <SummaryCards />

        <CategoryBreakdown />

        <TopTransactions />
      </ScrollView>
    </View>
  )
}
