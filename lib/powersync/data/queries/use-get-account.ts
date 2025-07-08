import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq } from 'drizzle-orm'
import { accounts } from '../../schema/table_6_accounts'
import { db } from '../../system'

export function useGetAccount({
  userId,
  accountId
}: {
  userId: string
  accountId: string
}) {
  const query = db.query.accounts.findMany({
    where: and(eq(accounts.userId, userId), eq(accounts.id, accountId)),
    with: {
      currency: true
    },
    limit: 1
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
