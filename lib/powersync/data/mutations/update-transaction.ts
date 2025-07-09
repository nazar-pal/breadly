import { asyncTryCatch } from '@/lib/utils/index'
import { eq } from 'drizzle-orm'
import { transactions } from '../../schema/table_7_transactions'
import { db } from '../../system'

export async function updateTransaction({
  userId,
  transactionId,
  data
}: {
  userId: string
  transactionId: string
  data: Partial<{
    type: 'expense' | 'income' | 'transfer'
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
