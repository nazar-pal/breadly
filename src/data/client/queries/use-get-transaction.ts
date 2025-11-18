import { useDrizzleQuery } from '@/lib/hooks'
import { getTransaction } from './get-transaction'

export function useGetTransaction({
  userId,
  transactionId
}: {
  userId: string
  transactionId: string
}) {
  const query = getTransaction({ userId, transactionId })

  const result = useDrizzleQuery(query)

  return result
}
