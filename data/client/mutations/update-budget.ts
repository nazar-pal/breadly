import { asyncTryCatch } from '@/lib/utils/index'
import { and, eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { budgets } from '../db-schema'
import { db } from '../powersync/system'

const budgetUpdateSchema = createUpdateSchema(budgets).pick({
  amount: true,
  currency: true,
  startDate: true,
  endDate: true
})

export async function updateBudget({
  id,
  userId,
  data
}: {
  id: string
  userId: string
  data: z.input<typeof budgetUpdateSchema>
}) {
  const parsedData = budgetUpdateSchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db
      .update(budgets)
      .set(parsedData)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
  )

  return [error, result]
}
