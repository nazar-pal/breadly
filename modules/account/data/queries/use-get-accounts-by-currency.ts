import { accounts } from '@/data/client/db-schema'
import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { and, asc, eq, ne } from 'drizzle-orm'

export function useGetAccountsByCurrency({
  userId,
  currencyId,
  excludeAccountId
}: {
  userId: string
  currencyId: string
  excludeAccountId?: string
}) {
  const query = db.query.accounts.findMany({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.currencyId, currencyId),
      eq(accounts.isArchived, false),
      excludeAccountId ? ne(accounts.id, excludeAccountId) : undefined
    ),
    with: { currency: true },
    orderBy: [asc(accounts.isArchived), asc(accounts.createdAt)]
  })

  const result = useDrizzleQuery(query)

  return {
    ...result,
    data: result.data || []
  }
}

export type UseGetAccountsByCurrencyResult = ReturnType<
  typeof useGetAccountsByCurrency
>
