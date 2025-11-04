import {
  useCheckCategoryDependencies,
  useGetCategories,
  useGetCategory,
  useSumTransactions
} from '@/data/client/queries'
import {
  useCategoryDetailsActions,
  useCategoryDetailsState
} from '@/lib/storage/category-details-store'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CategoryDetailsHeader } from './components/category-details-header'
import { CategoryInfoCard } from './components/category-info-card'
import { DetailsInfoSection } from './components/details-info-section'
import { SubcategoriesSection } from './components/subcategories-section'

export default function CategoryDetailsModal() {
  const { categoryDetailsSelectedCategory } = useCategoryDetailsState()
  const { closeCategoryDetailsModal } = useCategoryDetailsActions()

  const { userId } = useUserSession()

  const { data: category } = useGetCategory({
    userId: userId,
    categoryId: categoryDetailsSelectedCategory ?? ''
  })

  const { data: totals } = useSumTransactions({
    userId,
    categoryId: categoryDetailsSelectedCategory ?? '',
    type: category?.[0]?.type || 'expense'
  })

  const {
    canDelete,
    hasTransactions,
    hasSubcategories,
    transactionCount,
    subcategoryCount,
    isLoading: isDependencyCheckLoading
  } = useCheckCategoryDependencies({
    userId,
    categoryId: categoryDetailsSelectedCategory ?? ''
  })

  // Get subcategories for this category using the unified hook
  const { data: subcategories } = useGetCategories({
    userId,
    type: category?.[0]?.type || 'expense',
    parentId: categoryDetailsSelectedCategory ?? ''
  })

  const categoryData = category?.[0]
  const totalsByCurrency = (totals ?? [])
    .map(row => ({
      currencyId: row.currencyId as string,
      totalAmount: Number(row.totalAmount || 0)
    }))
    .filter(row => row.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)

  if (!categoryData) {
    return null
  }

  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="flex-1 bg-popover p-4"
    >
      <CategoryDetailsHeader
        categoryData={categoryData}
        userId={userId}
        canDelete={canDelete}
        hasTransactions={hasTransactions}
        hasSubcategories={hasSubcategories}
        transactionCount={transactionCount}
        subcategoryCount={subcategoryCount}
        isDependencyCheckLoading={isDependencyCheckLoading}
        onClose={closeCategoryDetailsModal}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <CategoryInfoCard
          categoryData={categoryData}
          totalsByCurrency={totalsByCurrency}
        />

        <SubcategoriesSection
          subcategories={subcategories}
          categoryType={categoryData.type}
        />

        <DetailsInfoSection
          categoryData={categoryData}
          totalsByCurrency={totalsByCurrency}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
