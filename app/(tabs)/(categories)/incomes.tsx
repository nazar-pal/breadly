import { CategoryCardsGrid } from '@/components/categories/category-cards-grid/category-cards-grid'
import { useCategoriesActions } from '@/lib/storage/categories-store'

export default function CategoriesIncomeScreen() {
  const { handleCategoryPress } = useCategoriesActions()
  return (
    <CategoryCardsGrid
      categoryType="income"
      isEditMode={false}
      onPress={handleCategoryPress}
      onLongPress={() => {
        console.log('long press')
      }}
    />
  )
}
