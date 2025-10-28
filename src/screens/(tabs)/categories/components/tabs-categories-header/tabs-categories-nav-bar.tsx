import { CategoryType } from '@/data/client/db-schema'
import { useSumTransactions } from '@/data/client/queries'
import { useCategoriesDateRangeState } from '@/lib/storage/categories-date-range-store'
import { formatCurrency } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import { useTheme } from '@react-navigation/native'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export function TabsCategoriesNavBar({ type }: { type: CategoryType }) {
  const { userId } = useUserSession()
  const activeCategoryType = type
  const { colors } = useTheme()

  const { dateRange } = useCategoriesDateRangeState()

  const totalExpensesResult = useSumTransactions({
    userId,
    type: 'expense',
    transactionsFrom: dateRange.start ?? undefined,
    transactionsTo: dateRange.end ?? undefined
  })
  const totalIncomeResult = useSumTransactions({
    userId,
    type: 'income',
    transactionsFrom: dateRange.start ?? undefined,
    transactionsTo: dateRange.end ?? undefined
  })

  const totalExpenses = (totalExpensesResult.data ?? [])
    .map(row => ({
      totalAmount: Number(row.totalAmount ?? 0),
      currencyId: String(row.currencyId ?? '')
    }))
    .filter(row => row.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)

  const totalIncome = (totalIncomeResult.data ?? [])
    .map(row => ({
      totalAmount: Number(row.totalAmount ?? 0),
      currencyId: String(row.currencyId ?? '')
    }))
    .filter(row => row.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)

  const renderTotals = (rows: typeof totalExpenses | typeof totalIncome) => {
    if (rows.length === 0) return '0'
    return rows
      .map(r => formatCurrency(r.totalAmount, r.currencyId))
      .join(' + ')
  }

  return (
    <View className="mt-1 flex-row gap-2">
      <Pressable
        onPress={() => router.setParams({ type: 'expense' })}
        className={`flex-1 items-center rounded-full px-3 py-1.5 ${
          activeCategoryType === 'expense'
            ? 'border border-primary bg-primary/10'
            : 'bg-transparent'
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            activeCategoryType === 'expense'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Expenses
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 11,
            fontWeight: '500',
            color:
              activeCategoryType === 'expense'
                ? colors.notification
                : colors.text
          }}
        >
          {renderTotals(totalExpenses)}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.setParams({ type: 'income' })}
        className={`flex-1 items-center rounded-full px-3 py-1.5 ${
          activeCategoryType === 'income'
            ? 'border border-primary bg-primary/10'
            : 'bg-transparent'
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            activeCategoryType === 'income'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Income
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 11,
            fontWeight: '500',
            color:
              activeCategoryType === 'income' ? colors.primary : colors.text
          }}
        >
          {renderTotals(totalIncome)}
        </Text>
      </Pressable>
    </View>
  )
}
