import { asyncTryCatch } from '@/lib/utils/index'
import { count, eq } from 'drizzle-orm'
import { userPreferences } from '../schema/table_3_user-preferences'
import { categories } from '../schema/table_4_categories'
import { budgets } from '../schema/table_5_budgets'
import { accounts } from '../schema/table_6_accounts'
import { transactions } from '../schema/table_7_transactions'
import { attachments } from '../schema/table_8_attachments'
import { transactionAttachments } from '../schema/table_9_transaction-attachments'
import { db } from '../system'

/**
 * Migrates all data from a guest user ID to an authenticated user ID
 * This runs locally first, then will sync to the server when PowerSync connects
 */
export async function migrateGuestDataToAuthenticatedUser(
  guestUserId: string,
  authenticatedUserId: string
): Promise<{ success: boolean; error?: Error }> {
  console.log(
    `🔄 Starting migration from guest ${guestUserId} to user ${authenticatedUserId}`
  )

  try {
    // Wrap all updates in a transaction for atomicity
    await db.transaction(async tx => {
      // 1. Migrate categories
      const [categoriesError] = await asyncTryCatch(
        tx
          .update(categories)
          .set({ userId: authenticatedUserId })
          .where(eq(categories.userId, guestUserId))
      )
      if (categoriesError) throw categoriesError

      // 2. Migrate accounts
      const [accountsError] = await asyncTryCatch(
        tx
          .update(accounts)
          .set({ userId: authenticatedUserId })
          .where(eq(accounts.userId, guestUserId))
      )
      if (accountsError) throw accountsError

      // 3. Migrate transactions
      const [transactionsError] = await asyncTryCatch(
        tx
          .update(transactions)
          .set({ userId: authenticatedUserId })
          .where(eq(transactions.userId, guestUserId))
      )
      if (transactionsError) throw transactionsError

      // 4. Migrate budgets
      const [budgetsError] = await asyncTryCatch(
        tx
          .update(budgets)
          .set({ userId: authenticatedUserId })
          .where(eq(budgets.userId, guestUserId))
      )
      if (budgetsError) throw budgetsError

      // 5. Migrate attachments
      const [attachmentsError] = await asyncTryCatch(
        tx
          .update(attachments)
          .set({ userId: authenticatedUserId })
          .where(eq(attachments.userId, guestUserId))
      )
      if (attachmentsError) throw attachmentsError

      // 6. Migrate transaction attachments
      const [transactionAttachmentsError] = await asyncTryCatch(
        tx
          .update(transactionAttachments)
          .set({ userId: authenticatedUserId })
          .where(eq(transactionAttachments.userId, guestUserId))
      )
      if (transactionAttachmentsError) throw transactionAttachmentsError

      // 7. Migrate user preferences (if any exist for guest)
      const [userPreferencesError] = await asyncTryCatch(
        tx
          .update(userPreferences)
          .set({ userId: authenticatedUserId })
          .where(eq(userPreferences.userId, guestUserId))
      )
      if (userPreferencesError) throw userPreferencesError

      console.log(
        `✅ Successfully migrated all data from guest ${guestUserId} to user ${authenticatedUserId}`
      )
    })

    return { success: true }
  } catch (error) {
    console.error(`❌ Migration failed:`, error)
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error('Unknown migration error')
    }
  }
}

/**
 * Get stats about guest data before migration (useful for UI feedback)
 * Uses efficient COUNT queries instead of fetching all data
 */
export async function getGuestDataStats(guestUserId: string) {
  // Use efficient COUNT queries instead of fetching all data
  const [categoriesError, categoriesResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(categories)
      .where(eq(categories.userId, guestUserId))
  )

  const [accountsError, accountsResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(accounts)
      .where(eq(accounts.userId, guestUserId))
  )

  const [transactionsError, transactionsResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(transactions)
      .where(eq(transactions.userId, guestUserId))
  )

  const [budgetsError, budgetsResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(budgets)
      .where(eq(budgets.userId, guestUserId))
  )

  const [attachmentsError, attachmentsResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(attachments)
      .where(eq(attachments.userId, guestUserId))
  )

  // Extract counts safely
  const categoriesCount = !categoriesError
    ? (categoriesResult?.[0]?.count ?? 0)
    : 0
  const accountsCount = !accountsError ? (accountsResult?.[0]?.count ?? 0) : 0
  const transactionsCount = !transactionsError
    ? (transactionsResult?.[0]?.count ?? 0)
    : 0
  const budgetsCount = !budgetsError ? (budgetsResult?.[0]?.count ?? 0) : 0
  const attachmentsCount = !attachmentsError
    ? (attachmentsResult?.[0]?.count ?? 0)
    : 0

  return {
    categories: categoriesCount,
    accounts: accountsCount,
    transactions: transactionsCount,
    budgets: budgetsCount,
    attachments: attachmentsCount,
    // Calculate total items for easy display
    total:
      categoriesCount +
      accountsCount +
      transactionsCount +
      budgetsCount +
      attachmentsCount
  }
}
