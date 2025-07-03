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
  const { data: categories } = useGetCategories({
    userId,
    type: 'expense'
  })

  // Get top 5 categories by spent amount
  const topCategories = [...categories].slice(0, 5)

  const { data: totalSpent } = useSumTransactions({
    userId,
    type: 'expense'
  })

  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Spending by Category
      </Text>
      <Card>
        <CardContent className="p-4">
          {topCategories.map((category, index) => {
            return (
              <CategoryBreakdownItem
                key={category.id}
                category={category}
                lastItemInList={index === topCategories.length - 1}
                totalSpent={totalSpent ? Number(totalSpent[0]?.totalAmount) : 0}
              />
            )
          })}
        </CardContent>
      </Card>
    </View>
  )
}
