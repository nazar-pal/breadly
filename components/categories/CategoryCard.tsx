import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, Trash2 } from '@/lib/icons'
import React from 'react'
import { Text, View } from 'react-native'

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
          <Text className="text-base font-semibold text-foreground">
            {category.name}
          </Text>
          <View className="flex-row">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => onEdit(category.id)}
              className="mr-1 h-8 w-8 items-center justify-center"
            >
              <CreditCard size={16} color="#1A202C" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onPress={() => onDelete(category.id)}
              className="h-8 w-8 items-center justify-center"
            >
              <Trash2 size={16} color="#1A202C" />
            </Button>
          </View>
        </View>

        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-baseline">
            <Text className="mr-1 text-lg font-semibold text-foreground">
              ${category.spent.toFixed(2)}
            </Text>
            <Text className="text-sm text-foreground">
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

        <View className="bg-card-secondary h-2 overflow-hidden rounded">
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
