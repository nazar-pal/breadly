import { categories, CATEGORY_TYPE } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, asc, eq, isNull } from 'drizzle-orm'

interface Params {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  parentId?: string | null
  isArchived?: boolean
}

export function getCategoriesForEdit({
  userId,
  type,
  parentId,
  isArchived
}: Params) {
  // parentId: undefined = all, null = root only, string = children of parent
  const parentCondition =
    parentId === undefined
      ? undefined
      : parentId === null
        ? isNull(categories.parentId)
        : eq(categories.parentId, parentId)

  return db.query.categories.findMany({
    where: and(
      eq(categories.userId, userId),
      eq(categories.type, type),
      ...(parentCondition ? [parentCondition] : []),
      ...(isArchived !== undefined
        ? [eq(categories.isArchived, isArchived)]
        : [])
    ),
    with: {
      subcategories: {
        orderBy: [asc(categories.sortOrder), asc(categories.name)]
      }
    },
    orderBy: [asc(categories.sortOrder), asc(categories.name)]
  })
}

export type GetCategoriesForEditResult = Awaited<
  ReturnType<typeof getCategoriesForEdit>
>
export type GetCategoriesForEditResultItem = GetCategoriesForEditResult[number]
