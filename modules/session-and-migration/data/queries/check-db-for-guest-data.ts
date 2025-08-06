import { accounts, categories } from '@/data/client/db-schema'
import { db } from '@/data/client/powersync/system'
import { asyncTryCatch } from '@/lib/utils'
import { count, eq } from 'drizzle-orm'

/**
 * Checks if a guest user already has data in the local database
 * This serves as a double-check to prevent seeding users who already have categories/accounts
 * Optimized to return as soon as any data is found
 */
export async function checkDbForGuestData(userId: string): Promise<boolean> {
  if (__DEV__) {
    console.log(`🔍 [SEEDING] Checking local DB for ${userId}`)
  }

  // Check categories first - most likely to have data
  const [categoriesError, categoriesResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(categories)
      .where(eq(categories.userId, userId))
      .limit(1)
  )

  const categoryCount = !categoriesError
    ? (categoriesResult?.[0]?.count ?? 0)
    : 0

  // If we have categories, no need to check accounts
  if (categoryCount > 0) {
    if (__DEV__) {
      console.log(`✅ ${userId} has data (${categoryCount} categories)`)
    }
    return true
  }

  // Only check accounts if no categories found
  const [accountsError, accountsResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .limit(1)
  )

  const accountCount = !accountsError ? (accountsResult?.[0]?.count ?? 0) : 0
  const hasData = accountCount > 0

  if (__DEV__) {
    if (hasData) {
      console.log(`✅ ${userId} has data (${accountCount} accounts)`)
    } else {
      console.log(`📭 ${userId} has no data`)
    }
  }

  return hasData
}
