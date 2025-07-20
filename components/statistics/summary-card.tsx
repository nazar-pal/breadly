import { StatCard } from '@/components/statistics'
import { useUserSession } from '@/lib/hooks'
import { DollarSign } from '@/lib/icons'
import { useSumTransactions } from '@/lib/powersync/data/queries'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import React from 'react'

export function SummaryCard({ type }: { type: 'income' | 'expense' }) {
  const { userId } = useUserSession()

  const now = new Date()

  const { data: thisMonth, isLoading: isLoadingThisMonth } = useSumTransactions(
    {
      userId,
      type,
      transactionsFrom: startOfMonth(now),
      transactionsTo: now
    }
  )

  const { data: lastMonth, isLoading: isLoadingLastMonth } = useSumTransactions(
    {
      userId,
      type,
      transactionsFrom: startOfMonth(subMonths(now, 1)),
      transactionsTo: endOfMonth(subMonths(now, 1))
    }
  )

  const isLoading = isLoadingThisMonth || isLoadingLastMonth

  const totalAmountThisMonth =
    thisMonth?.[0]?.totalAmount && !isLoading
      ? Number(thisMonth[0].totalAmount)
      : 0
  const totalAmountLastMonth =
    lastMonth?.[0]?.totalAmount && !isLoading
      ? Number(lastMonth[0].totalAmount)
      : 0

  const trend =
    thisMonth?.[0]?.totalAmount &&
    lastMonth?.[0]?.totalAmount &&
    totalAmountLastMonth !== 0
      ? (totalAmountThisMonth - totalAmountLastMonth) / totalAmountLastMonth
      : 0.0

  return (
    <StatCard
      title={type === 'income' ? 'Monthly Income' : 'Monthly Expenses'}
      amount={totalAmountThisMonth}
      trend={trend}
      trendLabel="vs last month"
      variant={type}
      icon={DollarSign}
    />
  )
}
