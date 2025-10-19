import { useGetUserPreferences } from '@/data/client/queries'
import { useCategoryDetailsActions } from '@/lib/storage/category-details-store'
import { openExpenseIncomeBottomSheet } from '@/modules/add-transaction'
import { CategoryCardsGrid } from '@/screens/tabs-categories/category-cards-grid'
import { useUserSession } from '@/system/session-and-migration/hooks'

export default function CategoriesExpenseScreen() {
  const { userId } = useUserSession()
  const { openCategoryDetailsModal } = useCategoryDetailsActions()

  const { data: preferences } = useGetUserPreferences({ userId })
  const currencyCode = preferences?.[0]?.defaultCurrency?.code || 'USD'

  const openTransactionModal = (categoryId: string) =>
    openExpenseIncomeBottomSheet({ type: 'expense', categoryId, currencyCode })

  return (
    <CategoryCardsGrid
      onPress={openTransactionModal}
      onLongPress={openCategoryDetailsModal}
    />
  )
}
