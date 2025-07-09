import { asyncTryCatch } from '@/lib/utils/index'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { transactions } from '../../schema/table_7_transactions'
import { db } from '../../system'

const transactionInsertSchema = createInsertSchema(transactions)

export async function createTransaction({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof transactionInsertSchema>, 'userId'>
}) {
  const parsedData = transactionInsertSchema.parse({ ...data, userId })

  const [error, result] = await asyncTryCatch(
    db.insert(transactions).values(parsedData)
  )

  return [error, result]
}
