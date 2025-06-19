import { CategoriesHeader } from '@/components/categories/categories-header'
import { CategoryCardsGrid } from '@/components/categories/category-cards-grid'
import { CalculatorModal } from '@/components/categories/modal-add-transaction'
import { AddCategoryModal } from '@/components/categories/modal-category-add'
import { CategoryEditModal } from '@/components/categories/modal-category-edit'
import { useGetCategories } from '@/powersync/data/queries'
import React, { use } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CategoriesContext } from './categories-context'

export function CategoriesContent() {
  const insets = useSafeAreaInsets()
  const { categoryUI, userId } = use(CategoriesContext)

  const { data: categories, isLoading } = useGetCategories({
    userId,
    type: categoryUI.currentType
  })

  const categoriesWithAmounts = categories.map(category => ({
    ...category,
    amount: category.transactions.reduce((acc, tx) => acc + tx.amount, 0)
  }))

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top
      }}
      collapsable={false}
    >
      <CategoriesHeader />

      <CategoryCardsGrid
        categories={categoriesWithAmounts}
        isLoading={isLoading}
      />

      <CalculatorModal />

      <CategoryEditModal />

      <AddCategoryModal />
    </View>
  )
}
