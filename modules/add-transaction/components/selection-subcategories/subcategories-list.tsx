import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { SubcategoriesItem } from './subcategories-item'

export function SubcategoriesList({
  categoryId,
  parentCategoryId,
  setSelectedCategoryId
}: {
  categoryId: string
  parentCategoryId: string
  setSelectedCategoryId: (categoryId: string) => void
}) {
  const { userId } = useUserSession()

  const { data: subcategories } = useDrizzleQuery(db =>
    db.query.categories.findMany({
      where: (categories, { and, eq }) =>
        and(
          eq(categories.parentId, parentCategoryId),
          eq(categories.userId, userId)
        ),
      columns: { id: true, name: true }
    })
  )

  const handleSubcategorySelect = (subcategoryId: string) => {
    const nextSelected =
      categoryId === subcategoryId ? parentCategoryId : subcategoryId
    setSelectedCategoryId(nextSelected)
  }

  return subcategories.map(subcategory => (
    <SubcategoriesItem
      key={subcategory.id}
      label={subcategory.name}
      isSelected={categoryId === subcategory.id}
      onPress={() => handleSubcategorySelect(subcategory.id)}
    />
  ))
}
