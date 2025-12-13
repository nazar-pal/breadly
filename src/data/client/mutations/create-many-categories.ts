import { categories, categoryInsertSchema } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'

type CategoryInsert = Omit<z.input<typeof categoryInsertSchema>, 'userId'>

type CreateManyCategoriesArgs = {
  rows: CategoryInsert[]
  userId: string
}

/**
 * Inserts parsed categories using an atomic batch transaction.
 * Parents are inserted first to ensure children can reference them.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints (name non-empty) for each row
 * 2. Transaction validates parent relationships and uniqueness:
 *    - Parent existence, type matching, nesting depth
 *    - Category name uniqueness within user+parent scope (server unique constraint)
 *    - No duplicate names within the batch itself
 *
 * @returns Tuple of [error, { inserted }] - count of inserted categories on success
 */
export async function createManyCategories({
  rows,
  userId
}: CreateManyCategoriesArgs) {
  if (rows.length === 0) return [new Error('No categories to create'), null]

  // Validate all rows upfront with Zod (handles name non-empty validation)
  // Use safeParse to provide row-specific error messages (consistent with createManyTransactions)
  const parsedRows: z.infer<typeof categoryInsertSchema>[] = []
  for (let i = 0; i < rows.length; i++) {
    const parseResult = categoryInsertSchema.safeParse({ userId, ...rows[i] })
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]
      return [new Error(`Row ${i + 1}: ${firstIssue.message}`), null]
    }
    // Ensure ID is present (Zod doesn't apply Drizzle's $defaultFn)
    const row = parseResult.data
    if (!row.id) row.id = randomUUID()
    parsedRows.push(row)
  }

  // Check for duplicate names within the batch itself (same name + same parentId)
  // Note: Uses exact case matching to match server's unique index behavior
  const batchNameKeys = new Set<string>()
  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i]
    // Use parentId || 'ROOT' to handle null parents consistently
    const nameKey = `${row.parentId ?? 'ROOT'}::${row.name}`
    if (batchNameKeys.has(nameKey)) {
      return [
        new Error(
          `Row ${i + 1}: Duplicate category name "${row.name}" at the same level within this batch`
        ),
        null
      ]
    }
    batchNameKeys.add(nameKey)
  }

  const CHUNK_SIZE = 50

  const parentRows = parsedRows.filter(row => !row.parentId)
  const childRows = parsedRows.filter(row => !!row.parentId)

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Collect all external parent IDs (parents not in this batch)
      // All IDs are guaranteed present after ID generation above
      const batchIds = new Set(parsedRows.map(r => r.id))
      const externalParentIds = childRows
        .map(r => r.parentId)
        .filter((id): id is string => !!id && !batchIds.has(id))

      // Build lookup for ALL categories in batch (for type and nesting validation)
      // This includes both parent rows and child rows to detect grandchild attempts
      const batchCategoryMap = new Map(
        parsedRows.map(p => [p.id, { type: p.type, parentId: p.parentId }])
      )

      // Validate external parent categories exist and belong to user
      let externalParentMap = new Map<
        string,
        { type: string; parentId: string | null }
      >()
      if (externalParentIds.length > 0) {
        const existingParents = await tx.query.categories.findMany({
          where: and(
            eq(categories.userId, userId),
            inArray(categories.id, externalParentIds)
          ),
          columns: { id: true, type: true, parentId: true }
        })
        externalParentMap = new Map(
          existingParents.map(p => [
            p.id,
            { type: p.type, parentId: p.parentId }
          ])
        )

        for (const parentId of externalParentIds) {
          if (!externalParentMap.has(parentId)) {
            throw new Error(`Parent category "${parentId}" not found`)
          }
        }
      }

      // Validate child categories' parent relationships
      for (const child of childRows) {
        const parentInfo =
          batchCategoryMap.get(child.parentId!) ??
          externalParentMap.get(child.parentId!)

        // parentInfo should always exist at this point (validated above or in batch)
        // If a child references another child in the batch, we catch it here
        if (!parentInfo)
          throw new Error(`Parent category "${child.parentId}" not found`)

        // Validate type matches parent
        if (parentInfo.type !== child.type)
          throw new Error(
            `Category "${child.name}" type (${child.type}) must match parent type (${parentInfo.type})`
          )

        // Prevent creating grandchildren (only allow 2 levels of nesting)
        if (parentInfo.parentId != null)
          throw new Error(
            `Category "${child.name}" cannot be nested under a subcategory`
          )
      }

      // Validate unique names against existing categories in database
      // Build conditions for each unique parentId+name combination
      const uniqueParentIds = [
        ...new Set(parsedRows.map(r => r.parentId ?? null))
      ]

      for (const parentId of uniqueParentIds) {
        const rowsWithThisParent = parsedRows.filter(
          r => (r.parentId ?? null) === parentId
        )
        const namesAtThisLevel = rowsWithThisParent.map(r => r.name)

        const existingDuplicate = await tx.query.categories.findFirst({
          where: and(
            eq(categories.userId, userId),
            parentId
              ? eq(categories.parentId, parentId)
              : isNull(categories.parentId),
            inArray(categories.name, namesAtThisLevel)
          ),
          columns: { name: true }
        })

        if (existingDuplicate) {
          throw new Error(
            `Category name "${existingDuplicate.name}" already exists at this level`
          )
        }
      }

      const insertBatch = async (
        batch: z.infer<typeof categoryInsertSchema>[]
      ) => {
        if (batch.length === 0) return

        for (let i = 0; i < batch.length; i += CHUNK_SIZE) {
          const chunk = batch.slice(i, i + CHUNK_SIZE)
          await tx.insert(categories).values(chunk)
        }
      }

      await insertBatch(parentRows)
      await insertBatch(childRows)

      return { inserted: parsedRows.length }
    })
  )

  return [error, result]
}
