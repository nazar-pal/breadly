import { accounts } from '@/data/client/db-schema'
import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'

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

  const result = useDrizzleQuery(query)

  return result
}

export type UseGetAccountResult = ReturnType<typeof useGetAccount>
export type AccountDetails = UseGetAccountResult['data'][number]
