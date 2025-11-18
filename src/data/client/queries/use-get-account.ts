import { useDrizzleQuery } from '@/lib/hooks'
import { getAccount } from './get-account'

export function useGetAccount({
  userId,
  accountId
}: {
  userId: string
  accountId: string
}) {
  const query = getAccount({ userId, accountId })

  const result = useDrizzleQuery(query)

  return result
}

export type UseGetAccountResult = ReturnType<typeof useGetAccount>
export type AccountDetails = UseGetAccountResult['data'][number]
