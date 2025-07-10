import {
  CategoryBreakdown,
  mockStats,
  StatCard,
  TopTransactions
} from '@/components/statistics'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DollarSign, TrendingUp } from '@/lib/icons'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
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
        <View className="mb-4 flex-row gap-3">
          <StatCard
            title="Monthly Income"
            amount={mockStats.currentMonth.income}
            trend={8.5}
            trendLabel="vs last month"
            variant="income"
            icon={DollarSign}
          />
          <StatCard
            title="Monthly Expenses"
            amount={mockStats.currentMonth.expenses}
            trend={12.5}
            trendLabel="vs last month"
            variant="expense"
            icon={DollarSign}
          />
        </View>

        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="mb-3 flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-foreground">
                  Monthly Savings
                </Text>
                <Text className="text-2xl font-bold text-income">
                  ${mockStats.currentMonth.savings.toFixed(2)}
                </Text>
              </View>
              <View className="rounded-full bg-income/10 p-2">
                <TrendingUp size={20} className="text-income" />
              </View>
            </View>
            <View className="mt-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm text-muted-foreground">
                  Savings Rate
                </Text>
                <Text className="text-sm font-medium text-income">
                  {mockStats.currentMonth.savingsRate}%
                </Text>
              </View>
              <Progress
                value={mockStats.currentMonth.savingsRate}
                className="h-2"
                indicatorClassName="bg-income"
              />
            </View>
          </CardContent>
        </Card>

        <View className="mb-6 flex-row gap-3">
          <StatCard
            title="Budget Remaining"
            amount={mockStats.currentMonth.budgetRemaining}
            variant="default"
          />
          <StatCard
            title="Avg. Monthly"
            amount={mockStats.currentMonth.averageMonthlySpending}
            variant="default"
          />
        </View>

        <CategoryBreakdown />

        <TopTransactions />
      </ScrollView>
    </View>
  )
}
