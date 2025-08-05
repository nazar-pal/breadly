import { useCategoryType, useUserSession } from '@/lib/hooks'
import { useSumTransactions } from '@/lib/powersync/data/queries'
import { useCategoriesDateRangeState } from '@/lib/storage/categories-date-range-store'
import { useTheme } from '@react-navigation/native'
import { Link } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export function TabsCategoriesNavBar() {
  const { userId } = useUserSession()
  const activeCategoryType = useCategoryType()
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

  const totalExpenses = Number(totalExpensesResult.data?.[0]?.totalAmount || 0)
  const totalIncome = Number(totalIncomeResult.data?.[0]?.totalAmount || 0)

  return (
    <View className="mt-1 flex-row gap-2">
      <Link replace href="/(tabs)/(categories)" asChild>
        <Pressable
          className={`mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2 ${
            activeCategoryType === 'expense'
              ? 'border border-primary bg-primary/10'
              : 'bg-transparent'
          }`}
        >
          <Text
            className={`mb-0.5 text-base font-semibold ${
              activeCategoryType === 'expense'
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Expenses
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color:
                activeCategoryType === 'expense'
                  ? colors.notification
                  : colors.text
            }}
          >
            {`$${totalExpenses.toFixed(2)}`}
          </Text>
        </Pressable>
      </Link>

      <Link replace href="/(tabs)/(categories)/incomes" asChild>
        <Pressable
          className={`mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2 ${
            activeCategoryType === 'income'
              ? 'border border-primary bg-primary/10'
              : 'bg-transparent'
          }`}
        >
          <Text
            className={`mb-0.5 text-base font-semibold ${
              activeCategoryType === 'income'
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Income
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color:
                activeCategoryType === 'income' ? colors.primary : colors.text
            }}
          >
            {`$${totalIncome.toFixed(2)}`}
          </Text>
        </Pressable>
      </Link>
    </View>
  )
}
