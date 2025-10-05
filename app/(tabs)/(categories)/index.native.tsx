import { useCategoryDetailsActions } from '@/lib/storage/category-details-store'
import { CategoryCardsGrid } from '@/screens/tabs-categories/category-cards-grid'
import { router } from 'expo-router'

export default function CategoriesExpenseScreen() {
  const { openCategoryDetailsModal } = useCategoryDetailsActions()

  return (
    <CategoryCardsGrid
      onPress={categoryId =>
        router.push(`/transaction-modal?categoryId=${categoryId}`)
      }
      onLongPress={openCategoryDetailsModal}
    />
  )
}
