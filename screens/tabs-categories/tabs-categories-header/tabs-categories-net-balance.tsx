import { useSumTransactions } from '@/data/client/queries'
import { useCategoriesDateRangeState } from '@/lib/storage/categories-date-range-store'
import { formatCurrencyWithSign } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Text, View } from 'react-native'

export function TabsCategoriesNetBalance() {
  const { userId } = useUserSession()
  const { colors } = useTheme()

  // Use enhanced date range state from categories store
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

  const totalExpenses = Number(totalExpensesResult.data?.[0]?.totalAmount || 0)
  const totalIncome = Number(totalIncomeResult.data?.[0]?.totalAmount || 0)

  const netBalance = totalIncome - totalExpenses

  return (
    <View className="flex-1">
      <Text className="mb-0.5 text-xs text-muted-foreground">Net Balance</Text>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          color: netBalance >= 0 ? colors.primary : colors.notification
        }}
      >
        {formatCurrencyWithSign(netBalance)}
      </Text>
    </View>
  )
}
