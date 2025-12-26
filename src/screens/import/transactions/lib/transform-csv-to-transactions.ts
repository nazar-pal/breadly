import { categories } from '@/data/client/db-schema'
import { toSmallestUnit } from '@/lib/utils/currency-info'
import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'expo-crypto'
import type { CsvArr } from './csv-arr-schema'

/**
 * Transforms validated CSV rows into transaction insert data.
 * Resolves category names to IDs and converts amounts from base units to smallest unit.
 *
 * IMPORTANT: CSV amounts are expected in BASE UNITS (e.g., 10.50 USD, not 1050 cents).
 * Amounts are already rounded to currency precision by the CSV schema validation.
 * This function converts them to smallest units for database storage.
 */
export async function transformCsvRowsToTransactions(
  rows: CsvArr,
  userId: string
) {
  // Fetch categories and build lookup map
  const allCategories = await db.query.categories.findMany({
    where: eq(categories.userId, userId),
    with: { parent: true }
  })

  const categoryMap = new Map(
    allCategories.map(cat => {
      const key = cat.parent
        ? `${cat.parent.name.toLowerCase()}|${cat.name.toLowerCase()}|${cat.type}`
        : `${cat.name.toLowerCase()}|${cat.type}`
      return [key, cat.id]
    })
  )

  // Transform rows
  const now = new Date()
  return rows.map(row => {
    const key = row.parentCategoryName
      ? `${row.parentCategoryName.toLowerCase()}|${row.categoryName.toLowerCase()}|${row.type}`
      : `${row.categoryName.toLowerCase()}|${row.type}`

    return {
      id: randomUUID(),
      type: row.type,
      accountId: null,
      counterAccountId: null,
      categoryId: categoryMap.get(key)!,
      amount: toSmallestUnit(row.amount, row.currency),
      currencyId: row.currency,
      txDate: row.createdAt,
      notes: null,
      createdAt: now
    }
  })
}
