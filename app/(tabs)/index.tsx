import Card from '@/components/ui-old/Card'
import OperationCard, { Operation } from '@/components/ui-old/OperationCard'
import { useTheme } from '@/context/ThemeContext'
import {
  mockDebtOperations,
  mockExpenses,
  mockIncomes,
  mockOtherTransactions
} from '@/data/mockData'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type FilterType = 'all' | 'expense' | 'income' | 'debt' | 'other'

export default function OperationsScreen() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Combine all operations with type information
  const allOperations: Operation[] = useMemo(() => {
    const expenses = mockExpenses.map(expense => ({
      ...expense,
      type: 'expense' as const
    }))

    const incomes = mockIncomes.map(income => ({
      ...income,
      type: 'income' as const
    }))

    const debts = mockDebtOperations.map(debt => ({
      ...debt,
      type: 'debt' as const
    }))

    const others = mockOtherTransactions.map(transaction => ({
      ...transaction,
      type: 'other' as const
    }))

    // Combine and sort by date (newest first)
    return [...expenses, ...incomes, ...debts, ...others].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [])

  // Filter operations based on active filter
  const filteredOperations = useMemo(() => {
    if (activeFilter === 'all') {
      return allOperations
    }
    return allOperations.filter(operation => operation.type === activeFilter)
  }, [allOperations, activeFilter])

  // Get today's operations
  const todaysOperations = useMemo(() => {
    const today = '2025-03-01' // Current mock date
    return filteredOperations.filter(operation => operation.date === today)
  }, [filteredOperations])

  const filterButtons = [
    { key: 'all', label: 'All', count: allOperations.length },
    { key: 'expense', label: 'Expenses', count: mockExpenses.length },
    { key: 'income', label: 'Income', count: mockIncomes.length },
    { key: 'debt', label: 'Debts', count: mockDebtOperations.length },
    { key: 'other', label: 'Other', count: mockOtherTransactions.length }
  ]

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top
      }}
    >
      <View className="px-4 py-4">
        <Text className="text-[28px] font-bold" style={{ color: colors.text }}>
          Operations
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="mb-4 px-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {filterButtons.map(filter => (
            <Pressable
              key={filter.key}
              className="mr-2 min-w-[80px] items-center rounded-[20px] px-4 py-2"
              style={{
                backgroundColor:
                  activeFilter === filter.key
                    ? colors.primary
                    : colors.surfaceSecondary
              }}
              onPress={() => setActiveFilter(filter.key as FilterType)}
            >
              <Text
                className="text-sm font-medium"
                style={{
                  color:
                    activeFilter === filter.key
                      ? colors.textInverse
                      : colors.text
                }}
              >
                {filter.label} ({filter.count})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32
        }}
      >
        {/* Today's Operations */}
        {todaysOperations.length > 0 && (
          <View className="mb-6">
            <Text
              className="mb-3 text-lg font-semibold"
              style={{ color: colors.text }}
            >
              Today&apos;s Operations
            </Text>
            {todaysOperations.map(operation => (
              <OperationCard
                key={`${operation.type}-${operation.id}`}
                operation={operation}
              />
            ))}
          </View>
        )}

        {/* All Operations */}
        <View className="mb-6">
          <Text
            className="mb-3 text-lg font-semibold"
            style={{ color: colors.text }}
          >
            {activeFilter === 'all'
              ? 'All Operations'
              : `${filterButtons.find(f => f.key === activeFilter)?.label} Operations`}
          </Text>
          {filteredOperations.length > 0 ? (
            filteredOperations.map(operation => (
              <OperationCard
                key={`${operation.type}-${operation.id}`}
                operation={operation}
              />
            ))
          ) : (
            <Card>
              <Text
                className="text-center"
                style={{ color: colors.textSecondary }}
              >
                No operations found for the selected filter
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
