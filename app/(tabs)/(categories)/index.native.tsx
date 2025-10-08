import { useGetUserPreferences } from '@/data/client/queries'
import { useCategoryDetailsActions } from '@/lib/storage/category-details-store'
import { CategoryCardsGrid } from '@/screens/tabs-categories/category-cards-grid'
import { useUserSession } from '@/system/session-and-migration/hooks'
import { router } from 'expo-router'

export default function CategoriesExpenseScreen() {
  const { userId } = useUserSession()
  const { openCategoryDetailsModal } = useCategoryDetailsActions()
  const { data: userPreferences } = useGetUserPreferences({ userId })

  const defaultCurrencyCode =
    userPreferences?.[0]?.defaultCurrency?.code || 'USD'

  return (
    <CategoryCardsGrid
      onPress={categoryId => {
        const params = new URLSearchParams({
          categoryId,
          type: 'expense',
          currencyCode: defaultCurrencyCode
        })
        router.push(`/transaction-modal?${params}`)
      }}
      onLongPress={openCategoryDetailsModal}
    />
  )
}
