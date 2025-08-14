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
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Modal } from '../modal'
import { CategoryDetailsHeader } from './category-details-header'
import { CategoryInfoCard } from './category-info-card'
import { DetailsInfoSection } from './details-info-section'
import { StatisticsCard } from './statistics-card'
import { SubcategoriesSection } from './subcategories-section'

export function CategoryDetailsModal() {
  const { isCategoryDetailsModalOpen, categoryDetailsSelectedCategory } =
    useCategoryDetailsState()
  const { closeCategoryDetailsModal } = useCategoryDetailsActions()

  const { userId } = useUserSession()

  const { data: category } = useGetCategory({
    userId: userId,
    categoryId: categoryDetailsSelectedCategory ?? ''
  })

  const { data: totalSpent } = useSumTransactions({
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
  const totalAmount = Number(totalSpent?.[0]?.totalAmount || 0)

  if (!categoryData) {
    return null
  }

  return (
    <Modal
      isVisible={isCategoryDetailsModalOpen}
      onClose={closeCategoryDetailsModal}
      className="flex-1"
      height="auto"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-6">
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

          <CategoryInfoCard
            categoryData={categoryData}
            totalAmount={totalAmount}
          />

          <SubcategoriesSection
            subcategories={subcategories}
            categoryType={categoryData.type}
          />

          <DetailsInfoSection
            categoryData={categoryData}
            totalAmount={totalAmount}
          />

          <StatisticsCard
            categoryData={categoryData}
            totalAmount={totalAmount}
          />
        </View>
      </ScrollView>
    </Modal>
  )
}
