import { Card, CardContent } from '@/components/ui/card'
import { useUserSession } from '@/lib/hooks'
import { useGetTopMonthlyExpenses } from '@/lib/powersync/data/queries'
import React from 'react'
import { Text, View } from 'react-native'

export function TopExpenses() {
  const { userId } = useUserSession()
  const { data: topExpenses, isLoading } = useGetTopMonthlyExpenses({
    userId
  })

  if (isLoading) {
    return (
      <View className="mb-6">
        <Text className="mb-4 text-lg font-semibold text-foreground">
          Top 5 Expenses
        </Text>
        <Text className="text-center text-muted-foreground">
          Loading expenses...
        </Text>
      </View>
    )
  }

  if (topExpenses.length === 0) {
    return (
      <View className="mb-6">
        <Text className="mb-4 text-lg font-semibold text-foreground">
          Top 5 Expenses
        </Text>
        <Text className="text-center text-muted-foreground">
          No expenses found for this month.
        </Text>
      </View>
    )
  }

  const formatCategoryDisplay = (transaction: (typeof topExpenses)[0]) => {
    if (!transaction.category) {
      return 'Uncategorized'
    }

    const { category } = transaction

    // If this is a subcategory (has a parent), show: "Parent > Child"
    if (category.parent) {
      return `${category.parent.name} > ${category.name}`
    }

    // If this is a parent category, just show the name
    return category.name
  }

  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Top 5 Expenses
      </Text>
      {topExpenses.map((transaction, index) => (
        <Card key={transaction.id} className="mb-3">
          <CardContent className="p-4">
            <View className="flex-row items-start justify-between">
              <View className="mr-3 flex-1">
                <View className="mb-1 flex-row items-center gap-2">
                  <View className="rounded-md bg-destructive/10 px-2 py-0.5">
                    <Text className="text-xs font-bold text-destructive">
                      #{index + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 text-base font-semibold text-foreground">
                    {formatCategoryDisplay(transaction)}
                  </Text>
                </View>
                {transaction.notes && (
                  <Text className="text-sm leading-5 text-muted-foreground">
                    {transaction.notes}
                  </Text>
                )}
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-destructive">
                  ${Number(transaction.amount).toFixed(2)}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  )
}
