import { accounts } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

const accountUpdateSchema = createUpdateSchema(accounts).pick({
  name: true,
  description: true,
  balance: true,
  isArchived: true,
  savingsTargetAmount: true,
  savingsTargetDate: true,
  debtIsOwedToMe: true,
  debtDueDate: true
})

export async function updateAccount({
  id,
  userId,
  data
}: {
  id: string
  userId: string
  data: z.input<typeof accountUpdateSchema>
}) {
  const parsedData = accountUpdateSchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db
      .update(accounts)
      .set(parsedData)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
  )

  return [error, result]
}
