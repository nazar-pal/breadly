import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { SubcategoriesList } from './subcategories-list'

export function SubcategoriesListData({
  selectedCategoryId,
  setSelectedCategoryId
}: {
  selectedCategoryId: string
  setSelectedCategoryId: (categoryId: string) => void
}) {
  const { userId } = useUserSession()

  const { data: categoriesData } = useDrizzleQuery(db =>
    db.query.categories.findFirst({
      columns: { id: true, parentId: true },
      where: (categories, { and, eq }) =>
        and(
          eq(categories.id, selectedCategoryId),
          eq(categories.userId, userId)
        )
    })
  )

  const selectedCategory = categoriesData.length > 0 ? categoriesData[0] : null

  if (!selectedCategory) return null

  const categoryId = selectedCategory.id
  const parentCategoryId = selectedCategory.parentId ?? categoryId

  return (
    <SubcategoriesList
      categoryId={categoryId}
      parentCategoryId={parentCategoryId}
      setSelectedCategoryId={setSelectedCategoryId}
    />
  )
}
