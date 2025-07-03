import { Progress } from '@/components/ui/progress'
import { useUserSession } from '@/lib/hooks'
import { useSumTransactions } from '@/lib/powersync/data/queries'
import { CategorySelectSQLite } from '@/lib/powersync/schema/table_4_categories'
import { cn } from '@/lib/utils'
import React from 'react'
import { Text, View } from 'react-native'

export function CategoryBreakdownItem({
  category,
  lastItemInList,
  totalSpent
}: {
  category: CategorySelectSQLite
  lastItemInList: boolean
  totalSpent: number
}) {
  const { userId } = useUserSession()
  const { data: spent } = useSumTransactions({
    userId,
    type: 'expense',
    categoryId: category.id
  })

  const spentAmount = spent ? Number(spent[0]?.totalAmount) : 0

  const percentage = (spentAmount / totalSpent) * 100

  return (
    <View
      key={category.id}
      className={cn('py-3', !lastItemInList && 'border-b border-border/10')}
    >
      <View className="mb-2 flex-row justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-foreground">
            {category.name}
          </Text>
          <Text className="text-xs text-muted-foreground">
            ${spentAmount.toFixed(2)}
          </Text>
        </View>
        <Text className="text-sm font-medium text-foreground">
          {percentage.toFixed(1)}%
        </Text>
      </View>
      <Progress
        value={percentage}
        className="h-2"
        indicatorClassName="bg-primary"
      />
    </View>
  )
}
