import { useDrizzleQuery } from '@/lib/hooks'
import { getTransactions } from './get-transactions'

interface UseGetTransactionsParams {
  userId: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

export function useGetTransactions({
  userId,
  dateFrom,
  dateTo,
  limit
}: UseGetTransactionsParams) {
  const query = getTransactions({ userId, dateFrom, dateTo, limit })

  const result = useDrizzleQuery(query)

  return result
}
