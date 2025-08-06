import { Icon } from '@/components/icon'
import { Card, CardContent } from '@/components/ui/card'
import { useGetCategories, useSumTransactions } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CategoryBreakdownItem } from './category-breakdown-item'

export function CategoryBreakdown() {
  const { userId } = useUserSession()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )

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

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Spending by Category
      </Text>
      <Card>
        <CardContent className="p-4">
          <View className="w-full">
            {parentCategories.map((parentCategory, index) => {
              const categorySubcategories =
                subcategoriesByParent[parentCategory.id] || []
              const hasSubcategories = categorySubcategories.length > 0
              const isExpanded = expandedCategories.has(parentCategory.id)
              const isLastCategory = index === parentCategories.length - 1

              return (
                <View
                  key={parentCategory.id}
                  className={cn(
                    'border-b border-border/10',
                    isLastCategory && 'border-b-0'
                  )}
                >
                  {/* Parent Category */}
                  {hasSubcategories ? (
                    <Pressable
                      onPress={() => toggleCategory(parentCategory.id)}
                      className="w-full"
                    >
                      <View className="flex-row items-center">
                        <View className="flex-1">
                          <CategoryBreakdownItem
                            category={parentCategory}
                            totalSpent={totalSpentAmount}
                            isParent={true}
                            hasSubcategories={hasSubcategories}
                            showChevron={false}
                            disablePressable={true}
                          />
                        </View>
                        <View className="px-2 py-4">
                          {isExpanded ? (
                            <Icon
                              name="ChevronDown"
                              size={18}
                              className="text-muted-foreground"
                            />
                          ) : (
                            <Icon
                              name="ChevronRight"
                              size={18}
                              className="text-muted-foreground"
                            />
                          )}
                        </View>
                      </View>
                    </Pressable>
                  ) : (
                    <View className="py-4">
                      <CategoryBreakdownItem
                        category={parentCategory}
                        totalSpent={totalSpentAmount}
                        isParent={true}
                        hasSubcategories={false}
                        showChevron={false}
                        disablePressable={false}
                      />
                    </View>
                  )}

                  {/* Subcategories */}
                  {hasSubcategories && isExpanded && (
                    <View className="pb-2">
                      {categorySubcategories.map((subcategory, subIndex) => (
                        <CategoryBreakdownItem
                          key={subcategory.id}
                          category={subcategory}
                          totalSpent={totalSpentAmount}
                          isParent={false}
                          parentCategory={parentCategory}
                          isLastSubcategory={
                            subIndex === categorySubcategories.length - 1
                          }
                        />
                      ))}
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
