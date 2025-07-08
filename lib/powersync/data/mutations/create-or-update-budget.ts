import { asyncTryCatch } from '@/lib/utils/index'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { budgets } from '../../schema/table_5_budgets'
import { db } from '../../system'

const budgetInsertSchema = createInsertSchema(budgets)
const budgetUpdateSchema = createUpdateSchema(budgets).pick({
  amount: true,
  startDate: true
})

export async function createOrUpdateBudget({
  userId,
  categoryId,
  amount,
  startDate = new Date()
}: {
  userId: string
  categoryId: string
  amount: number
  startDate?: Date
}) {
  // Check if a monthly budget already exists for this category
  const existingBudget = await db.query.budgets.findFirst({
    where: and(
      eq(budgets.userId, userId),
      eq(budgets.categoryId, categoryId),
      eq(budgets.period, 'monthly')
    )
  })

  if (existingBudget) {
    // Update existing budget
    const parsedData = budgetUpdateSchema.parse({
      amount,
      startDate
    })

    const [error, result] = await asyncTryCatch(
      db
        .update(budgets)
        .set(parsedData)
        .where(eq(budgets.id, existingBudget.id))
    )

    return [error, result]
  } else {
    // Create new budget
    const parsedData = budgetInsertSchema.parse({
      userId,
      categoryId,
      amount,
      period: 'monthly',
      startDate
    })

    const [error, result] = await asyncTryCatch(
      db.insert(budgets).values(parsedData)
    )

    return [error, result]
  }
}
