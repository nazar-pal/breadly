import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, asc, eq } from 'drizzle-orm'
import { accounts, AccountType } from '../db-schema'
import { db } from '../powersync/system'

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

  const result = useQuery(toCompilableQuery(query))

  return result
}
