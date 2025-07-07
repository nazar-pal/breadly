import { CategoryCardsGrid } from '@/components/categories/category-cards-grid/category-cards-grid'
import { useAddTransactionActions } from '@/lib/storage/add-transaction-store'
import { useCategoryDetailsActions } from '@/lib/storage/category-details-store'

export default function CategoriesExpenseScreen() {
  const { openAddTransactionModal } = useAddTransactionActions()
  const { openCategoryDetailsModal } = useCategoryDetailsActions()

  return (
    <CategoryCardsGrid
      categoryType="expense"
      isEditMode={false}
      onPress={openAddTransactionModal}
      onLongPress={openCategoryDetailsModal}
    />
  )
}
