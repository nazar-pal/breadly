import { categories } from '@/powersync/schema/table_4_categories'
import { InferSelectModel } from 'drizzle-orm'
import React, { use } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { ButtonAddCategory } from './button-add-category'
import { CategoriesContext } from './categories-context'
import { CategoryCard } from './category-card'

interface CategoryWithAmount extends InferSelectModel<typeof categories> {
  amount: number
}

interface Props {
  categories: CategoryWithAmount[]
  isLoading: boolean
}

export function CategoryCardsGrid({ categories, isLoading }: Props) {
  const { categoryUI } = use(CategoriesContext)
  const { activeTab, handleCategoryPress, handleCategoryLongPress } = categoryUI

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-foreground">Loading categories...</Text>
      </View>
    )
  }

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
            id={category.id}
            name={category.name}
            amount={category.amount}
            type={category.type}
            onPress={handleCategoryPress}
            onLongPress={handleCategoryLongPress}
          />
        )
      })}

      <ButtonAddCategory
        onPress={categoryUI.handleAddCategory}
        label={activeTab === 'expenses' ? 'Add' : 'Add Category'}
      />
    </ScrollView>
  )
}
