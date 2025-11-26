import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import {
  LoadingState,
  NoTransactionsState,
  TransactionList
} from './components'
import { usePaginatedTransactions } from './lib'

export default function TabsTransactionsScreen() {
  const { userId } = useUserSession()

  const {
    todaysTransactions,
    earlierTransactions,
    isLoading,
    isLoadingMore,
    loadMore
  } = usePaginatedTransactions({ userId })

  const hasToday = todaysTransactions.length > 0
  const hasEarlier = earlierTransactions.length > 0

  if (isLoading) {
    return <LoadingState />
  }

  if (!hasToday && !hasEarlier) {
    return <NoTransactionsState />
  }

  return (
    <TransactionList
      todaysTransactions={todaysTransactions}
      earlierTransactions={earlierTransactions}
      onEndReached={loadMore}
      isLoadingMore={isLoadingMore}
    />
  )
}
