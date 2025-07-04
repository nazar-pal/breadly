import { useUserSession } from '@/lib/hooks'
import { useSumTransactions } from '@/lib/powersync/data/queries'
import {
  useCategoriesActions,
  useDateRangeState
} from '@/lib/storage/categories-store'
import { Link } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { useCategoryType } from './lib/use-category-type'
import { DateRangeModal } from './modal-transactions-date-range'

export function CategoriesHeader() {
  const { userId } = useUserSession()
  const activeCategoryType = useCategoryType()

  // Use enhanced date range state from categories store
  const {
    isDateRangeModalOpen,
    dateRangeMode,
    formattedRange,
    canNavigate,
    canNavigateForward,
    getModeDisplayName
  } = useDateRangeState()

  const {
    openDateRangeModal,
    closeDateRangeModal,
    setDateRangeMode,
    navigatePrevious,
    navigateNext
  } = useCategoriesActions()

  // Create a wrapper for navigateNext that respects future date limits
  const handleNavigateNext = () => {
    if (canNavigateForward) {
      navigateNext()
    }
  }

  const totalExpensesResult = useSumTransactions({
    userId,
    type: 'expense'
  })
  const totalIncomeResult = useSumTransactions({
    userId,
    type: 'income'
  })

  const totalExpenses = Number(totalExpensesResult.data?.[0]?.totalAmount || 0)
  const totalIncome = Number(totalIncomeResult.data?.[0]?.totalAmount || 0)

  const netBalance = totalIncome - totalExpenses

  return (
    <View className="px-4 py-2">
      {/* Top Row: Balance and Date Range */}
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="mb-0.5 text-xs text-foreground">Net Balance</Text>
          <Text
            className="text-2xl font-bold"
            style={{
              color: netBalance >= 0 ? '#10B981' : '#EF4444'
            }}
          >
            ${Math.abs(netBalance).toFixed(2)}
          </Text>
        </View>

        <Pressable onPress={openDateRangeModal} className="items-end">
          <Text className="text-right text-sm font-semibold text-foreground">
            {formattedRange}
          </Text>
          <Text className="mt-0.5 text-[10px] uppercase tracking-wider text-foreground">
            {getModeDisplayName(dateRangeMode)}
          </Text>
        </Pressable>
      </View>

      {/* Tab Navigation */}
      <View className="mt-1 flex-row gap-2">
        <Link href="/(tabs)/(categories)" asChild>
          <Pressable
            className="mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2"
            style={{
              backgroundColor:
                activeCategoryType === 'expense'
                  ? 'rgba(99, 102, 241, 0.1)'
                  : 'transparent',
              borderWidth: activeCategoryType === 'expense' ? 1 : 0,
              borderColor:
                activeCategoryType === 'expense' ? '#6366F1' : 'transparent'
            }}
          >
            <Text
              className="mb-0.5 text-base font-semibold"
              style={{
                color: activeCategoryType === 'expense' ? '#6366F1' : '#4A5568'
              }}
            >
              Expenses
            </Text>
            <Text
              className="text-sm font-medium"
              style={{
                color: activeCategoryType === 'expense' ? '#EF4444' : '#4A5568'
              }}
            >
              ${totalExpenses.toFixed(2)}
            </Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/(categories)/incomes" asChild>
          <Pressable
            className="mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2"
            style={{
              backgroundColor:
                activeCategoryType === 'income'
                  ? 'rgba(99, 102, 241, 0.1)'
                  : 'transparent',
              borderWidth: activeCategoryType === 'income' ? 1 : 0,
              borderColor:
                activeCategoryType === 'income' ? '#6366F1' : 'transparent'
            }}
          >
            <Text
              className="mb-0.5 text-base font-semibold"
              style={{
                color: activeCategoryType === 'income' ? '#6366F1' : '#4A5568'
              }}
            >
              Income
            </Text>
            <Text
              className="text-sm font-medium"
              style={{
                color: activeCategoryType === 'income' ? '#10B981' : '#4A5568'
              }}
            >
              ${totalIncome.toFixed(2)}
            </Text>
          </Pressable>
        </Link>
      </View>

      {/* Date Range Modal */}
      <DateRangeModal
        visible={isDateRangeModalOpen}
        currentMode={dateRangeMode}
        onSelectMode={setDateRangeMode}
        onClose={closeDateRangeModal}
        canNavigate={canNavigate}
        navigatePrevious={navigatePrevious}
        navigateNext={handleNavigateNext}
        formattedRange={formattedRange}
      />
    </View>
  )
}
