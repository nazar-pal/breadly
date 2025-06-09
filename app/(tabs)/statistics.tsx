import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
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
  const { colors } = useTheme()

  const getTrendColor = () => {
    if (type === 'success')
      return trend && trend > 0 ? colors.success : colors.error
    if (type === 'error')
      return trend && trend > 0 ? colors.error : colors.success
    return trend && trend > 0 ? colors.success : colors.error
  }

  return (
    <Card className="flex-1">
      <Text className="mb-1 text-sm" style={{ color: colors.textSecondary }}>
        {title}
      </Text>
      <Text className="mb-1 text-xl font-bold" style={{ color: colors.text }}>
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
            <Text
              className="ml-1 text-xs"
              style={{ color: colors.textSecondary }}
            >
              {trendLabel}
            </Text>
          )}
        </View>
      )}
    </Card>
  )
}

function TopTransactions() {
  const { colors } = useTheme()

  return (
    <View className="mb-6">
      <Text
        className="mb-3 text-lg font-semibold"
        style={{ color: colors.text }}
      >
        Top Transactions
      </Text>
      {mockStats.topTransactions.map(transaction => (
        <Card key={transaction.id} className="mb-2">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-base font-semibold"
              style={{ color: colors.expense }}
            >
              ${transaction.amount.toFixed(2)}
            </Text>
            <View
              className="rounded px-2 py-1"
              style={{ backgroundColor: colors.iconBackground.neutral }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: colors.textSecondary }}
              >
                {transaction.category}
              </Text>
            </View>
          </View>
          <Text
            className="mt-1 text-sm"
            style={{ color: colors.textSecondary }}
            numberOfLines={2}
          >
            {transaction.description}
          </Text>
        </Card>
      ))}
    </View>
  )
}

function CategoryBreakdown() {
  const { colors } = useTheme()

  // Get top 5 categories by spent amount
  const topCategories = [...mockCategories]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)

  const totalSpent = topCategories.reduce((sum, cat) => sum + cat.spent, 0)

  return (
    <View className="mb-6">
      <Text
        className="mb-3 text-lg font-semibold"
        style={{ color: colors.text }}
      >
        Top Categories
      </Text>
      <Card>
        {topCategories.map((category, index) => {
          const percentage = (category.spent / totalSpent) * 100
          return (
            <View
              key={category.id}
              className="border-b py-3"
              style={{ borderBottomColor: colors.borderLight }}
            >
              <View className="mb-2 flex-row justify-between">
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {category.name}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  ${category.spent.toFixed(2)}
                </Text>
              </View>
              <View
                className="mb-1 h-1 overflow-hidden rounded-sm"
                style={{ backgroundColor: colors.borderLight }}
              >
                <View
                  className="h-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors.primary
                  }}
                />
              </View>
              <Text
                className="text-right text-xs"
                style={{ color: colors.textSecondary }}
              >
                {percentage.toFixed(1)}%
              </Text>
            </View>
          )
        })}
      </Card>
    </View>
  )
}

export default function StatisticsScreen() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.background, paddingTop: insets.top }}
    >
      <View className="px-4 py-4">
        <Text className="text-[28px] font-bold" style={{ color: colors.text }}>
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
          <View className="mb-3 flex-row items-start justify-between">
            <View className="flex-1">
              <Text
                className="mb-1 text-base font-semibold"
                style={{ color: colors.text }}
              >
                Monthly Savings
              </Text>
              <Text
                className="text-2xl font-bold"
                style={{ color: colors.success }}
              >
                ${mockStats.currentMonth.savings.toFixed(2)}
              </Text>
            </View>
            <View
              className="flex-row items-center gap-1 rounded-lg p-2"
              style={{ backgroundColor: colors.iconBackground.success }}
            >
              <TrendingUp size={16} color={colors.success} />
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.success }}
              >
                {mockStats.currentMonth.savingsRate}% Rate
              </Text>
            </View>
          </View>
          <View
            className="h-2 overflow-hidden rounded"
            style={{ backgroundColor: colors.borderLight }}
          >
            <View
              className="h-full"
              style={{
                width: `${mockStats.currentMonth.savingsRate}%`,
                backgroundColor: colors.success
              }}
            />
          </View>
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
