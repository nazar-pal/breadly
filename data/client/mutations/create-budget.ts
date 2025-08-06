import { asyncTryCatch } from '@/lib/utils/index'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { budgets } from '../db-schema'
import { db } from '../powersync/system'

const budgetInsertSchema = createInsertSchema(budgets)

export async function createBudget({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof budgetInsertSchema>, 'userId'>
}) {
  const parsedData = budgetInsertSchema.parse({ ...data, userId })

  const [error, result] = await asyncTryCatch(
    db.insert(budgets).values(parsedData)
  )

  return [error, result]
}
