import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'expo-router'
import { ArrowRight, Calendar, Mic, Receipt } from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Card from './Card'

interface ExpenseCardProps {
  expense: {
    id: string
    amount: number
    category: string
    date: string
    description: string
    hasPhoto?: boolean
    hasVoice?: boolean
  }
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const { colors, spacing } = useTheme()
  const router = useRouter()

  const handlePress = () => {
    router.push(`/expenses/${expense.id}`)
  }

  return (
    <Pressable onPress={handlePress}>
      <Card variant="elevated" size="md" className="mb-3">
        <View className="min-h-[80px] flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <Text
              className="mb-1 text-lg font-semibold"
              style={{ color: colors.text }}
            >
              ${expense.amount.toFixed(2)}
            </Text>
            <Text
              className="mb-2 flex-wrap text-sm"
              style={{ color: colors.textSecondary }}
              numberOfLines={2}
            >
              {expense.description}
            </Text>
            <View className="flex-row flex-wrap items-center">
              <View
                className="mr-2 rounded px-2 py-1"
                style={{ backgroundColor: colors.surfaceSecondary }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: colors.text }}
                >
                  {expense.category}
                </Text>
              </View>
              <View
                className="flex-row items-center"
                style={{ marginLeft: spacing.sm }}
              >
                <Calendar size={14} color={colors.textSecondary} />
                <Text
                  className="ml-1 text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  {expense.date}
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end justify-between">
            <View className="mb-3 flex-row">
              {expense.hasPhoto && (
                <Receipt
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
              )}
              {expense.hasVoice && (
                <Mic size={16} color={colors.textSecondary} />
              )}
            </View>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </View>
      </Card>
    </Pressable>
  )
}
