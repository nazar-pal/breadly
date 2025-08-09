import { Icon } from '@/components/icon'
import { Progress } from '@/components/ui/progress'
import { useGetCategories } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  calculateBudgetProgress,
  calculatePercentageOfTotal,
  formatCurrency,
  getCurrentMonthBudget,
  isOverBudget
} from '../../utils'

type CategoryWithBudgets = ReturnType<typeof useGetCategories>['data'][number]

interface CategoryBreakdownParentProps {
  category: CategoryWithBudgets
  spentAmount: number
  totalSpent: number
  hasSubcategories: boolean
  showChevron?: boolean
  disablePressable?: boolean
  onOpenBudgetModal: (categoryId: string) => void
}

export function CategoryBreakdownParent({
  category,
  spentAmount,
  totalSpent,
  hasSubcategories,
  showChevron = true,
  disablePressable = false,
  onOpenBudgetModal
}: CategoryBreakdownParentProps) {
  const percentageOfTotal = calculatePercentageOfTotal(spentAmount, totalSpent)

  const currentMonthBudget = getCurrentMonthBudget(category.budgets)
  const budgetAmount = currentMonthBudget ? currentMonthBudget.amount : 0
  const budgetProgress = calculateBudgetProgress(spentAmount, budgetAmount)
  const isOverBudgetValue = isOverBudget(spentAmount, budgetAmount)

  const handleLongPress = () => onOpenBudgetModal(category.id)

  const content = (
    <View className="flex-1 py-3">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-3">
          <View
            className={cn(
              'h-8 w-8 items-center justify-center rounded-full',
              isOverBudgetValue ? 'bg-expense/10' : 'bg-primary/10'
            )}
          >
            <Icon
              name="Folder"
              size={16}
              className={cn(
                isOverBudgetValue ? 'text-expense' : 'text-primary'
              )}
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-base font-semibold text-foreground"
              numberOfLines={1}
            >
              {category.name}
            </Text>
            <View className="mt-0.5 flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                {formatCurrency(spentAmount)}
              </Text>
              {budgetAmount > 0 && (
                <>
                  <Text className="text-sm text-muted-foreground">
                    of {formatCurrency(budgetAmount)}
                  </Text>
                  <View
                    className={cn(
                      'rounded-full px-2 py-0.5',
                      isOverBudgetValue ? 'bg-expense/10' : 'bg-muted/50'
                    )}
                  >
                    <Text
                      className={cn(
                        'text-[10px] font-medium',
                        isOverBudgetValue
                          ? 'text-expense'
                          : 'text-muted-foreground'
                      )}
                    >
                      {budgetProgress.toFixed(0)}% of budget
                    </Text>
                  </View>
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
        <Text className="text-lg font-bold text-foreground">
          {percentageOfTotal.toFixed(1)}%
        </Text>
      </View>
      <Progress
        value={
          budgetAmount > 0 ? Math.min(budgetProgress, 100) : percentageOfTotal
        }
        className="h-2"
        indicatorClassName={cn(
          budgetAmount > 0
            ? isOverBudgetValue
              ? 'bg-expense'
              : 'bg-primary'
            : 'bg-primary'
        )}
      />
    </View>
  )

  if (disablePressable) {
    return content
  }

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={500}
      className="w-full"
    >
      {content}
    </Pressable>
  )
}
