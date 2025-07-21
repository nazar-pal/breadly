import { asyncTryCatch } from '@/lib/utils/index'
import { endOfMonth, startOfMonth } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { budgets } from '../../schema/table_5_budgets'
import { db } from '../../system'

const budgetInsertSchema = createInsertSchema(budgets)
const budgetUpdateSchema = createUpdateSchema(budgets).pick({
  amount: true,
  currency: true,
  startDate: true,
  endDate: true
})

export async function createOrUpdateBudget({
  userId,
  categoryId,
  amount,
  currency,
  startDate = new Date()
}: {
  userId: string
  categoryId: string
  amount: number
  currency: string
  startDate?: Date
}) {
  // Calculate month boundaries for the given start date
  const monthStart = startOfMonth(startDate)
  const monthEnd = endOfMonth(startDate)

  // Check if a monthly budget already exists for this category and month
  const existingBudget = await db.query.budgets.findFirst({
    where: and(
      eq(budgets.userId, userId),
      eq(budgets.categoryId, categoryId),
      eq(budgets.startDate, monthStart),
      eq(budgets.endDate, monthEnd)
    )
  })

  if (existingBudget) {
    // Update existing budget
    const parsedData = budgetUpdateSchema.parse({
      amount,
      currency,
      startDate: monthStart,
      endDate: monthEnd
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
      currency,
      startDate: monthStart,
      endDate: monthEnd
    })

    const [error, result] = await asyncTryCatch(
      db.insert(budgets).values(parsedData)
    )

    return [error, result]
  }
}
