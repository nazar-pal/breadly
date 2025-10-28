import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Separator } from '@/components/ui/separator'
import { Text, View } from 'react-native'

interface SubcategoriesSectionProps {
  subcategories: any[]
  categoryType: 'income' | 'expense'
}

export function SubcategoriesSection({
  subcategories,
  categoryType
}: SubcategoriesSectionProps) {
  if (!subcategories || subcategories.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 p-4">
      <View className="mb-4 flex-row items-center gap-2">
        <Icon name="Tag" size={18} className="text-primary" />
        <Text className="text-base font-semibold text-foreground">
          Subcategories ({subcategories.length})
        </Text>
      </View>

      <View className="gap-3">
        {subcategories.map((subcategory: any, index: number) => {
          const subcategoryAmount = subcategory.transactions.reduce(
            (acc: number, tx: any) => acc + tx.amount,
            0
          )

          return (
            <View key={subcategory.id}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-foreground">
                    {subcategory.name}
                  </Text>
                  {subcategory.description && (
                    <Text className="mt-1 text-xs text-muted-foreground">
                      {subcategory.description}
                    </Text>
                  )}
                </View>
                <Text
                  className={`text-sm font-semibold ${
                    categoryType === 'income' ? 'text-income' : 'text-expense'
                  }`}
                >
                  ${subcategoryAmount.toFixed(2)}
                </Text>
              </View>
              {index < subcategories.length - 1 && (
                <Separator className="mt-3" />
              )}
            </View>
          )
        })}
      </View>
    </Card>
  )
}
