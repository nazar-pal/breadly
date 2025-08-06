import { Icon } from '@/components/icon'
import { Progress } from '@/components/ui/progress'
import { useSumTransactions } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import { endOfMonth, startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CategoryBudgetModal } from '../modals/category-budget/category-budget'

// Type for category with budget relations (from useGetCategories)
interface CategoryWithBudgets {
  id: string
  name: string
  type: 'expense' | 'income'
  parentId?: string | null
  budgets?: {
    id: string
    amount: number
    currency: string
    startDate: Date
    endDate: Date
  }[]
  [key: string]: any // Allow other category properties
}

interface CategoryBreakdownItemProps {
  category: CategoryWithBudgets
  totalSpent: number
  isParent: boolean
  hasSubcategories?: boolean
  isLastSubcategory?: boolean
  parentCategory?: CategoryWithBudgets
  showChevron?: boolean
  disablePressable?: boolean
}

export function CategoryBreakdownItem({
  category,
  totalSpent,
  isParent,
  hasSubcategories = false,
  isLastSubcategory = false,
  parentCategory,
  showChevron = true,
  disablePressable = false
}: CategoryBreakdownItemProps) {
  const { userId } = useUserSession()
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  const { data: spent } = useSumTransactions({
    userId,
    type: 'expense',
    categoryId: category.id
  })

  const spentAmount = spent ? Number(spent[0]?.totalAmount) : 0
  const percentageOfTotal =
    totalSpent > 0 ? (spentAmount / totalSpent) * 100 : 0

  // Get current month budget for this category
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)

  const currentMonthBudget = category.budgets?.find(budget => {
    const budgetStart = new Date(budget.startDate)
    const budgetEnd = new Date(budget.endDate)
    return budgetStart <= currentMonthEnd && budgetEnd >= currentMonthStart
  })

  const budgetAmount = currentMonthBudget ? currentMonthBudget.amount : 0
  const budgetProgress =
    budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
  const isOverBudget = budgetAmount > 0 && spentAmount > budgetAmount

  const handleLongPress = () => {
    setShowBudgetModal(true)
  }

  // Parent category content
  const parentContent = (
    <View className="flex-1 py-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full bg-primary" />
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {category.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                ${spentAmount.toFixed(2)}
              </Text>
              {budgetAmount > 0 && (
                <>
                  <Text className="text-sm text-muted-foreground">
                    of ${budgetAmount.toFixed(2)}
                  </Text>
                  <Text
                    className={cn(
                      'text-xs font-medium',
                      isOverBudget ? 'text-expense' : 'text-muted-foreground'
                    )}
                  >
                    ({budgetProgress.toFixed(0)}%)
                  </Text>
                </>
              )}
            </View>
          </View>
          {showChevron && hasSubcategories && (
            <Icon
              name="ChevronRight"
              size={16}
              className="text-muted-foreground"
            />
          )}
        </View>
        <Text className="text-base font-semibold text-foreground">
          {percentageOfTotal.toFixed(1)}%
        </Text>
      </View>
      <Progress
        value={
          budgetAmount > 0 ? Math.min(budgetProgress, 100) : percentageOfTotal
        }
        className="h-3"
        indicatorClassName={cn(
          budgetAmount > 0
            ? isOverBudget
              ? 'bg-expense'
              : 'bg-primary'
            : 'bg-primary'
        )}
      />
    </View>
  )

  if (isParent) {
    // Parent category design - with or without Pressable based on disablePressable prop
    return (
      <>
        {disablePressable ? (
          parentContent
        ) : (
          <Pressable
            onLongPress={handleLongPress}
            delayLongPress={500}
            className="w-full"
          >
            {parentContent}
          </Pressable>
        )}

        <CategoryBudgetModal
          isVisible={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          category={category}
          parentCategory={parentCategory}
          currentBudget={budgetAmount}
        />
      </>
    )
  }

  // Subcategory design - enhanced for better visual hierarchy and fixed overflow
  return (
    <>
      <Pressable onLongPress={handleLongPress} delayLongPress={500}>
        <View
          className={cn(
            'border-l-2 border-border/30 py-3 pl-4 pr-2',
            !isLastSubcategory && 'border-b border-border/10'
          )}
        >
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-2 pr-2">
              <View className="h-2 w-2 rounded-full bg-muted-foreground/60" />
              <View className="min-w-0 flex-1">
                <Text
                  className="text-sm font-medium text-foreground/90"
                  numberOfLines={1}
                >
                  {category.name}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-muted-foreground">
                    ${spentAmount.toFixed(2)}
                  </Text>
                  {budgetAmount > 0 && (
                    <>
                      <Text className="text-xs text-muted-foreground">
                        of ${budgetAmount.toFixed(2)}
                      </Text>
                      <Text
                        className={cn(
                          'text-xs font-medium',
                          isOverBudget
                            ? 'text-expense'
                            : 'text-muted-foreground'
                        )}
                      >
                        ({budgetProgress.toFixed(0)}%)
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            <Text className="ml-2 text-sm font-medium text-foreground/80">
              {percentageOfTotal.toFixed(1)}%
            </Text>
          </View>
          {/* Fixed progress bar with proper constraints */}
          <View className="ml-4 mr-2">
            <Progress
              value={
                budgetAmount > 0
                  ? Math.min(budgetProgress, 100)
                  : percentageOfTotal
              }
              className="h-1.5 w-full"
              indicatorClassName={cn(
                budgetAmount > 0
                  ? isOverBudget
                    ? 'bg-expense/70'
                    : 'bg-primary/70'
                  : 'bg-primary/70'
              )}
            />
          </View>
        </View>
      </Pressable>

      <CategoryBudgetModal
        isVisible={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        category={category}
        parentCategory={parentCategory}
        currentBudget={budgetAmount}
      />
    </>
  )
}
