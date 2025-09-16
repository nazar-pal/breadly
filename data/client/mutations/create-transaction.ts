import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { transactions } from '../db-schema'

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
