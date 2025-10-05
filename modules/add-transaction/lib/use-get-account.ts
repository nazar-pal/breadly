import { accounts } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq } from 'drizzle-orm'

export function useGetAccount({
  userId,
  accountId
}: {
  userId: string
  accountId: string
}) {
  const query = db.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.id, accountId)),
    with: { currency: true }
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
