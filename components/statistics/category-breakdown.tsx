import { Card, CardContent } from '@/components/ui/card'
import { useUserSession } from '@/lib/hooks'
import {
  useGetCategories,
  useSumTransactions
} from '@/lib/powersync/data/queries'
import React from 'react'
import { Text, View } from 'react-native'
import { CategoryBreakdownItem } from './category-breakdown-item'

export function CategoryBreakdown() {
  const { userId } = useUserSession()

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
    <View className="mb-6">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Spending by Category
      </Text>
      <Card>
        <CardContent className="p-4">
          {parentCategories.map((parentCategory, parentIndex) => {
            const isLastParent = parentIndex === parentCategories.length - 1
            const categorySubcategories =
              subcategoriesByParent[parentCategory.id] || []

            return (
              <View key={parentCategory.id}>
                {/* Parent Category */}
                <CategoryBreakdownItem
                  category={parentCategory}
                  totalSpent={totalSpentAmount}
                  isParent={true}
                  hasSubcategories={categorySubcategories.length > 0}
                />

                {/* Subcategories */}
                {categorySubcategories.map((subcategory, subIndex) => (
                  <CategoryBreakdownItem
                    key={subcategory.id}
                    category={subcategory}
                    totalSpent={totalSpentAmount}
                    isParent={false}
                    isLastSubcategory={
                      subIndex === categorySubcategories.length - 1
                    }
                  />
                ))}

                {/* Add spacing between parent category groups */}
                {!isLastParent && (
                  <View className="my-4 border-b border-border/20" />
                )}
              </View>
            )
          })}
        </CardContent>
      </Card>
    </View>
  )
}
