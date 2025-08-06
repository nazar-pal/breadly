import { asyncTryCatch } from '@/lib/utils/index'
import { and, eq } from 'drizzle-orm'
import { accounts } from '../db-schema'
import { db } from '../powersync/system'

export async function deleteAccount({
  id,
  userId
}: {
  id: string
  userId: string
}) {
  const [error, result] = await asyncTryCatch(
    db
      .delete(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
  )

  return [error, result]
}
