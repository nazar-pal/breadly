import {
  categories,
  type CategoryInsertSQLite
} from '@/lib/powersync/schema/table_4_categories'
import {
  accounts,
  type AccountInsertSQLite
} from '@/lib/powersync/schema/table_6_accounts'
import { db } from '@/lib/powersync/system'
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
    // Insert categories
    const categoriesToInsert: CategoryInsertSQLite[] = DEFAULT_CATEGORIES.map(
      category => ({ ...category, userId })
    )
    await tx.insert(categories).values(categoriesToInsert)

    // Insert accounts
    const accountsToInsert: AccountInsertSQLite[] = DEFAULT_ACCOUNTS.map(
      account => ({ ...account, userId })
    )
    await tx.insert(accounts).values(accountsToInsert)
  })

  if (__DEV__) console.log(`✅ [SEEDING] Defaults inserted for ${userId}`)
}
