import { useDrizzleQuery } from '@/lib/hooks'
import { getCategory } from './get-category'

export function useGetCategory({
  userId,
  categoryId
}: {
  userId: string
  categoryId: string
}) {
  const query = getCategory({ userId, categoryId })

  const result = useDrizzleQuery(query)

  return result
}
