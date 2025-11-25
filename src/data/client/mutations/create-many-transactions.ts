import { categories, currencies, transactions } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils'
import { db } from '@/system/powersync/system'
import { startOfDay } from 'date-fns'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'expo-crypto'

type TransactionImportRow = {
  createdAt: Date
  amount: number
  categoryName: string
  parentCategoryName?: string
  currency: string
  type: 'expense' | 'income'
}

type CreateManyTransactionsArgs = {
  rows: TransactionImportRow[]
  userId: string
}

type CategoryInfo = {
  id: string
  name: string
  type: 'expense' | 'income'
  parentId: string | null
  parentName?: string
  isArchived: boolean
  archivedAt: Date | null
}

/**
 * Maximum transaction amount (matches NUMERIC(14,2) database constraint)
 */
const MAX_AMOUNT = 999_999_999_999.99

/**
 * Minimum allowed transaction date (reasonable lower bound)
 */
const MIN_DATE = new Date('1970-01-01')

export async function createManyTransactions({
  rows,
  userId
}: CreateManyTransactionsArgs) {
  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // 1. Validate rows array is not empty
      if (rows.length === 0) {
        throw new Error('No transactions to import.')
      }

      // 2. Load all valid currency codes from database
      const allCurrencies = await tx
        .select({ code: currencies.code })
        .from(currencies)
      const validCurrencyCodes = new Set(allCurrencies.map(c => c.code))

      // 3. Load all existing categories for user (including archived)
      // Note: Imported transactions are not tied to accounts (accountId = null)
      const allCategories = await tx
        .select({
          id: categories.id,
          name: categories.name,
          type: categories.type,
          parentId: categories.parentId,
          isArchived: categories.isArchived,
          archivedAt: categories.archivedAt
        })
        .from(categories)
        .where(eq(categories.userId, userId))

      // Build lookup maps
      // Key: "parentName|categoryName|type" or "categoryName|type" for root
      const categoryMap = new Map<string, CategoryInfo>()
      const rootCategoryByNameAndType = new Map<string, CategoryInfo>()

      // First pass: build id -> category map for parent lookups
      const idToCategoryInfo = new Map<string, CategoryInfo>()
      for (const cat of allCategories) {
        idToCategoryInfo.set(cat.id, {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          parentId: cat.parentId,
          isArchived: cat.isArchived,
          archivedAt: cat.archivedAt
        })
      }

      // Second pass: build lookup map with parent names
      for (const cat of allCategories) {
        const parentInfo = cat.parentId
          ? idToCategoryInfo.get(cat.parentId)
          : undefined
        const parentName = parentInfo?.name

        const key = parentName
          ? `${parentName.toLowerCase()}|${cat.name.toLowerCase()}|${cat.type}`
          : `${cat.name.toLowerCase()}|${cat.type}`

        const categoryInfo: CategoryInfo = {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          parentId: cat.parentId,
          parentName,
          isArchived: cat.isArchived,
          archivedAt: cat.archivedAt
        }

        categoryMap.set(key, categoryInfo)

        // Track root categories for parent lookup
        if (!cat.parentId) {
          rootCategoryByNameAndType.set(
            `${cat.name.toLowerCase()}|${cat.type}`,
            categoryInfo
          )
        }
      }

      /**
       * Resolves and validates category for a transaction row.
       * Throws descriptive errors for any validation failures.
       *
       * Validates:
       * 1. Category exists (required)
       * 2. Parent category exists (if specified)
       * 3. Transaction type matches category type
       * 4. Parent archived date constraint
       * 5. Category archived date constraint
       */
      const resolveCategoryId = (
        name: string,
        type: 'expense' | 'income',
        parentName: string | undefined,
        txDate: Date,
        rowIndex: number
      ): string => {
        const txDateStart = startOfDay(txDate)
        const categoryPath = parentName ? `${parentName} → ${name}` : name

        // Validate parent category if specified
        if (parentName) {
          const parentKey = `${parentName.toLowerCase()}|${type}`
          const parent = rootCategoryByNameAndType.get(parentKey)

          if (!parent) {
            // Check if parent exists with wrong type
            const wrongType = type === 'expense' ? 'income' : 'expense'
            const wrongTypeParent = rootCategoryByNameAndType.get(
              `${parentName.toLowerCase()}|${wrongType}`
            )

            if (wrongTypeParent) {
              throw new Error(
                `Row ${rowIndex + 1}: Parent category "${parentName}" exists but is "${wrongType}", not "${type}".`
              )
            }

            // Check if the "parent" is actually a subcategory (has a parent itself)
            const isSubcategory = Array.from(idToCategoryInfo.values()).find(
              c =>
                c.name.toLowerCase() === parentName.toLowerCase() &&
                c.type === type &&
                c.parentId !== null
            )

            if (isSubcategory) {
              throw new Error(
                `Row ${rowIndex + 1}: "${parentName}" is a subcategory and cannot be used as a parent category.`
              )
            }

            throw new Error(
              `Row ${rowIndex + 1}: Parent category "${parentName}" (${type}) does not exist.`
            )
          }

          // Check parent archived constraint
          if (parent.isArchived && parent.archivedAt) {
            const parentArchivedDate = startOfDay(parent.archivedAt)
            if (txDateStart > parentArchivedDate) {
              throw new Error(
                `Row ${rowIndex + 1}: Parent category "${parentName}" was archived. Transaction date must be on or before the archive date.`
              )
            }
          }
        }

        // Validate category exists
        const key = parentName
          ? `${parentName.toLowerCase()}|${name.toLowerCase()}|${type}`
          : `${name.toLowerCase()}|${type}`

        const category = categoryMap.get(key)

        if (!category) {
          // Check if category exists with wrong type
          const wrongType = type === 'expense' ? 'income' : 'expense'
          const wrongTypeKey = parentName
            ? `${parentName.toLowerCase()}|${name.toLowerCase()}|${wrongType}`
            : `${name.toLowerCase()}|${wrongType}`
          const wrongTypeCategory = categoryMap.get(wrongTypeKey)

          if (wrongTypeCategory) {
            throw new Error(
              `Row ${rowIndex + 1}: Category "${categoryPath}" exists but is "${wrongType}", not "${type}".`
            )
          }
          throw new Error(
            `Row ${rowIndex + 1}: Category "${categoryPath}" (${type}) does not exist.`
          )
        }

        // Check category archived constraint
        if (category.isArchived && category.archivedAt) {
          const archivedDateStart = startOfDay(category.archivedAt)
          if (txDateStart > archivedDateStart) {
            throw new Error(
              `Row ${rowIndex + 1}: Category "${categoryPath}" was archived. Transaction date must be on or before the archive date.`
            )
          }
        }

        return category.id
      }

      // 4. Pre-validate all rows before any inserts
      const validatedRows: {
        row: TransactionImportRow
        categoryId: string
      }[] = []

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        // Validate currency exists in database
        if (!validCurrencyCodes.has(row.currency)) {
          throw new Error(
            `Row ${i + 1}: Currency "${row.currency}" is not available.`
          )
        }

        // Validate amount
        if (row.amount <= 0) {
          throw new Error(`Row ${i + 1}: Amount must be greater than 0.`)
        }
        if (row.amount > MAX_AMOUNT) {
          throw new Error(`Row ${i + 1}: Amount exceeds maximum allowed value.`)
        }

        // Validate date is not in future and not too far in the past
        if (row.createdAt < MIN_DATE) {
          throw new Error(
            `Row ${i + 1}: Transaction date is too far in the past.`
          )
        }
        if (startOfDay(row.createdAt) > startOfDay(new Date())) {
          throw new Error(
            `Row ${i + 1}: Transaction date cannot be in the future.`
          )
        }

        // Validate and resolve category
        const categoryId = resolveCategoryId(
          row.categoryName,
          row.type,
          row.parentCategoryName,
          row.createdAt,
          i
        )

        validatedRows.push({ row, categoryId })
      }

      // 5. Insert all validated transactions (no account - imported transactions are account-agnostic)
      for (const { row, categoryId } of validatedRows) {
        await tx.insert(transactions).values({
          id: randomUUID(),
          userId,
          accountId: null,
          type: row.type,
          amount: row.amount,
          currencyId: row.currency,
          categoryId,
          txDate: row.createdAt,
          createdAt: new Date()
        })
      }

      return { inserted: validatedRows.length }
    })
  )

  return [error, result] as const
}
