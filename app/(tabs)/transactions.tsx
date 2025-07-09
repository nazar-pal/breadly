import { OperationListItem } from '@/components/accounts/operation-list-item'
import { Card, CardContent } from '@/components/ui/card'
import { useUserSession } from '@/lib/hooks'
import { useGetTransactions } from '@/lib/powersync/data/queries'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function OperationsScreen() {
  const insets = useSafeAreaInsets()
  const { userId } = useUserSession()

  // Calculate date ranges
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Get today's transactions
  const {
    data: todaysTransactionsData = [],
    isLoading: isLoadingToday,
    error: todayError
  } = useGetTransactions({
    userId: userId || '',
    dateFrom: today,
    dateTo: tomorrow
  })

  // Get all transactions before today
  const {
    data: previousTransactionsData = [],
    isLoading: isLoadingPrevious,
    error: previousError
  } = useGetTransactions({
    userId: userId || '',
    dateTo: yesterday
  })

  // Use transaction data directly
  const todaysTransactions = todaysTransactionsData
  const previousTransactions = previousTransactionsData

  // Combine all transactions
  const allTransactions = [...todaysTransactions, ...previousTransactions]

  const isLoading = isLoadingToday || isLoadingPrevious
  const error = todayError || previousError

  // Show loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-center text-foreground">
          Loading transactions...
        </Text>
      </View>
    )
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-center text-destructive">
          Error loading transactions: {error.message}
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32
        }}
      >
        {/* Today's Transactions */}
        {todaysTransactions.length > 0 && (
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-foreground">
              Today&apos;s Transactions
            </Text>
            {todaysTransactions.map(transaction => (
              <OperationListItem key={transaction.id} operation={transaction} />
            ))}
          </View>
        )}

        {/* All Transactions */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-foreground">
            All Transactions
          </Text>
          {allTransactions.length > 0 ? (
            allTransactions.map(transaction => (
              <OperationListItem key={transaction.id} operation={transaction} />
            ))
          ) : (
            <Card>
              <CardContent className="p-4">
                <Text className="text-center text-muted-foreground">
                  No transactions found
                </Text>
              </CardContent>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
