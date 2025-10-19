import { useGetUserPreferences } from '@/data/client/queries'
import { useCategoryDetailsActions } from '@/lib/storage/category-details-store'
import { openExpenseIncomeBottomSheet } from '@/modules/add-transaction'
import { CategoryCardsGrid } from '@/screens/tabs-categories'
import { useUserSession } from '@/system/session-and-migration/hooks'

export default function CategoriesIncomeScreen() {
  const { userId } = useUserSession()
  const { openCategoryDetailsModal } = useCategoryDetailsActions()

  const { data: preferences } = useGetUserPreferences({ userId })
  const currencyCode = preferences?.[0]?.defaultCurrency?.code || 'USD'

  const openTransactionModal = (categoryId: string) =>
    openExpenseIncomeBottomSheet({ type: 'income', categoryId, currencyCode })

  return (
    <CategoryCardsGrid
      onPress={openTransactionModal}
      onLongPress={openCategoryDetailsModal}
    />
  )
}
