import { SafeAreaView } from '@/components/ui/safe-area-view'
import {
  getCategoriesWithTransactions,
  getCategory,
  sumTransactions
} from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'
import { CategoryDetailsHeader } from './components/category-details-header'
import { CategoryInfoCard } from './components/category-info-card'
import { DetailsInfoSection } from './components/details-info-section'
import { SubcategoriesSection } from './components/subcategories-section'
import { useCheckCategoryDependencies } from './data'

interface Props {
  categoryId: string
}

export default function CategoryDetailsModal({ categoryId }: Props) {
  const { userId } = useUserSession()

  const {
    data: [categoryData]
  } = useDrizzleQuery(getCategory({ userId, categoryId }))

  const type = categoryData?.type || 'expense'

  const { data: totals } = useDrizzleQuery(
    sumTransactions({ userId, categoryId, type })
  )

  const {
    canDelete,
    hasTransactions,
    hasSubcategories,
    transactionCount,
    subcategoryCount,
    isLoading: isDependencyCheckLoading
  } = useCheckCategoryDependencies({ userId, categoryId })

  // Get subcategories for this category using the unified hook
  const { data: subcategories } = useDrizzleQuery(
    getCategoriesWithTransactions({ userId, type, parentId: categoryId })
  )

  const totalsByCurrency = (totals ?? [])
    .map(row => ({
      currencyId: row.currencyId as string,
      totalAmount: Number(row.totalAmount || 0)
    }))
    .filter(row => row.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)

  if (!categoryData) return null

  return (
    <SafeAreaView
      edges={{ bottom: 'maximum', left: 'off', right: 'off', top: 'off' }}
      className="bg-popover flex-1 p-4"
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
        onClose={() => router.back()}
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
