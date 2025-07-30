import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { categories, CATEGORY_TYPE } from '../../schema/table_4_categories'
import { db } from '../../system'

export function useGetCategoriesForEdit({
  userId,
  type,
  parentId,
  isArchived
}: {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  parentId?: string | null
  isArchived?: boolean
}) {
  // Build the where conditions based on parentId parameter
  const parentCondition =
    parentId === undefined
      ? undefined // No parent filter - get all categories
      : parentId === null
        ? isNull(categories.parentId) // Get only parent categories
        : eq(categories.parentId, parentId) // Get subcategories of specific parent

  const query = db.query.categories.findMany({
    // root categories only
    where: and(
      eq(categories.userId, userId),
      eq(categories.type, type),
      parentCondition,
      isArchived === undefined
        ? undefined
        : eq(categories.isArchived, isArchived)
    ),
    with: {
      // bring in sub-categories in the same query
      subcategories: {
        orderBy: [asc(categories.sortOrder), asc(categories.name)]
      }
    },
    orderBy: [asc(categories.sortOrder), asc(categories.name)]
  })

  return useQuery(toCompilableQuery(query))
}
