import { Icon } from '@/components/icon'
import { formatCurrency } from '@/lib/utils'
import { Text, View } from 'react-native'
import { Card } from '../../ui/card'
import { Separator } from '../../ui/separator'

interface DetailsInfoSectionProps {
  categoryData: any
  totalsByCurrency: { currencyId: string; totalAmount: number }[]
}

export function DetailsInfoSection({
  categoryData,
  totalsByCurrency
}: DetailsInfoSectionProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="p-4">
      <Text className="mb-4 text-base font-semibold text-foreground">
        Information
      </Text>

      {/* Description */}
      {categoryData.description && (
        <>
          <View className="mb-4 flex-row items-start gap-3">
            <Icon
              name="TextAlignStart"
              size={18}
              className="mt-0.5 text-muted-foreground"
            />
            <View className="flex-1">
              <Text className="mb-1 text-sm font-medium text-foreground">
                Description
              </Text>
              <Text className="text-sm text-muted-foreground">
                {categoryData.description}
              </Text>
            </View>
          </View>
          <Separator className="mb-4" />
        </>
      )}

      {/* Category Type */}
      <View className="mb-4 flex-row items-center gap-3">
        <Icon name="Tag" size={18} className="text-muted-foreground" />
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-foreground">
            Category Type
          </Text>
          <Text className="text-sm capitalize text-muted-foreground">
            {categoryData.type} Category
          </Text>
        </View>
      </View>

      <Separator className="mb-4" />

      {/* Total Amount */}
      <View className="mb-4 flex-row items-center gap-3">
        <Icon name="Banknote" size={18} className="text-muted-foreground" />
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-foreground">
            Total {categoryData.type === 'income' ? 'Earned' : 'Spent'}
          </Text>
          <View className="gap-1">
            {(totalsByCurrency ?? [])
              .map(row => ({
                currencyId: String(row.currencyId ?? ''),
                totalAmount: Number(row.totalAmount ?? 0)
              }))
              .filter(row => row.totalAmount >= 0)
              .sort((a, b) => b.totalAmount - a.totalAmount)
              .map(item => (
                <Text
                  key={item.currencyId}
                  className={`text-sm ${
                    categoryData.type === 'income'
                      ? 'text-income'
                      : 'text-expense'
                  }`}
                >
                  {formatCurrency(item.totalAmount, item.currencyId)}
                </Text>
              ))}
            {!totalsByCurrency?.length && (
              <Text className="text-sm text-muted-foreground">0</Text>
            )}
          </View>
        </View>
      </View>

      <Separator className="mb-4" />

      {/* Creation Date */}
      <View className="flex-row items-center gap-3">
        <Icon name="Calendar" size={18} className="text-muted-foreground" />
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-foreground">
            Created On
          </Text>
          <Text className="text-sm text-muted-foreground">
            {formatDate(categoryData.createdAt)}
          </Text>
        </View>
      </View>
    </Card>
  )
}
