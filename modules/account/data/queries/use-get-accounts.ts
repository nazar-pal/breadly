import { accounts, AccountType } from '@/data/client/db-schema'
import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
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

  const result = useDrizzleQuery(query)

  return result
}

export type UseGetAccountsResult = ReturnType<typeof useGetAccounts>
export type AccountItem = UseGetAccountsResult['data'][number]
