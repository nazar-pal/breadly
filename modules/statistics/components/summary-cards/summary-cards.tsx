import { useGetMonthlyBudget } from '@/data/client/queries'
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { View } from 'react-native'
import { useGetAverageMonthlyExpenses } from '../../data/queries'
import { useSumMonthlyMetrics } from '../../hooks/use-sum-monthly-metrics'
import { calculatePercentageChange, calculateSavingsRate } from '../../utils'
import { StatCard } from './stat-card'

export function SummaryCards() {
  const { userId } = useUserSession()

  const { total: totalIncome } = useSumMonthlyMetrics({
    userId,
    type: 'income'
  })

  const { total: totalIncomeLastMonth } = useSumMonthlyMetrics({
    userId,
    type: 'income',
    period: 'lastMonth'
  })

  const { total: totalExpense } = useSumMonthlyMetrics({
    userId,
    type: 'expense'
  })

  const { total: totalExpenseLastMonth } = useSumMonthlyMetrics({
    userId,
    type: 'expense',
    period: 'lastMonth'
  })

  const budgetRemaining = totalIncome - totalExpense

  const monthlyIncomeTrendPercentage = calculatePercentageChange(
    totalIncome,
    totalIncomeLastMonth
  )

  const monthlyExpenseTrendPercentage = calculatePercentageChange(
    totalExpense,
    totalExpenseLastMonth
  )

  const { totalMonthlyBudget } = useGetMonthlyBudget({ userId })

  const remainingBudget = totalMonthlyBudget - totalExpense

  const { averageMonthlyExpense } = useGetAverageMonthlyExpenses({ userId })

  // Savings rate represents the percentage of income that remains after expenses for the current month
  const savingsRate = calculateSavingsRate(totalIncome, totalExpense)

  return (
    <>
      <View className="mb-4 flex-row gap-3">
        <StatCard
          title="Monthly Income"
          variant="income"
          amount={totalIncome}
          trend={monthlyIncomeTrendPercentage}
          trendLabel="vs last month"
          icon="DollarSign"
        />
        <StatCard
          title="Monthly Expenses"
          variant="expense"
          amount={totalExpense}
          trend={monthlyExpenseTrendPercentage}
          trendLabel="vs last month"
          icon="DollarSign"
        />
      </View>

      {/* Monthly Savings / Shortfall */}
      <StatCard
        title={budgetRemaining >= 0 ? 'Monthly Savings' : 'Monthly Shortfall'}
        amount={budgetRemaining}
        variant={budgetRemaining >= 0 ? 'income' : 'expense'}
        progress={Math.min(Math.abs(savingsRate), 100)}
        progressLabel={budgetRemaining >= 0 ? 'Savings Rate' : 'Overspend Rate'}
        icon={budgetRemaining >= 0 ? 'TrendingUp' : 'TrendingDown'}
      />

      <View className="my-6 flex-row gap-3">
        <StatCard
          title="Budget Remaining"
          amount={remainingBudget}
          variant={remainingBudget < 0 ? 'expense' : 'default'}
        />
        <StatCard
          title="Avg. Monthly"
          amount={averageMonthlyExpense}
          variant="default"
        />
      </View>
    </>
  )
}
