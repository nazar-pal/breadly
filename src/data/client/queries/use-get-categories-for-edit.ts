import { useDrizzleQuery } from '@/lib/hooks'
import { CATEGORY_TYPE } from '../db-schema'
import { getCategoriesForEdit } from './get-categories-for-edit'

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
  const query = getCategoriesForEdit({ userId, type, parentId, isArchived })

  return useDrizzleQuery(query)
}
