import { categories, currencies } from '@/data/client/db-schema'
import type {
  PostValidateFn,
  PostValidationResult,
  RowValidationError
} from '@/lib/hooks/use-csv-import'
import { db } from '@/system/powersync/system'
import { startOfDay } from 'date-fns'
import { eq } from 'drizzle-orm'
import type { CsvArr } from './csv-arr-schema'

export type TransactionValidationErrorType =
  | 'currency_not_found'
  | 'category_not_found'
  | 'parent_category_not_found'
  | 'parent_is_subcategory'
  | 'archived_date_violation'
  | 'parent_archived_date_violation'
  | 'type_mismatch'

export type TransactionRowValidationError =
  RowValidationError<TransactionValidationErrorType>

export type TransactionValidationResult =
  PostValidationResult<TransactionValidationErrorType>

type CategoryLookup = {
  id: string
  name: string
  type: 'expense' | 'income'
  parentId: string | null
  parentName?: string
  isArchived: boolean
  archivedAt: Date | null
}

/**
 * Creates a post-validation function for transaction import.
 * Validates import rows against existing database records.
 *
 * Validation Rules:
 * 1. Currency must exist in the database
 * 2. Category must exist (no new category creation during import)
 * 3. If parent category is specified, it must exist
 * 4. Transaction type must match category type (expense → expense, income → income)
 * 5. If category is archived, transaction date must be on or before archivedAt date
 * 6. If parent category is archived, same date constraint applies
 *
 * Note: Imported transactions are not tied to accounts (accountId = null)
 */
export function createTransactionPostValidator(
  userId: string
): PostValidateFn<CsvArr, TransactionValidationErrorType> {
  return async (rows: CsvArr): Promise<TransactionValidationResult> => {
    const errors: TransactionRowValidationError[] = []

    // Fetch all valid currency codes from database
    const allCurrencies = await db
      .select({ code: currencies.code })
      .from(currencies)
    const validCurrencyCodes = new Set(allCurrencies.map(c => c.code))

    // Fetch all categories for user (including archived)
    const allCategories = await db.query.categories.findMany({
      where: eq(categories.userId, userId),
      with: {
        parent: true
      }
    })

    // Build lookup maps for fast access
    // Key format: "parentName|categoryName|type" or "categoryName|type" for root categories
    const categoryMap = new Map<string, CategoryLookup>()
    // Also build a map for root categories (no parent) by name only (for parent lookup)
    const rootCategoryByNameAndType = new Map<string, CategoryLookup>()

    for (const cat of allCategories) {
      const parentName = cat.parent?.name
      const key = parentName
        ? `${parentName.toLowerCase()}|${cat.name.toLowerCase()}|${cat.type}`
        : `${cat.name.toLowerCase()}|${cat.type}`

      const lookup: CategoryLookup = {
        id: cat.id,
        name: cat.name,
        type: cat.type,
        parentId: cat.parentId,
        parentName: parentName ?? undefined,
        isArchived: cat.isArchived,
        archivedAt: cat.archivedAt
      }

      categoryMap.set(key, lookup)

      // Track root categories for parent lookup
      if (!cat.parentId) {
        rootCategoryByNameAndType.set(
          `${cat.name.toLowerCase()}|${cat.type}`,
          lookup
        )
      }
    }

    // Validate each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const txDate = startOfDay(row.createdAt)
      const categoryPath = row.parentCategoryName
        ? `${row.parentCategoryName} → ${row.categoryName}`
        : row.categoryName

      // --- Check 1: Currency must exist in database ---
      if (!validCurrencyCodes.has(row.currency)) {
        errors.push({
          rowIndex: i,
          type: 'currency_not_found',
          message: `Currency "${row.currency}" is not available`
        })
        continue
      }

      // --- Check 2: If parent is specified, validate it exists ---
      let parentCategory: CategoryLookup | undefined
      if (row.parentCategoryName) {
        const parentKey = `${row.parentCategoryName.toLowerCase()}|${row.type}`
        parentCategory = rootCategoryByNameAndType.get(parentKey)

        if (!parentCategory) {
          // Check if parent exists but with wrong type
          const wrongTypeParent = rootCategoryByNameAndType.get(
            `${row.parentCategoryName.toLowerCase()}|${row.type === 'expense' ? 'income' : 'expense'}`
          )

          if (wrongTypeParent) {
            errors.push({
              rowIndex: i,
              type: 'type_mismatch',
              message: `Parent category "${row.parentCategoryName}" exists but is "${wrongTypeParent.type}", not "${row.type}"`
            })
          } else {
            // Check if the "parent" is actually a subcategory (has a parent itself)
            const isSubcategory = allCategories.find(
              c =>
                c.name.toLowerCase() ===
                  row.parentCategoryName!.toLowerCase() &&
                c.type === row.type &&
                c.parentId !== null
            )

            if (isSubcategory) {
              errors.push({
                rowIndex: i,
                type: 'parent_is_subcategory',
                message: `"${row.parentCategoryName}" is a subcategory and cannot be used as a parent category`
              })
            } else {
              errors.push({
                rowIndex: i,
                type: 'parent_category_not_found',
                message: `Parent category "${row.parentCategoryName}" (${row.type}) does not exist`
              })
            }
          }
          continue
        }

        // Check 3: Parent archived date constraint
        if (parentCategory.isArchived && parentCategory.archivedAt) {
          const parentArchivedDate = startOfDay(parentCategory.archivedAt)

          if (txDate > parentArchivedDate) {
            errors.push({
              rowIndex: i,
              type: 'parent_archived_date_violation',
              message: `Parent category "${row.parentCategoryName}" was archived. Transaction date must be on or before the archive date.`
            })
            continue
          }
        }
      }

      // --- Check 4: Category must exist ---
      const key = row.parentCategoryName
        ? `${row.parentCategoryName.toLowerCase()}|${row.categoryName.toLowerCase()}|${row.type}`
        : `${row.categoryName.toLowerCase()}|${row.type}`

      const category = categoryMap.get(key)

      if (!category) {
        // Check if category exists but with wrong type
        const wrongTypeKey = row.parentCategoryName
          ? `${row.parentCategoryName.toLowerCase()}|${row.categoryName.toLowerCase()}|${row.type === 'expense' ? 'income' : 'expense'}`
          : `${row.categoryName.toLowerCase()}|${row.type === 'expense' ? 'income' : 'expense'}`

        const wrongTypeCategory = categoryMap.get(wrongTypeKey)

        if (wrongTypeCategory) {
          errors.push({
            rowIndex: i,
            type: 'type_mismatch',
            message: `Category "${categoryPath}" exists but is "${wrongTypeCategory.type}", not "${row.type}"`
          })
        } else {
          errors.push({
            rowIndex: i,
            type: 'category_not_found',
            message: `Category "${categoryPath}" (${row.type}) does not exist`
          })
        }
        continue
      }

      // --- Check 5: Category archived date constraint ---
      if (category.isArchived && category.archivedAt) {
        const archivedDate = startOfDay(category.archivedAt)

        if (txDate > archivedDate) {
          errors.push({
            rowIndex: i,
            type: 'archived_date_violation',
            message: `Category "${categoryPath}" was archived. Transaction date must be on or before the archive date.`
          })
        }
      }
    }

    return {
      errors,
      isValid: errors.length === 0
    }
  }
}

/**
 * Get error for a specific row index
 */
export function getRowError<T extends string = string>(
  errors: RowValidationError<T>[],
  rowIndex: number
): RowValidationError<T> | undefined {
  return errors.find(e => e.rowIndex === rowIndex)
}
