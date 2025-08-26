import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { CategoryCardIcon } from '@/screens/tabs-categories/category-card-icon'
import { Text, View } from 'react-native'

interface CategoryInfoCardProps {
  categoryData: any
  totalsByCurrency: { currencyId: string; totalAmount: number }[]
}

export function CategoryInfoCard({
  categoryData,
  totalsByCurrency
}: CategoryInfoCardProps) {
  const renderTotals = () => {
    if (!totalsByCurrency || totalsByCurrency.length === 0) return '0'
    return totalsByCurrency
      .map(t => formatCurrency(Number(t.totalAmount), String(t.currencyId)))
      .join(' + ')
  }
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

          <Text
            numberOfLines={1}
            className={`text-lg font-bold ${
              categoryData.type === 'income' ? 'text-income' : 'text-expense'
            }`}
          >
            {renderTotals()}
          </Text>
        </View>
      </View>
    </Card>
  )
}
