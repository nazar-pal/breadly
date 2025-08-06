import { userPreferences } from '@/lib/powersync/schema/table_3_user-preferences'
import { categories } from '@/lib/powersync/schema/table_4_categories'
import { budgets } from '@/lib/powersync/schema/table_5_budgets'
import { accounts } from '@/lib/powersync/schema/table_6_accounts'
import { transactions } from '@/lib/powersync/schema/table_7_transactions'
import { attachments } from '@/lib/powersync/schema/table_8_attachments'
import { transactionAttachments } from '@/lib/powersync/schema/table_9_transaction-attachments'
import { db } from '@/lib/powersync/system'
import { eq } from 'drizzle-orm'

/**
 * Migrates all data from a guest user ID to an authenticated user ID
 * This runs locally first, then will sync to the server when PowerSync connects
 */
export async function migrateGuestDataToAuthenticatedUser(
  guestUserId: string,
  authenticatedUserId: string
) {
  console.log(
    `🔄 Starting migration from guest ${guestUserId} to user ${authenticatedUserId}`
  )

  // Wrap all updates in a transaction for atomicity
  await db.transaction(async tx => {
    // 1. Migrate categories
    tx.update(categories)
      .set({ userId: authenticatedUserId })
      .where(eq(categories.userId, guestUserId))

    // 2. Migrate accounts
    tx.update(accounts)
      .set({ userId: authenticatedUserId })
      .where(eq(accounts.userId, guestUserId))

    // 3. Migrate transactions
    tx.update(transactions)
      .set({ userId: authenticatedUserId })
      .where(eq(transactions.userId, guestUserId))

    // 4. Migrate budgets
    tx.update(budgets)
      .set({ userId: authenticatedUserId })
      .where(eq(budgets.userId, guestUserId))

    // 5. Migrate attachments
    tx.update(attachments)
      .set({ userId: authenticatedUserId })
      .where(eq(attachments.userId, guestUserId))

    // 6. Migrate transaction attachments
    tx.update(transactionAttachments)
      .set({ userId: authenticatedUserId })
      .where(eq(transactionAttachments.userId, guestUserId))

    // 7. Migrate user preferences (if any exist for guest)
    tx.update(userPreferences)
      .set({ userId: authenticatedUserId })
      .where(eq(userPreferences.userId, guestUserId))

    console.log(
      `✅ Successfully migrated all data from guest ${guestUserId} to user ${authenticatedUserId}`
    )
  })
}
