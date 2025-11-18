import { AccountType } from '@/data/client/db-schema'
import { useDrizzleQuery } from '@/lib/hooks'
import { getAccounts } from './get-accounts'

export function useGetAccounts({
  userId,
  accountType,
  isArchived
}: {
  userId: string
  accountType: AccountType
  isArchived?: boolean
}) {
  const query = getAccounts({ userId, accountType, isArchived })

  const result = useDrizzleQuery(query)

  return result
}

export type UseGetAccountsResult = ReturnType<typeof useGetAccounts>
export type AccountItem = UseGetAccountsResult['data'][number]
