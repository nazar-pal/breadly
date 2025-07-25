import { CategoryCardsEdit } from '@/components/categories/category-cards-edit'
import { router } from 'expo-router'

export default function EditExpenseCategoriesScreen() {
  function handleCategoryPress(id: string) {
    router.push(`/categories/edit/${id}`)
  }

  return (
    <CategoryCardsEdit
      categoryType="expense"
      onPress={handleCategoryPress}
      onLongPress={() => {
        console.log('long press')
      }}
    />
  )
}
