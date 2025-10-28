import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'
import { transactions, TransactionType } from '../db-schema'

export async function updateTransaction({
  userId,
  transactionId,
  data
}: {
  userId: string
  transactionId: string
  data: Partial<{
    type: TransactionType
    accountId: string
    counterAccountId: string | null
    categoryId: string
    amount: number
    currencyId: string
    txDate: Date
    notes: string | null
  }>
}) {
  const [error, result] = await asyncTryCatch(
    db.update(transactions).set(data).where(eq(transactions.id, transactionId))
  )

  return [error, result]
}
