import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { categories, CATEGORY_TYPE } from '../../schema/table_4_categories'
import { db } from '../../system'

export function useGetCategoriesForEdit({
  userId,
  type,
  isArchived
}: {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  isArchived?: boolean
}) {
  const query = db.query.categories.findMany({
    // root categories only
    where: and(
      eq(categories.userId, userId),
      eq(categories.type, type),
      isNull(categories.parentId),
      isArchived === undefined
        ? undefined
        : eq(categories.isArchived, isArchived)
    ),
    with: {
      // bring in sub-categories in the same query
      subcategories: true
    },
    orderBy: [asc(categories.createdAt)]
  })

  return useQuery(toCompilableQuery(query))
}
