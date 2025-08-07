import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useGetCategories, useSumTransactions } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { CategoryBreakdownItem } from './category-breakdown-item'

interface CategoryBreakdownProps {
  onOpenBudgetModal: (categoryId: string) => void
}

export function CategoryBreakdown({
  onOpenBudgetModal
}: CategoryBreakdownProps) {
  const { userId } = useUserSession()
  const [showSubcategories, setShowSubcategories] = useState(false)

  // Get all categories to group them by parent-child relationships
  const { data: allCategories } = useGetCategories({
    userId,
    type: 'expense'
  })

  const { data: totalSpent } = useSumTransactions({
    userId,
    type: 'expense'
  })

  // Organize categories into parent-child groups
  const parentCategories = allCategories?.filter(cat => !cat.parentId) || []
  const subcategories = allCategories?.filter(cat => cat.parentId) || []

  // Group subcategories by parent ID
  const subcategoriesByParent = subcategories.reduce(
    (acc, sub) => {
      if (!acc[sub.parentId!]) {
        acc[sub.parentId!] = []
      }
      acc[sub.parentId!].push(sub)
      return acc
    },
    {} as Record<string, typeof subcategories>
  )

  const totalSpentAmount = totalSpent ? Number(totalSpent[0]?.totalAmount) : 0

  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-foreground">
          Spending by Category
        </Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-sm text-muted-foreground">
            Show subcategories
          </Text>
          <Switch
            checked={showSubcategories}
            onCheckedChange={setShowSubcategories}
          />
        </View>
      </View>
      <Card>
        <CardContent className="p-4">
          <View className="w-full">
            {parentCategories.map((parentCategory, index) => {
              const categorySubcategories =
                subcategoriesByParent[parentCategory.id] || []
              const hasSubcategories = categorySubcategories.length > 0
              const isLastCategory = index === parentCategories.length - 1

              return (
                <View
                  key={`${parentCategory.id}-${showSubcategories}`}
                  className={cn(
                    'border-b border-border/10',
                    isLastCategory && 'border-b-0'
                  )}
                >
                  {/* Parent Category */}
                  <CategoryBreakdownItem
                    category={parentCategory}
                    totalSpent={totalSpentAmount}
                    isParent={true}
                    hasSubcategories={hasSubcategories}
                    showChevron={false}
                    disablePressable={false}
                    onOpenBudgetModal={onOpenBudgetModal}
                  />

                  {/* Subcategories in Two-Column Layout */}
                  {showSubcategories && hasSubcategories && (
                    <View className="px-4 pb-4">
                      <View className="flex-row flex-wrap justify-between">
                        {categorySubcategories.map((subcategory, subIndex) => (
                          <View key={subcategory.id} className="mb-2 w-[48%]">
                            <CategoryBreakdownItem
                              category={subcategory}
                              totalSpent={totalSpentAmount}
                              isParent={false}
                              parentCategory={parentCategory}
                              isLastSubcategory={
                                subIndex === categorySubcategories.length - 1
                              }
                              onOpenBudgetModal={onOpenBudgetModal}
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </CardContent>
      </Card>
    </View>
  )
}
