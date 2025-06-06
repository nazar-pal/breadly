import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { mockCategories } from '@/data/mockData'
import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react-native'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
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
    <Card style={styles.statCard}>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.statAmount, { color: colors.text }]}>
        ${amount.toFixed(2)}
      </Text>
      {trend !== undefined && (
        <View style={styles.trendContainer}>
          {trend > 0 ? (
            <ArrowUp size={16} color={getTrendColor()} />
          ) : (
            <ArrowDown size={16} color={getTrendColor()} />
          )}
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {Math.abs(trend)}%
          </Text>
          {trendLabel && (
            <Text style={[styles.trendLabel, { color: colors.textSecondary }]}>
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
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Top Transactions
      </Text>
      {mockStats.topTransactions.map(transaction => (
        <Card key={transaction.id} style={styles.transactionCard}>
          <View style={styles.transactionHeader}>
            <Text style={[styles.transactionAmount, { color: colors.expense }]}>
              ${transaction.amount.toFixed(2)}
            </Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.iconBackground.neutral }
              ]}
            >
              <Text
                style={[styles.categoryText, { color: colors.textSecondary }]}
              >
                {transaction.category}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.transactionDesc, { color: colors.textSecondary }]}
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
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Top Categories
      </Text>
      <Card>
        {topCategories.map((category, index) => {
          const percentage = (category.spent / totalSpent) * 100
          return (
            <View
              key={category.id}
              style={[
                styles.categoryRow,
                { borderBottomColor: colors.borderLight }
              ]}
            >
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category.name}
                </Text>
                <Text
                  style={[
                    styles.categoryAmount,
                    { color: colors.textSecondary }
                  ]}
                >
                  ${category.spent.toFixed(2)}
                </Text>
              </View>
              <View
                style={[
                  styles.percentageBar,
                  { backgroundColor: colors.borderLight }
                ]}
              >
                <View
                  style={[
                    styles.percentageFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: colors.primary
                    }
                  ]}
                />
              </View>
              <Text
                style={[styles.percentageText, { color: colors.textSecondary }]}
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
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Statistics
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 16 }
        ]}
      >
        <View style={styles.statsGrid}>
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

        <Card style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <View style={styles.savingsInfo}>
              <Text style={[styles.savingsTitle, { color: colors.text }]}>
                Monthly Savings
              </Text>
              <Text style={[styles.savingsAmount, { color: colors.success }]}>
                ${mockStats.currentMonth.savings.toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                styles.savingsRateContainer,
                { backgroundColor: colors.iconBackground.success }
              ]}
            >
              <TrendingUp size={16} color={colors.success} />
              <Text style={[styles.savingsRate, { color: colors.success }]}>
                {mockStats.currentMonth.savingsRate}% Rate
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.savingsProgress,
              { backgroundColor: colors.borderLight }
            ]}
          >
            <View
              style={[
                styles.savingsProgressFill,
                {
                  width: `${mockStats.currentMonth.savingsRate}%`,
                  backgroundColor: colors.success
                }
              ]}
            />
          </View>
        </Card>

        <View style={styles.statsGrid}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700'
  },
  content: {
    flex: 1
  },
  scrollContent: {
    padding: 16
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  statCard: {
    flex: 1
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 4
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600'
  },
  trendLabel: {
    fontSize: 12,
    marginLeft: 4
  },
  savingsCard: {
    marginBottom: 16
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  savingsInfo: {
    flex: 1
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: '700'
  },
  savingsRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 4
  },
  savingsRate: {
    fontSize: 14,
    fontWeight: '600'
  },
  savingsProgress: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden'
  },
  savingsProgressFill: {
    height: '100%'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  categoryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent' // Will be set dynamically
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500'
  },
  categoryAmount: {
    fontSize: 14
  },
  percentageBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4
  },
  percentageFill: {
    height: '100%'
  },
  percentageText: {
    fontSize: 12,
    textAlign: 'right'
  },
  transactionCard: {
    marginBottom: 8
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600'
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500'
  },
  transactionDesc: {
    fontSize: 14
  }
})
