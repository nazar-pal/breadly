import { accounts } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'

interface Params {
  userId: string
  accountId: string
}

export function getAccount({ userId, accountId }: Params) {
  return db.query.accounts.findMany({
    where: and(eq(accounts.userId, userId), eq(accounts.id, accountId)),
    with: { currency: true },
    limit: 1
  })
}

export type GetAccountResult = Awaited<ReturnType<typeof getAccount>>
export type GetAccountResultItem = GetAccountResult[number]
