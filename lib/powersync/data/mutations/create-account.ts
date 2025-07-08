import { asyncTryCatch } from '@/lib/utils/index'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { accounts } from '../../schema/table_6_accounts'
import { db } from '../../system'

const accountInsertSchema = createInsertSchema(accounts)

export async function createAccount({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof accountInsertSchema>, 'userId'>
}) {
  const parsedData = accountInsertSchema.parse({ ...data, userId })

  const [error, result] = await asyncTryCatch(
    db.insert(accounts).values(parsedData)
  )

  return [error, result]
}
