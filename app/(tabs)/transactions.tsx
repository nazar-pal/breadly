import { OperationListItem } from '@/components/operation-list-item'
import { useGetTransactions } from '@/data/client/queries'
import { useUserSession } from '@/modules/session-and-migration'
import { LegendList } from '@legendapp/list'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
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

  // Combine transactions with section headers for LegendList
  const getListData = () => {
    const data: {
      type: 'header' | 'transaction' | 'empty'
      id: string
      title?: string
      transaction?: (typeof todaysTransactions)[0]
    }[] = []

    // Today's transactions section
    data.push({
      type: 'header',
      id: 'today-header',
      title: "Today's Transactions"
    })

    if (hasToday) {
      todaysTransactions.forEach(tx => {
        data.push({
          type: 'transaction',
          id: tx.id,
          transaction: tx
        })
      })
    } else {
      data.push({
        type: 'empty',
        id: 'today-empty'
      })
    }

    // Earlier transactions section
    if (hasEarlier) {
      data.push({
        type: 'header',
        id: 'earlier-header',
        title: 'Earlier Transactions'
      })

      earlierTransactions.forEach(tx => {
        data.push({
          type: 'transaction',
          id: tx.id,
          transaction: tx
        })
      })
    }

    return data
  }

  const listData = getListData()

  // Render function for list items
  const renderItem = ({ item }: { item: (typeof listData)[0] }) => {
    switch (item.type) {
      case 'header':
        return (
          <View
            className={`mb-3 ${item.id === 'today-header' ? 'mt-0' : 'mt-6'}`}
          >
            <Text className="text-lg font-semibold text-foreground">
              {item.title}
            </Text>
          </View>
        )

      case 'transaction':
        return item.transaction ? (
          <View className="mb-2">
            <OperationListItem operation={item.transaction} />
          </View>
        ) : null

      case 'empty':
        return (
          <Text className="text-muted-foreground">
            Don&apos;t forget to input your transactions when you make them 📝
          </Text>
        )

      default:
        return null
    }
  }

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
      <LegendList
        data={listData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 16, paddingTop: 16 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32
        }}
        recycleItems={false} // Keep false since we have different item types
      />
    </View>
  )
}
