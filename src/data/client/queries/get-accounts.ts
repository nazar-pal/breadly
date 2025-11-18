import { accounts, AccountType } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, asc, eq } from 'drizzle-orm'

interface Params {
  userId: string
  accountType: AccountType
  isArchived?: boolean
}

export function getAccounts({ userId, accountType, isArchived }: Params) {
  return db.query.accounts.findMany({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.type, accountType),
      isArchived !== undefined ? eq(accounts.isArchived, isArchived) : undefined
    ),
    with: { currency: true },
    orderBy: [asc(accounts.isArchived), asc(accounts.createdAt)]
  })
}

export type GetAccountsResult = Awaited<ReturnType<typeof getAccounts>>
export type GetAccountsResultItem = GetAccountsResult[number]
