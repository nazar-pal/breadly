import { useDrizzleQuery } from '@/lib/hooks'
import { CATEGORY_TYPE } from '../db-schema'
import { sumTransactions } from './sum-transactions'

export function useSumTransactions({
  userId,
  categoryId,
  type,
  transactionsFrom,
  transactionsTo
}: {
  userId: string
  categoryId?: string
  type: (typeof CATEGORY_TYPE)[number]
  transactionsFrom?: Date
  transactionsTo?: Date
}) {
  const query = sumTransactions({
    userId,
    categoryId,
    type,
    transactionsFrom,
    transactionsTo
  })

  const result = useDrizzleQuery(query)

  return result
}
