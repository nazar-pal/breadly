import React from 'react'
import { ScrollView } from 'react-native'
import { useGetCategoriesWithAmounts } from '../lib/use-get-categories-with-amounts'
import { ButtonAddCategory } from './button-add-category'
import { CategoryCard } from './category-card'

interface Props {
  categoryType: 'income' | 'expense'
  isEditMode: boolean
  onPress: (categoryId: string) => void
  onLongPress: (categoryId: string) => void
}

export function CategoryCardsGrid({ isEditMode, onPress, onLongPress }: Props) {
  const categories = useGetCategoriesWithAmounts()

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
            isEditMode={isEditMode}
            onPress={() => onPress(category.id)}
            onLongPress={() => onLongPress(category.id)}
            className="w-[47%] rounded-2xl border border-border bg-card p-3"
          />
        )
      })}

      <ButtonAddCategory className="w-[47%] rounded-2xl border border-dashed border-border bg-muted/50 p-3" />
    </ScrollView>
  )
}
