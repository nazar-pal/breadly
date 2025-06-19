import { useDateRange } from '@/hooks/useDateRange'
import { useSumTransactions } from '@/powersync/data/queries'
import React, { use, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CategoriesContext } from './categories-context'
import { DateRangeModal } from './modal-transactions-date-range'

export function CategoriesHeader() {
  const { userId, categoryUI } = use(CategoriesContext)
  const { activeTab, setActiveTab } = categoryUI
  const {
    mode,
    setMode,
    formattedRange,
    canNavigate,
    navigatePrevious,
    navigateNext,
    getModeDisplayName
  } = useDateRange()

  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false)

  const handleDateRangePress = () => {
    setDateRangeModalVisible(true)
  }

  const handleDateRangeModalClose = () => {
    setDateRangeModalVisible(false)
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

        <Pressable onPress={handleDateRangePress} className="items-end">
          <Text className="text-right text-sm font-semibold text-foreground">
            {formattedRange}
          </Text>
          <Text className="mt-0.5 text-[10px] uppercase tracking-wider text-foreground">
            {getModeDisplayName(mode)}
          </Text>
        </Pressable>
      </View>

      {/* Tab Navigation */}
      <View className="mt-1 flex-row gap-2">
        <Pressable
          className="mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2"
          style={{
            backgroundColor:
              activeTab === 'expenses'
                ? 'rgba(99, 102, 241, 0.1)'
                : 'transparent',
            borderWidth: activeTab === 'expenses' ? 1 : 0,
            borderColor: activeTab === 'expenses' ? '#6366F1' : 'transparent'
          }}
          onPress={() => setActiveTab('expenses')}
        >
          <Text
            className="mb-0.5 text-base font-semibold"
            style={{
              color: activeTab === 'expenses' ? '#6366F1' : '#4A5568'
            }}
          >
            Expenses
          </Text>
          <Text
            className="text-sm font-medium"
            style={{
              color: activeTab === 'expenses' ? '#EF4444' : '#4A5568'
            }}
          >
            ${totalExpenses.toFixed(2)}
          </Text>
        </Pressable>

        <Pressable
          className="mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2"
          style={{
            backgroundColor:
              activeTab === 'incomes'
                ? 'rgba(99, 102, 241, 0.1)'
                : 'transparent',
            borderWidth: activeTab === 'incomes' ? 1 : 0,
            borderColor: activeTab === 'incomes' ? '#6366F1' : 'transparent'
          }}
          onPress={() => setActiveTab('incomes')}
        >
          <Text
            className="mb-0.5 text-base font-semibold"
            style={{
              color: activeTab === 'incomes' ? '#6366F1' : '#4A5568'
            }}
          >
            Income
          </Text>
          <Text
            className="text-sm font-medium"
            style={{
              color: activeTab === 'incomes' ? '#10B981' : '#4A5568'
            }}
          >
            ${totalIncome.toFixed(2)}
          </Text>
        </Pressable>
      </View>

      {/* Date Range Modal */}
      <DateRangeModal
        visible={dateRangeModalVisible}
        currentMode={mode}
        onSelectMode={setMode}
        onClose={handleDateRangeModalClose}
        canNavigate={canNavigate}
        navigatePrevious={navigatePrevious}
        navigateNext={navigateNext}
        formattedRange={formattedRange}
      />
    </View>
  )
}
