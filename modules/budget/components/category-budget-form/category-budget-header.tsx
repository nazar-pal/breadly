import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

export function CategoryBudgetHeader({
  categoryName,
  parentCategoryName
}: {
  categoryName: string
  parentCategoryName?: string
}) {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold text-foreground">
        Set Monthly Budget
      </Text>
      <View className="mt-2">
        <Text className="text-base font-medium text-foreground">
          {categoryName}
        </Text>
        {parentCategoryName && (
          <Text className="text-sm text-muted-foreground">
            in {parentCategoryName}
          </Text>
        )}
      </View>
    </View>
  )
}
