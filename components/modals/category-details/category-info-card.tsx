import { Icon } from '@/components/icon'
import { Text, View } from 'react-native'
import { CategoryCardIcon } from '../../../screens/tabs-categories/category-card-icon'
import { Badge } from '../../ui/badge'
import { Card } from '../../ui/card'

interface CategoryInfoCardProps {
  categoryData: any
  totalAmount: number
}

export function CategoryInfoCard({
  categoryData,
  totalAmount
}: CategoryInfoCardProps) {
  return (
    <Card className="mb-6 p-4">
      <View className="flex-row items-center">
        <CategoryCardIcon name={categoryData.icon} type={categoryData.type} />
        <View className="ml-4 flex-1">
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="text-lg font-bold text-foreground">
              {categoryData.name}
            </Text>
            <Badge
              variant={categoryData.type === 'income' ? 'default' : 'secondary'}
              className={`${
                categoryData.type === 'income'
                  ? 'bg-income/20 text-income'
                  : 'bg-expense/20 text-expense'
              }`}
            >
              <Text className="text-xs font-medium capitalize">
                {categoryData.type}
              </Text>
            </Badge>
            {categoryData.isArchived && (
              <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                <Text className="text-xs font-medium">Archived</Text>
              </Badge>
            )}
          </View>
          <View className="flex-row items-center gap-1">
            <Icon
              name="DollarSign"
              size={16}
              className={
                categoryData.type === 'income' ? 'text-income' : 'text-expense'
              }
            />
            <Text
              className={`text-lg font-bold ${
                categoryData.type === 'income' ? 'text-income' : 'text-expense'
              }`}
            >
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  )
}
