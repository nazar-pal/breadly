import { useTheme } from '@/context/ThemeContext'
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import Card from '../ui-old/Card'
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
  const { colors } = useTheme()

  const percentage = (category.spent / category.budget) * 100
  const isOverBudget = type === 'expense' ? percentage > 100 : percentage < 100

  return (
    <Card className="mb-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text
          className="text-base font-semibold"
          style={{ color: colors.text }}
        >
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
          <Text
            className="mr-1 text-lg font-semibold"
            style={{ color: colors.text }}
          >
            ${category.spent.toFixed(2)}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {type === 'expense' ? 'of' : 'from'} ${category.budget.toFixed(2)}
          </Text>
        </View>
        <Text
          className="text-sm font-semibold"
          style={{ color: isOverBudget ? colors.error : colors.success }}
        >
          {percentage.toFixed(0)}%
        </Text>
      </View>

      <View
        className="h-2 overflow-hidden rounded"
        style={{ backgroundColor: colors.surfaceSecondary }}
      >
        <View
          className="h-full"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: isOverBudget ? colors.error : colors.success
          }}
        />
      </View>
    </Card>
  )
}
