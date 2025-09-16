import {
  accounts,
  categories,
  type AccountInsertSQLite,
  type CategoryInsertSQLite
} from '@/data/client/db-schema'
import { db } from '@/data/client/powersync/system'
import { DEFAULT_ACCOUNTS, DEFAULT_CATEGORIES } from '../../const/default-data'

/**
 * Bulk-insert default categories & accounts for a guest
 */
export async function insertDefaultDataIntoDatabase(
  userId: string
): Promise<void> {
  if (__DEV__) {
    console.log(`🌱 [SEEDING] Insert defaults for ${userId}`)
  }

  await db.transaction(async tx => {
    // Insert categories in parent-first order (preserves self-referential FK integrity)
    const categoriesToInsert: CategoryInsertSQLite[] = DEFAULT_CATEGORIES.map(
      category => ({ ...category, userId })
    )
    for (const category of categoriesToInsert) {
      await tx.insert(categories).values(category)
    }

    // Insert accounts
    const accountsToInsert: AccountInsertSQLite[] = DEFAULT_ACCOUNTS.map(
      account => ({ ...account, userId })
    )
    await tx.insert(accounts).values(accountsToInsert)
  })

  if (__DEV__) console.log(`✅ [SEEDING] Defaults inserted for ${userId}`)
}
