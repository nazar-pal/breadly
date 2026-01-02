import { useUserSession } from '@/system-v2/session'
import React from 'react'
import {
  LoadingState,
  NoTransactionsState,
  TransactionList
} from './components'
import { usePaginatedTransactions } from './lib'

export default function TabsTransactionsScreen() {
  const { userId } = useUserSession()

  const { dateGroups, isLoading, isLoadingMore, loadMore } =
    usePaginatedTransactions({ userId })

  if (isLoading) {
    return <LoadingState />
  }

  // Check if there are any transactions at all
  const hasTransactions = dateGroups.some(g => g.transactions.length > 0)

  if (!hasTransactions && dateGroups.length === 0) {
    return <NoTransactionsState />
  }

  return (
    <TransactionList
      dateGroups={dateGroups}
      onEndReached={loadMore}
      isLoadingMore={isLoadingMore}
    />
  )
}
