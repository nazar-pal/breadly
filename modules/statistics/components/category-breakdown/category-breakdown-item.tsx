import { useGetCategories } from '@/data/client/queries'
import React from 'react'
import { CategoryBreakdownParent } from './category-breakdown-parent'
import { CategoryBreakdownSubcategory } from './category-breakdown-subcategory'
import { useCategorySpending } from './use-category-spending'

type CategoryWithBudgets = ReturnType<typeof useGetCategories>['data'][number]

interface CategoryBreakdownItemProps {
  category: CategoryWithBudgets
  totalSpent: number
  isParent: boolean
  hasSubcategories?: boolean
  isLastSubcategory?: boolean
  parentCategory?: CategoryWithBudgets
  showChevron?: boolean
  disablePressable?: boolean
  onOpenBudgetModal: (categoryId: string) => void
}

export function CategoryBreakdownItem({
  category,
  totalSpent,
  isParent,
  hasSubcategories = false,
  isLastSubcategory = false,
  parentCategory,
  showChevron = true,
  disablePressable = false,
  onOpenBudgetModal
}: CategoryBreakdownItemProps) {
  const { spentAmount } = useCategorySpending(category.id)

  if (isParent) {
    return (
      <CategoryBreakdownParent
        category={category}
        spentAmount={spentAmount}
        totalSpent={totalSpent}
        hasSubcategories={hasSubcategories}
        showChevron={showChevron}
        disablePressable={disablePressable}
        onOpenBudgetModal={onOpenBudgetModal}
      />
    )
  }

  return (
    <CategoryBreakdownSubcategory
      category={category}
      spentAmount={spentAmount}
      totalSpent={totalSpent}
      isLastSubcategory={isLastSubcategory}
      onOpenBudgetModal={onOpenBudgetModal}
    />
  )
}
