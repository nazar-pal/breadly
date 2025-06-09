import { Card, CardContent } from '@/components/ui/card'
import { mockCategories } from '@/data/mockData'
import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react-native'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Mock data for statistics
const mockStats = {
  currentMonth: {
    income: 6750,
    expenses: 1845,
    savings: 4905,
    savingsRate: 72.67,
    largestCategory: 'Groceries',
    largestAmount: 280.45,
    budgetRemaining: 1155,
    comparisonToLastMonth: 12.5,
    averageMonthlySpending: 1950
  },
  topTransactions: [
    {
      id: '6',
      amount: 120.0,
      category: 'Utilities',
      description: 'Electricity bill for February'
    },
    {
      id: '1',
      amount: 42.99,
      category: 'Groceries',
      description: 'Weekly groceries at Whole Foods'
    },
    {
      id: '3',
      amount: 65.0,
      category: 'Dining',
      description: 'Dinner with friends at Italian restaurant'
    }
  ]
}

function StatCard({
  title,
  amount,
  trend,
  trendLabel,
  type = 'neutral'
}: {
  title: string
  amount: number
  trend?: number
  trendLabel?: string
  type?: 'success' | 'error' | 'neutral'
}) {
  const getTrendColor = () => {
    if (type === 'success') return trend && trend > 0 ? '#10B981' : '#EF4444' // success : destructive
    if (type === 'error') return trend && trend > 0 ? '#EF4444' : '#10B981' // destructive : success
    return trend && trend > 0 ? '#10B981' : '#EF4444' // success : destructive
  }

  return (
    <Card className="flex-1">
      <CardContent>
        <Text className="text-foreground mb-1 text-sm">{title}</Text>
        <Text className="text-foreground mb-1 text-xl font-bold">
          ${amount.toFixed(2)}
        </Text>
        {trend !== undefined && (
          <View className="flex-row items-center gap-1">
            {trend > 0 ? (
              <ArrowUp size={16} color={getTrendColor()} />
            ) : (
              <ArrowDown size={16} color={getTrendColor()} />
            )}
            <Text
              className="text-sm font-semibold"
              style={{ color: getTrendColor() }}
            >
              {Math.abs(trend)}%
            </Text>
            {trendLabel && (
              <Text className="text-foreground ml-1 text-xs">{trendLabel}</Text>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  )
}

function TopTransactions() {
  return (
    <View className="mb-6">
      <Text className="text-foreground mb-3 text-lg font-semibold">
        Top Transactions
      </Text>
      {mockStats.topTransactions.map(transaction => (
        <Card key={transaction.id} className="mb-2">
          <CardContent>
            <View className="flex-row items-center justify-between">
              <Text className="text-info text-base font-semibold">
                ${transaction.amount.toFixed(2)}
              </Text>
              <View className="bg-old-icon-bg-neutral rounded px-2 py-1">
                <Text className="text-foreground text-xs font-medium">
                  {transaction.category}
                </Text>
              </View>
            </View>
            <Text className="text-foreground mt-1 text-sm" numberOfLines={2}>
              {transaction.description}
            </Text>
          </CardContent>
        </Card>
      ))}
    </View>
  )
}

function CategoryBreakdown() {
  // Get top 5 categories by spent amount
  const topCategories = [...mockCategories]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)

  const totalSpent = topCategories.reduce((sum, cat) => sum + cat.spent, 0)

  return (
    <View className="mb-6">
      <Text className="text-foreground mb-3 text-lg font-semibold">
        Top Categories
      </Text>
      <Card>
        <CardContent>
          {topCategories.map((category, index) => {
            const percentage = (category.spent / totalSpent) * 100
            return (
              <View
                key={category.id}
                className="border-b py-3"
                style={{ borderBottomColor: '#F7FAFC' }} // border-light
              >
                <View className="mb-2 flex-row justify-between">
                  <Text className="text-foreground text-sm font-medium">
                    {category.name}
                  </Text>
                  <Text className="text-foreground text-sm">
                    ${category.spent.toFixed(2)}
                  </Text>
                </View>
                <View
                  className="mb-1 h-1 overflow-hidden rounded-sm"
                  style={{ backgroundColor: '#F7FAFC' }} // border-light
                >
                  <View
                    className="h-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: '#6366F1' // old-primary
                    }}
                  />
                </View>
                <Text className="text-foreground text-right text-xs">
                  {percentage.toFixed(1)}%
                </Text>
              </View>
            )
          })}
        </CardContent>
      </Card>
    </View>
  )
}

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View className="bg-background flex-1" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4">
        <Text className="text-foreground text-[28px] font-bold">
          Statistics
        </Text>
      </View>

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
            type="success"
          />
          <StatCard
            title="Monthly Expenses"
            amount={mockStats.currentMonth.expenses}
            trend={12.5}
            trendLabel="vs last month"
            type="error"
          />
        </View>

        <Card className="mb-4">
          <CardContent>
            <View className="mb-3 flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-foreground mb-1 text-base font-semibold">
                  Monthly Savings
                </Text>
                <Text className="text-success text-2xl font-bold">
                  ${mockStats.currentMonth.savings.toFixed(2)}
                </Text>
              </View>
              <View className="bg-old-icon-bg-success flex-row items-center gap-1 rounded-lg p-2">
                <TrendingUp size={16} color="#10B981" />
                <Text className="text-success text-sm font-semibold">
                  {mockStats.currentMonth.savingsRate}% Rate
                </Text>
              </View>
            </View>
            <View
              className="h-2 overflow-hidden rounded"
              style={{ backgroundColor: '#F7FAFC' }} // border-light
            >
              <View
                className="h-full"
                style={{
                  width: `${mockStats.currentMonth.savingsRate}%`,
                  backgroundColor: '#10B981' // success
                }}
              />
            </View>
          </CardContent>
        </Card>

        <View className="mb-4 flex-row gap-3">
          <StatCard
            title="Budget Remaining"
            amount={mockStats.currentMonth.budgetRemaining}
          />
          <StatCard
            title="Avg. Monthly"
            amount={mockStats.currentMonth.averageMonthlySpending}
          />
        </View>

        <CategoryBreakdown />

        <TopTransactions />
      </ScrollView>
    </View>
  )
}
