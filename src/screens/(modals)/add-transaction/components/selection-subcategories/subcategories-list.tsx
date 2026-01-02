import { getCategories } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system-v2/session'
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

  const { data: subcategories } = useDrizzleQuery(
    getCategories({
      userId,
      parentId: parentCategoryId,
      isArchived: false
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
