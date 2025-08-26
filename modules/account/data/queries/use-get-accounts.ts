import { accounts, AccountType } from '@/data/client/db-schema'
import { db } from '@/data/client/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, asc, eq } from 'drizzle-orm'

export function useGetAccounts({
  userId,
  accountType,
  isArchived
}: {
  userId: string
  accountType: AccountType
  isArchived?: boolean
}) {
  const query = db.query.accounts.findMany({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.type, accountType),
      isArchived !== undefined ? eq(accounts.isArchived, isArchived) : undefined
    ),
    with: {
      currency: true
    },
    orderBy: [asc(accounts.isArchived), asc(accounts.createdAt)]
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}

export type UseGetAccountsResult = ReturnType<typeof useGetAccounts>
export type AccountItem = UseGetAccountsResult['data'][number]
