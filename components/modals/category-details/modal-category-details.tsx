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
import { CategoryBudgetForm } from '@/modules/budget/components'
import { useUserSession } from '@/modules/session-and-migration'
import { endOfMonth, startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { CenteredModal } from '../centered-modal'
import { Modal } from '../modal'
import { BudgetProgressCard } from './budget-progress-card'
import { BudgetSection } from './budget-section'
import { CategoryDetailsHeader } from './category-details-header'
import { CategoryInfoCard } from './category-info-card'
import { DetailsInfoSection } from './details-info-section'
import { StatisticsCard } from './statistics-card'
import { SubcategoriesSection } from './subcategories-section'

export function CategoryDetailsModal() {
  const { isCategoryDetailsModalOpen, categoryDetailsSelectedCategory } =
    useCategoryDetailsState()
  const { closeCategoryDetailsModal } = useCategoryDetailsActions()

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const openBudgetModal = () => setIsBudgetModalOpen(true)
  const closeBudgetModal = () => setIsBudgetModalOpen(false)

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
    hasBudgets,
    hasSubcategories,
    transactionCount,
    budgetCount,
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

  // Budget calculations
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)

  const monthlyBudget = categoryData?.budgets?.find(budget => {
    const budgetStart = new Date(budget.startDate)
    const budgetEnd = new Date(budget.endDate)
    return budgetStart <= currentMonthEnd && budgetEnd >= currentMonthStart
  })
  const budgetAmount = monthlyBudget?.amount || 0
  const budgetProgress =
    budgetAmount > 0 ? Math.min((totalAmount / budgetAmount) * 100, 100) : 0
  const isOverBudget = totalAmount > budgetAmount && budgetAmount > 0
  const remainingBudget = Math.max(budgetAmount - totalAmount, 0)

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
            hasBudgets={hasBudgets}
            hasSubcategories={hasSubcategories}
            transactionCount={transactionCount}
            budgetCount={budgetCount}
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

          <BudgetSection
            categoryType={categoryData.type}
            budgetAmount={budgetAmount}
            totalAmount={totalAmount}
            isOverBudget={isOverBudget}
            remainingBudget={remainingBudget}
            budgetProgress={budgetProgress}
            onEditBudget={openBudgetModal}
          />

          <BudgetProgressCard
            categoryType={categoryData.type}
            monthlyBudget={monthlyBudget}
            budgetAmount={budgetAmount}
            totalAmount={totalAmount}
            budgetProgress={budgetProgress}
            isOverBudget={isOverBudget}
            remainingBudget={remainingBudget}
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
      <CenteredModal
        visible={isBudgetModalOpen}
        onRequestClose={closeBudgetModal}
        className="bg-card text-card-foreground"
      >
        <CategoryBudgetForm
          categoryId={categoryDetailsSelectedCategory ?? ''}
          onClose={closeBudgetModal}
        />
      </CenteredModal>
    </Modal>
  )
}
