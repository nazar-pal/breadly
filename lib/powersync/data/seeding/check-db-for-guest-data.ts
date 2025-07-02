import { categories } from '@/lib/powersync/schema/table_4_categories'
import { accounts } from '@/lib/powersync/schema/table_6_accounts'
import { db } from '@/lib/powersync/system'
import { asyncTryCatch } from '@/lib/utils/try-catch'
import { count, eq } from 'drizzle-orm'

/**
 * Checks if a guest user already has data in the local database
 * This serves as a double-check to prevent seeding users who already have categories/accounts
 */
export async function checkDbForGuestData(userId: string): Promise<boolean> {
  if (__DEV__) {
    console.log(`🔍 [SEEDING] Checking local DB for ${userId}`)
  }

  const [categoriesError, categoriesResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(categories)
      .where(eq(categories.userId, userId))
  )

  const [accountsError, accountsResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(accounts)
      .where(eq(accounts.userId, userId))
  )

  const categoryCount = !categoriesError
    ? (categoriesResult?.[0]?.count ?? 0)
    : 0
  const accountCount = !accountsError ? (accountsResult?.[0]?.count ?? 0) : 0

  const hasData = categoryCount > 0 || accountCount > 0

  if (__DEV__) {
    if (hasData) {
      console.log(
        `✅ ${userId} has data (${categoryCount} categories, ${accountCount} accounts)`
      )
    } else {
      console.log(`📭 ${userId} has no data`)
    }
  }

  return hasData
}
