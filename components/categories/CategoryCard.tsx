import { Card, CardContent } from '@/components/ui/card'
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import IconButton from '../ui-old/IconButton'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    budget: number
    spent: number
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  type?: 'expense' | 'income'
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  type = 'expense'
}: CategoryCardProps) {
  const percentage = (category.spent / category.budget) * 100
  const isOverBudget = type === 'expense' ? percentage > 100 : percentage < 100

  return (
    <Card className="mb-3">
      <CardContent>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-old-text">
            {category.name}
          </Text>
          <View className="flex-row">
            <IconButton
              icon={<Edit2 size={16} />}
              variant="ghost"
              size="sm"
              onPress={() => onEdit(category.id)}
              className="mr-1"
            />
            <IconButton
              icon={<Trash2 size={16} />}
              variant="ghost"
              size="sm"
              onPress={() => onDelete(category.id)}
            />
          </View>
        </View>

        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-baseline">
            <Text className="mr-1 text-lg font-semibold text-old-text">
              ${category.spent.toFixed(2)}
            </Text>
            <Text className="text-sm text-old-text-secondary">
              {type === 'expense' ? 'of' : 'from'} ${category.budget.toFixed(2)}
            </Text>
          </View>
          <Text
            className="text-sm font-semibold"
            style={{ color: isOverBudget ? '#EF4444' : '#10B981' }}
          >
            {percentage.toFixed(0)}%
          </Text>
        </View>

        <View className="h-2 overflow-hidden rounded bg-old-surface-secondary">
          <View
            className="h-full"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isOverBudget ? '#EF4444' : '#10B981'
            }}
          />
        </View>
      </CardContent>
    </Card>
  )
}
