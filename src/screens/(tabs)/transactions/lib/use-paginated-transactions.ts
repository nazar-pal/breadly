import { getTransactions } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useMemo, useState } from 'react'
import type { DateGroup } from './types'
import { groupTransactionsByDate } from './utils'

const PAGE_SIZE = 30

interface UsePaginatedTransactionsParams {
  userId: string
}

export function usePaginatedTransactions({
  userId
}: UsePaginatedTransactionsParams) {
  const [limit, setLimit] = useState(PAGE_SIZE)

  // Get all transactions with pagination
  const { data: transactions, isLoading } = useDrizzleQuery(
    getTransactions({
      userId,
      limit
    })
  )

  // Group transactions by date
  const dateGroups: DateGroup[] = useMemo(() => {
    return groupTransactionsByDate(transactions)
  }, [transactions])

  const hasMore = transactions.length >= limit

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setLimit(prev => prev + PAGE_SIZE)
    }
  }

  const isLoadingMore = limit > PAGE_SIZE && isLoading

  return {
    dateGroups,
    isLoading: limit === PAGE_SIZE && isLoading,
    isLoadingMore,
    hasMore,
    loadMore
  }
}
