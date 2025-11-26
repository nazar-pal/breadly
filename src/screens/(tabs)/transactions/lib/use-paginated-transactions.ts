import { getTransactions } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useState } from 'react'
import { getDateRanges } from './utils'

const PAGE_SIZE = 20

interface UsePaginatedTransactionsParams {
  userId: string
}

export function usePaginatedTransactions({
  userId
}: UsePaginatedTransactionsParams) {
  const { today, tomorrow, yesterday } = getDateRanges()
  const [limit, setLimit] = useState(PAGE_SIZE)

  // Today's transactions - no pagination needed (typically small)
  const { data: todaysTransactions, isLoading: isLoadingToday } =
    useDrizzleQuery(
      getTransactions({
        userId,
        dateFrom: today,
        dateTo: tomorrow
      })
    )

  // Earlier transactions - just increase limit to load more
  const { data: earlierTransactions, isLoading: isLoadingEarlier } =
    useDrizzleQuery(
      getTransactions({
        userId,
        dateTo: yesterday,
        limit
      })
    )

  const hasMoreEarlier = earlierTransactions.length >= limit

  const loadMore = () => {
    if (!isLoadingEarlier && hasMoreEarlier) {
      setLimit(prev => prev + PAGE_SIZE)
    }
  }

  const isLoading = isLoadingToday || (limit === PAGE_SIZE && isLoadingEarlier)
  const isLoadingMore = limit > PAGE_SIZE && isLoadingEarlier

  return {
    todaysTransactions,
    earlierTransactions,
    isLoading,
    isLoadingMore,
    hasMoreEarlier,
    loadMore
  }
}
