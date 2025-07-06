import { CategoryCardsGrid } from '@/components/categories/category-cards-grid/category-cards-grid'
import { useAddTransactionActions } from '@/lib/storage/add-transaction-store'

export default function CategoriesExpenseScreen() {
  const { openAddTransactionModal } = useAddTransactionActions()

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
