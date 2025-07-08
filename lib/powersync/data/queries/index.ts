import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, asc, eq, gte, lte, sum } from 'drizzle-orm'
import { currencies } from '../../schema/table_1_currencies'
import { userPreferences } from '../../schema/table_3_user-preferences'
import { categories, CATEGORY_TYPE } from '../../schema/table_4_categories'
import { accounts } from '../../schema/table_6_accounts'
import { transactions } from '../../schema/table_7_transactions'
import { db } from '../../system'

export function useGetTransaction({
  userId,
  transactionId
}: {
  userId: string
  transactionId: string
}) {
  const query = db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      eq(transactions.id, transactionId)
    ),
    with: {
      category: true,
      account: true,
      counterAccount: true,
      currency: true,
      transactionAttachments: {
        with: {
          attachment: true
        }
      }
    },
    limit: 1
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}

export function useGetAccounts({
  userId,
  accountType
}: {
  userId: string
  accountType: 'saving' | 'payment' | 'debt'
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

export function useGetCategories({
  userId,
  type,
  transactionsFrom,
  transactionsTo
}: {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  transactionsFrom?: Date
  transactionsTo?: Date
}) {
  const query = db.query.categories.findMany({
    where: and(eq(categories.userId, userId), eq(categories.type, type)),
    with: {
      budgets: true,
      transactions: {
        where: and(
          eq(transactions.userId, userId),
          eq(transactions.type, type),
          transactionsFrom
            ? gte(transactions.txDate, transactionsFrom)
            : undefined,
          transactionsTo ? lte(transactions.txDate, transactionsTo) : undefined
        )
      }
    },
    orderBy: [asc(categories.createdAt)]
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}

export function useGetCategory({
  userId,
  categoryId
}: {
  userId: string
  categoryId: string
}) {
  const query = db
    .select()
    .from(categories)
    .where(and(eq(categories.userId, userId), eq(categories.id, categoryId)))
    .limit(1)

  const result = useQuery(toCompilableQuery(query))

  return result
}

export function useSumTransactions({
  userId,
  categoryId,
  type,
  transactionsFrom,
  transactionsTo
}: {
  userId: string
  categoryId?: string
  type: (typeof CATEGORY_TYPE)[number]
  transactionsFrom?: Date
  transactionsTo?: Date
}) {
  const query = db
    .select({
      totalAmount: sum(transactions.amount)
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        categoryId ? eq(transactions.categoryId, categoryId) : undefined,
        eq(transactions.type, type),
        transactionsFrom
          ? gte(transactions.txDate, transactionsFrom)
          : undefined,
        transactionsTo ? lte(transactions.txDate, transactionsTo) : undefined
      )
    )

  const result = useQuery(toCompilableQuery(query))

  return result
}

export function useGetUserPreferences({ userId }: { userId: string }) {
  const query = db.query.userPreferences.findMany({
    where: eq(userPreferences.userId, userId),
    with: {
      defaultCurrency: true
    },
    limit: 1
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}

// -------------------- Currencies Queries --------------------

export function useGetCurrencies() {
  const query = db.query.currencies.findMany({
    orderBy: [asc(currencies.name)]
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
