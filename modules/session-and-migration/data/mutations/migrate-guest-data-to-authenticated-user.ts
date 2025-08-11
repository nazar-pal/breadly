import {
  accounts,
  attachments,
  budgets,
  categories,
  transactionAttachments,
  transactions,
  userPreferences
} from '@/data/client/db-schema'
import { db } from '@/data/client/powersync/system'
import { eq } from 'drizzle-orm'

/**
 * Migrates all data from a guest user ID to an authenticated user ID
 * This runs locally first, then will sync to the server when PowerSync connects
 */
export async function migrateGuestDataToAuthenticatedUser(
  guestUserId: string,
  authenticatedUserId: string
) {
  if (__DEV__) {
    console.log(
      `🔄 Starting migration from guest ${guestUserId} to user ${authenticatedUserId}`
    )
  }

  // Wrap all updates in a transaction for atomicity
  await db.transaction(async tx => {
    // 1. Migrate categories
    await tx
      .update(categories)
      .set({ userId: authenticatedUserId })
      .where(eq(categories.userId, guestUserId))

    // 2. Migrate accounts
    await tx
      .update(accounts)
      .set({ userId: authenticatedUserId })
      .where(eq(accounts.userId, guestUserId))

    // 3. Migrate transactions
    await tx
      .update(transactions)
      .set({ userId: authenticatedUserId })
      .where(eq(transactions.userId, guestUserId))

    // 4. Migrate budgets
    await tx
      .update(budgets)
      .set({ userId: authenticatedUserId })
      .where(eq(budgets.userId, guestUserId))

    // 5. Migrate attachments
    await tx
      .update(attachments)
      .set({ userId: authenticatedUserId })
      .where(eq(attachments.userId, guestUserId))

    // 6. Migrate transaction attachments
    await tx
      .update(transactionAttachments)
      .set({ userId: authenticatedUserId })
      .where(eq(transactionAttachments.userId, guestUserId))

    // 7. Migrate user preferences (if any exist for guest)
    // Note: userPreferences has both `id` (PowerSync PK) and `userId` fields.
    // We must update BOTH to the authenticated user ID to maintain consistency
    // and avoid sync/relationship issues.
    await tx
      .update(userPreferences)
      .set({ id: authenticatedUserId, userId: authenticatedUserId })
      .where(eq(userPreferences.userId, guestUserId))

    if (__DEV__) {
      console.log(
        `✅ Successfully migrated all data from guest ${guestUserId} to user ${authenticatedUserId}`
      )
    }
  })
}
