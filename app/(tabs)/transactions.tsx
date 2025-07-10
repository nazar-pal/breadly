import { OperationListItem } from '@/components/accounts/operation-list-item'
import { useUserSession } from '@/lib/hooks'
import { useGetTransactions } from '@/lib/powersync/data/queries'
import { Link } from 'expo-router'
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
  const { data: todaysTransactions, isLoading: isLoadingToday } =
    useGetTransactions({
      userId,
      dateFrom: today,
      dateTo: tomorrow
    })

  // Get all transactions before today
  const { data: earlierTransactions, isLoading: isLoadingPrevious } =
    useGetTransactions({
      userId,
      dateTo: yesterday
    })

  const isLoading = isLoadingToday || isLoadingPrevious

  const hasToday = todaysTransactions.length > 0
  const hasEarlier = earlierTransactions.length > 0

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

  // No transactions at all
  if (!hasToday && !hasEarlier) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="mb-2 text-center text-foreground">
          You haven’t created any transactions yet.
        </Text>
        <Text className="text-center text-muted-foreground">
          Head over to the{' '}
          <Link href="/(tabs)/(categories)" className="text-primary underline">
            Categories
          </Link>{' '}
          screen to add your first one!
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="my-4 px-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32
        }}
      >
        {/* Today's Transactions */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-foreground">
            Today&apos;s Transactions
          </Text>

          {hasToday ? (
            todaysTransactions.map(tx => (
              <OperationListItem key={tx.id} operation={tx} />
            ))
          ) : (
            <Text className="text-muted-foreground">
              Don&apos;t forget to input your transactions when you make them 📝
            </Text>
          )}
        </View>

        {/* Earlier Transactions */}
        {hasEarlier && (
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-foreground">
              Earlier Transactions
            </Text>
            {earlierTransactions.map(tx => (
              <OperationListItem key={tx.id} operation={tx} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
