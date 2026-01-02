import {
  accounts,
  attachments,
  budgets,
  categories,
  events,
  transactionAttachments,
  transactions,
  userPreferences
} from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system-v2'
import { eq } from 'drizzle-orm'

/**
 * Permanently deletes ALL user data from the local database.
 * This is an irreversible operation that removes:
 * - All transactions
 * - All accounts
 * - All categories
 * - All budgets
 * - All events
 * - All attachments
 * - All transaction attachments
 * - User preferences
 *
 * The deletion will sync to the server when PowerSync connects.
 *
 * @returns A tuple of [error, result] where error is null on success
 */
export async function deleteAllUserData({ userId }: { userId: string }) {
  if (__DEV__) {
    console.log(`🗑️ Starting deletion of all data for user ${userId}`)
  }

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Delete in order to respect foreign key constraints
      // (children before parents)

      // 1. Delete transaction attachments (junction table)
      await tx
        .delete(transactionAttachments)
        .where(eq(transactionAttachments.userId, userId))

      // 2. Delete attachments
      await tx.delete(attachments).where(eq(attachments.userId, userId))

      // 3. Delete transactions
      await tx.delete(transactions).where(eq(transactions.userId, userId))

      // 4. Delete events
      await tx.delete(events).where(eq(events.userId, userId))

      // 5. Delete budgets
      await tx.delete(budgets).where(eq(budgets.userId, userId))

      // 6. Delete accounts
      await tx.delete(accounts).where(eq(accounts.userId, userId))

      // 7. Delete categories
      await tx.delete(categories).where(eq(categories.userId, userId))

      // 8. Delete user preferences
      await tx.delete(userPreferences).where(eq(userPreferences.userId, userId))

      if (__DEV__) {
        console.log(`✅ Successfully deleted all data for user ${userId}`)
      }

      return true
    })
  )

  return [error, result]
}
