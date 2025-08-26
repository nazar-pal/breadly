import { useAddTransactionActions } from '@/lib/storage/add-transaction-store'
import { useCategoryDetailsActions } from '@/lib/storage/category-details-store'
import { CategoryCardsGrid } from '@/screens/tabs-categories'

export default function CategoriesIncomeScreen() {
  const { openAddTransactionModal } = useAddTransactionActions()
  const { openCategoryDetailsModal } = useCategoryDetailsActions()

  return (
    <CategoryCardsGrid
      onPress={openAddTransactionModal}
      onLongPress={openCategoryDetailsModal}
    />
  )
}
