import OperationListItem, {
  Operation
} from '@/components/accounts/OperationListItem'
import { Card, CardContent } from '@/components/ui/card'
import {
  mockDebtOperations,
  mockExpenses,
  mockIncomes,
  mockOtherTransactions
} from '@/data/mockData'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type FilterType = 'all' | 'expense' | 'income' | 'debt' | 'other'

export default function OperationsScreen() {
  const insets = useSafeAreaInsets()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Combine all operations with type information
  const allOperations: Operation[] = [
    ...mockExpenses.map(expense => ({
      ...expense,
      type: 'expense' as const
    })),
    ...mockIncomes.map(income => ({
      ...income,
      type: 'income' as const
    })),
    ...mockDebtOperations.map(debt => ({
      ...debt,
      type: 'debt' as const
    })),
    ...mockOtherTransactions.map(transaction => ({
      ...transaction,
      type: 'other' as const
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filter operations based on active filter
  const filteredOperations =
    activeFilter === 'all'
      ? allOperations
      : allOperations.filter(operation => operation.type === activeFilter)

  // Get today's operations
  const today = '2025-03-01' // Current mock date
  const todaysOperations = filteredOperations.filter(
    operation => operation.date === today
  )

  const filterButtons = [
    { key: 'all', label: 'All', count: allOperations.length },
    { key: 'expense', label: 'Expenses', count: mockExpenses.length },
    { key: 'income', label: 'Income', count: mockIncomes.length },
    { key: 'debt', label: 'Debts', count: mockDebtOperations.length },
    { key: 'other', label: 'Other', count: mockOtherTransactions.length }
  ]

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top
      }}
    >
      <View className="px-4 py-4">
        <Text className="text-3xl font-bold text-foreground">Operations</Text>
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
              className={cn(
                'mr-2 min-w-[80px] items-center rounded-full px-4 py-2',
                activeFilter === filter.key ? 'bg-primary' : 'bg-secondary'
              )}
              onPress={() => setActiveFilter(filter.key as FilterType)}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  activeFilter === filter.key
                    ? 'text-primary-foreground'
                    : 'text-foreground'
                )}
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
            <Text className="mb-3 text-lg font-semibold text-foreground">
              Today&apos;s Operations
            </Text>
            {todaysOperations.map(operation => (
              <OperationListItem
                key={`${operation.type}-${operation.id}`}
                operation={operation}
              />
            ))}
          </View>
        )}

        {/* All Operations */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-foreground">
            {activeFilter === 'all'
              ? 'All Operations'
              : `${filterButtons.find(f => f.key === activeFilter)?.label} Operations`}
          </Text>
          {filteredOperations.length > 0 ? (
            filteredOperations.map(operation => (
              <OperationListItem
                key={`${operation.type}-${operation.id}`}
                operation={operation}
              />
            ))
          ) : (
            <Card>
              <CardContent>
                <Text className="text-center text-foreground">
                  No operations found for the selected filter
                </Text>
              </CardContent>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
