import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { and, asc, eq } from 'drizzle-orm'
import { accounts, AccountType } from '../db-schema'

export function useGetAccounts({
  userId,
  accountType
}: {
  userId: string
  accountType: AccountType
}) {
  const query = db.query.accounts.findMany({
    where: and(eq(accounts.userId, userId), eq(accounts.type, accountType)),
    with: {
      currency: true
    },
    orderBy: [asc(accounts.createdAt)]
  })

  const result = useDrizzleQuery(query)

  return result
}
