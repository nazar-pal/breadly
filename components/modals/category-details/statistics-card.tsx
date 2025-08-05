import { Text, View } from 'react-native'
import { Card } from '../../ui/card'

interface StatisticsCardProps {
  categoryData: any
  totalAmount: number
}

export function StatisticsCard({
  categoryData,
  totalAmount
}: StatisticsCardProps) {
  return (
    <Card className="mt-4 p-4">
      <Text className="mb-4 text-base font-semibold text-foreground">
        Quick Stats
      </Text>

      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-primary">
            {totalAmount > 0 ? '1' : '0'}
          </Text>
          <Text className="text-xs text-muted-foreground">Active Category</Text>
        </View>

        <View className="w-px bg-border" />

        <View className="flex-1 items-center">
          <Text
            className={`text-2xl font-bold ${
              categoryData.type === 'income' ? 'text-income' : 'text-expense'
            }`}
          >
            ${totalAmount.toFixed(0)}
          </Text>
          <Text className="text-xs text-muted-foreground">Total Amount</Text>
        </View>

        <View className="w-px bg-border" />

        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-foreground">
            {categoryData.isArchived ? 'No' : 'Yes'}
          </Text>
          <Text className="text-xs text-muted-foreground">Active Status</Text>
        </View>
      </View>
    </Card>
  )
}
