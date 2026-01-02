import { accounts, categories } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils'
import { count, eq } from 'drizzle-orm'
import { DEFAULT_ACCOUNTS, DEFAULT_CATEGORIES } from '../const/default-data'
import { db } from '../powersync/database'
import type { SyncEvent } from '../state-machine/events'

/**
 * Checks if a user already has data in the local database.
 * Used for both seeding checks and guest-to-auth migration checks.
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

  if (categoriesError) {
    console.warn(
      `⚠️ [SEEDING] Category count failed for ${userId}: ${categoriesError.message}. Skipping seeding to avoid duplicates.`
    )
    return true
  }

  const categoryCount = categoriesResult?.[0]?.count ?? 0

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

  if (accountsError) {
    console.warn(
      `⚠️ [SEEDING] Account count failed for ${userId}: ${accountsError.message}. Skipping seeding to avoid duplicates.`
    )
    return true
  }

  const accountCount = accountsResult?.[0]?.count ?? 0
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

/**
 * Seeds default categories and accounts for a new guest user on first app launch.
 */
export async function seedGuestData(guestUserId: string): Promise<SyncEvent> {
  if (__DEV__) {
    console.log(`🌱 [SEEDING] Check seeding for ${guestUserId}`)
  }

  // Secondary check: Does this user already have data in the database?
  const hasExistingData = await checkDbForGuestData(guestUserId)
  if (hasExistingData) {
    if (__DEV__) {
      console.log(`⏭️ ${guestUserId} already has data, skip seeding`)
    }
    return { type: 'SEEDING_COMPLETE' }
  }

  // User is genuinely new - proceed with seeding
  if (__DEV__) {
    console.log(`🚀 Seeding needed for ${guestUserId}`)
  }

  try {
    await db.transaction(async tx => {
      // Insert categories in parent-first order (preserves self-referential FK integrity)
      const categoriesToInsert = DEFAULT_CATEGORIES.map(category => ({
        ...category,
        userId: guestUserId
      }))
      for (const category of categoriesToInsert) {
        await tx.insert(categories).values(category)
      }

      // Insert accounts
      const accountsToInsert = DEFAULT_ACCOUNTS.map(account => ({
        ...account,
        userId: guestUserId
      }))
      await tx.insert(accounts).values(accountsToInsert)
    })

    if (__DEV__) {
      console.log(`🎉 Seeding done for ${guestUserId}`)
    }

    return { type: 'SEEDING_COMPLETE' }
  } catch (error) {
    console.error(
      `❌ [SEEDING] Failed to seed data for user ${guestUserId}:`,
      error
    )
    return {
      type: 'ERROR',
      error: error instanceof Error ? error : new Error(String(error))
    }
  }
}
