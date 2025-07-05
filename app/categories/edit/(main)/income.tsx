import { CategoryCardsGrid } from '@/components/categories/category-cards-grid/category-cards-grid'
import { router } from 'expo-router'

export default function EditIncomeCategoriesScreen() {
  function handleCategoryPress(id: string) {
    router.push(`/categories/${id}/edit-existing`)
  }

  return (
    <CategoryCardsGrid
      categoryType="income"
      isEditMode={true}
      onPress={handleCategoryPress}
      onLongPress={() => {
        console.log('long press')
      }}
    />
  )
}
