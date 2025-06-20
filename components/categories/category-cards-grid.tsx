import React, { use } from 'react'
import { ScrollView } from 'react-native'
import { ButtonAddCategory } from './button-add-category'
import { CategoriesContext } from './categories-context'
import { CategoryCard } from './category-card'
import { useGetCategoriesWithAmounts } from './lib/use-get-categories-with-amounts'

export function CategoryCardsGrid() {
  const categories = useGetCategoriesWithAmounts()

  const {
    categoryUI: {
      handleCategoryPress,
      handleCategoryLongPress,
      handleAddCategory
    }
  } = use(CategoriesContext)

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
      }}
    >
      {categories.map(category => {
        return (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={handleCategoryPress}
            onLongPress={() => handleCategoryLongPress(category)}
            className="w-[47%] rounded-2xl border border-border bg-card p-3"
          />
        )
      })}

      <ButtonAddCategory
        onPress={handleAddCategory}
        className="w-[47%] rounded-2xl border border-dashed border-border bg-muted p-3"
      />
    </ScrollView>
  )
}
