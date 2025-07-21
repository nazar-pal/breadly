import { Progress } from '@/components/ui/progress'
import { useUserSession } from '@/lib/hooks'
import { ChevronRight } from '@/lib/icons'
import { useSumTransactions } from '@/lib/powersync/data/queries'
import { cn } from '@/lib/utils'
import { endOfMonth, startOfMonth } from 'date-fns'
import React from 'react'
import { Text, View } from 'react-native'

// Type for category with budget relations (from useGetCategories)
type CategoryWithBudgets = {
  id: string
  name: string
  budgets?: {
    id: string
    amount: number // Changed from string to number
    period: string
    startDate: Date
  }[]
  [key: string]: any // Allow other category properties
}

interface CategoryBreakdownItemProps {
  category: CategoryWithBudgets
  totalSpent: number
  isParent: boolean
  hasSubcategories?: boolean
  isLastSubcategory?: boolean
}

export function CategoryBreakdownItem({
  category,
  totalSpent,
  isParent,
  hasSubcategories = false,
  isLastSubcategory = false
}: CategoryBreakdownItemProps) {
  const { userId } = useUserSession()
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
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const currentMonthBudget = category.budgets?.find(
    budget =>
      budget.period === 'monthly' &&
      new Date(budget.startDate) >= monthStart &&
      new Date(budget.startDate) <= monthEnd
  )

  const budgetAmount = currentMonthBudget ? currentMonthBudget.amount : 0
  const budgetProgress =
    budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
  const isOverBudget = budgetAmount > 0 && spentAmount > budgetAmount

  if (isParent) {
    // Parent category design
    return (
      <View className={cn('py-4', hasSubcategories && 'pb-2')}>
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
            {hasSubcategories && (
              <ChevronRight size={16} className="text-muted-foreground" />
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
  }

  // Subcategory design
  return (
    <View
      className={cn(
        'ml-5 border-l-2 border-border/30 py-2 pl-4',
        !isLastSubcategory && 'border-b border-border/10'
      )}
    >
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-muted-foreground/60" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground/90">
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
                      isOverBudget ? 'text-expense' : 'text-muted-foreground'
                    )}
                  >
                    ({budgetProgress.toFixed(0)}%)
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <Text className="text-sm font-medium text-foreground/80">
          {percentageOfTotal.toFixed(1)}%
        </Text>
      </View>
      <Progress
        value={
          budgetAmount > 0 ? Math.min(budgetProgress, 100) : percentageOfTotal
        }
        className="ml-4 h-1.5"
        indicatorClassName={cn(
          budgetAmount > 0
            ? isOverBudget
              ? 'bg-expense/70'
              : 'bg-primary/70'
            : 'bg-primary/70'
        )}
      />
    </View>
  )
}
