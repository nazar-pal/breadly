import { CategoryCardsGrid } from '@/components/categories/category-cards-grid/category-cards-grid'
import { useAddTransactionActions } from '@/lib/storage/add-transaction-store'

export default function CategoriesIncomeScreen() {
  const { openAddTransactionModal } = useAddTransactionActions()
  return (
    <CategoryCardsGrid
      categoryType="income"
      isEditMode={false}
      onPress={openAddTransactionModal}
      onLongPress={() => {
        console.log('long press')
      }}
    />
  )
}
