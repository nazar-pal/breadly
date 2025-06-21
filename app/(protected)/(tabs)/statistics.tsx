import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TEMP_USER_ID } from '@/lib/constants'
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  TrendingUp
} from '@/lib/icons'
import {
  useGetCategories,
  useSumTransactions
} from '@/lib/powersync/data/queries'
import { CategorySelectSQLite } from '@/lib/powersync/schema/table_4_categories'
import { cn } from '@/lib/utils'
import { useAuth } from '@clerk/clerk-expo'
import { LucideIcon } from 'lucide-react-native'
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
  variant = 'default',
  icon: Icon
}: {
  title: string
  amount: number
  trend?: number
  trendLabel?: string
  variant?: 'default' | 'income' | 'expense'
  icon?: LucideIcon
}) {
  const variants = {
    default: {
      trend: trend && trend > 0 ? 'text-income' : 'text-expense',
      icon: 'bg-primary/10 text-primary'
    },
    income: {
      trend: 'text-income',
      icon: 'bg-income/10 text-income'
    },
    expense: {
      trend: 'text-expense',
      icon: 'bg-expense/10 text-expense'
    }
  }

  return (
    <Card className="flex-1">
      <CardContent className="p-4">
        <View className="mb-3 flex-row items-center justify-between gap-2">
          <Text className="text-sm font-medium text-muted-foreground">
            {title}
          </Text>
          {Icon && (
            <View className={cn('rounded-full p-2', variants[variant].icon)}>
              <Icon size={14} className={variants[variant].icon} />
            </View>
          )}
        </View>
        <Text className="mb-2 text-2xl font-bold text-foreground">
          ${amount.toFixed(2)}
        </Text>
        {trend !== undefined && (
          <View className="flex-row items-center gap-1">
            <View className={cn('rounded-full p-1')}>
              {trend > 0 ? (
                <ArrowUp size={12} className={variants[variant].trend} />
              ) : (
                <ArrowDown size={12} className={variants[variant].trend} />
              )}
            </View>
            <Text
              className={cn('text-sm font-semibold', variants[variant].trend)}
            >
              {Math.abs(trend)}%
            </Text>
            {trendLabel && (
              <Text className="ml-1 text-xs text-muted-foreground">
                {trendLabel}
              </Text>
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
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Recent Transactions
      </Text>
      {mockStats.topTransactions.map(transaction => (
        <Card key={transaction.id} className="mb-3">
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  {transaction.description}
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  {transaction.category}
                </Text>
              </View>
              <Text className="text-base font-semibold text-primary">
                ${transaction.amount.toFixed(2)}
              </Text>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  )
}

function CategoryBreakdown() {
  const { userId } = useAuth()
  const { data: categories } = useGetCategories({
    userId: userId || TEMP_USER_ID,
    type: 'expense'
  })

  // Get top 5 categories by spent amount
  const topCategories = [...categories].slice(0, 5)

  const { data: totalSpent } = useSumTransactions({
    userId: userId || TEMP_USER_ID,
    type: 'expense'
  })

  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Spending by Category
      </Text>
      <Card>
        <CardContent className="p-4">
          {topCategories.map((category, index) => {
            return (
              <CategoryBreakdownItem
                key={category.id}
                category={category}
                lastItemInList={index === topCategories.length - 1}
                totalSpent={totalSpent ? Number(totalSpent[0]?.totalAmount) : 0}
              />
            )
          })}
        </CardContent>
      </Card>
    </View>
  )
}

function CategoryBreakdownItem({
  category,
  lastItemInList,
  totalSpent
}: {
  category: CategorySelectSQLite
  lastItemInList: boolean
  totalSpent: number
}) {
  const { userId } = useAuth()
  const { data: spent } = useSumTransactions({
    userId: userId || TEMP_USER_ID,
    type: 'expense',
    categoryId: category.id
  })

  const spentAmount = spent ? Number(spent[0]?.totalAmount) : 0

  const percentage = (spentAmount / totalSpent) * 100

  return (
    <View
      key={category.id}
      className={cn('py-3', !lastItemInList && 'border-b border-border/10')}
    >
      <View className="mb-2 flex-row justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-foreground">
            {category.name}
          </Text>
          <Text className="text-xs text-muted-foreground">
            ${spentAmount.toFixed(2)}
          </Text>
        </View>
        <Text className="text-sm font-medium text-foreground">
          {percentage.toFixed(1)}%
        </Text>
      </View>
      <Progress
        value={percentage}
        className="h-2"
        indicatorClassName="bg-primary"
      />
    </View>
  )
}

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="border-b border-border/10 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Statistics</Text>
          <View className="rounded-full bg-primary/10 p-2">
            <Calendar size={20} className="text-primary" />
          </View>
        </View>
        <Text className="mt-1 text-sm text-muted-foreground">
          Track your financial progress
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
