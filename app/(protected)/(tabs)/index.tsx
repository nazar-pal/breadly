import OperationListItem from '@/components/accounts/OperationListItem'
import { Card, CardContent } from '@/components/ui/card'
import { useTransactions } from '@/hooks/useTransactions'
import { cn } from '@/lib/utils'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type FilterType = 'all' | 'expense' | 'income' | 'transfer'

export default function OperationsScreen() {
  const insets = useSafeAreaInsets()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Use the new transactions hook
  const {
    operations,
    expenses,
    incomes,
    transfers,
    todaysOperations,
    isLoading,
    error
  } = useTransactions()

  // Filter operations based on active filter
  const filteredOperations = useMemo(() => {
    switch (activeFilter) {
      case 'expense':
        return expenses
      case 'income':
        return incomes
      case 'transfer':
        return transfers
      default:
        return operations
    }
  }, [activeFilter, operations, expenses, incomes, transfers])

  // Calculate counts for filter buttons
  const filterButtons = [
    { key: 'all', label: 'All', count: operations.length },
    { key: 'expense', label: 'Expenses', count: expenses.length },
    { key: 'income', label: 'Income', count: incomes.length },
    { key: 'transfer', label: 'Transfers', count: transfers.length }
  ]

  // Show loading state
  if (isLoading) {
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
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-foreground">
            Loading operations...
          </Text>
        </View>
      </View>
    )
  }

  // Show error state
  if (error) {
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
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-destructive">
            Error loading operations: {error.message}
          </Text>
        </View>
      </View>
    )
  }

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
              <OperationListItem key={operation.id} operation={operation} />
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
              <OperationListItem key={operation.id} operation={operation} />
            ))
          ) : (
            <Card>
              <CardContent className="p-4">
                <Text className="text-center text-muted-foreground">
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
