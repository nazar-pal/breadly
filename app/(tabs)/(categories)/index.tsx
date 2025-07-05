import { CategoryCardsGrid } from '@/components/categories/category-cards-grid/category-cards-grid'
import { useCategoriesActions } from '@/lib/storage/categories-store'

export default function CategoriesExpenseScreen() {
  const { openAddTransactionModal } = useCategoriesActions()

  return (
    <CategoryCardsGrid
      categoryType="expense"
      isEditMode={false}
      onPress={openAddTransactionModal}
      onLongPress={() => {
        console.log('long press')
      }}
    />
  )
}
