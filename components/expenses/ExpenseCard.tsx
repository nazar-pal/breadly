import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'expo-router'
import { ArrowRight, Calendar, Mic, Receipt } from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

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
  const router = useRouter()

  const handlePress = () => {
    router.push(`/expenses/${expense.id}`)
  }

  return (
    <Pressable onPress={handlePress}>
      <Card className="mb-3">
        <CardContent className="min-h-[80px] flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <Text className="mb-1 text-lg font-semibold text-old-text">
              ${expense.amount.toFixed(2)}
            </Text>
            <Text
              className="mb-2 flex-wrap text-sm text-old-text-secondary"
              numberOfLines={2}
            >
              {expense.description}
            </Text>
            <View className="flex-row flex-wrap items-center">
              <View className="mr-2 rounded bg-old-surface-secondary px-2 py-1">
                <Text className="text-xs font-medium text-old-text">
                  {expense.category}
                </Text>
              </View>
              <View className="ml-2 flex-row items-center">
                <Calendar size={14} color="#4A5568" />
                <Text className="ml-1 text-xs text-old-text-secondary">
                  {expense.date}
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end justify-between">
            <View className="mb-3 flex-row">
              {expense.hasPhoto && (
                <Receipt size={16} color="#4A5568" style={{ marginRight: 8 }} />
              )}
              {expense.hasVoice && <Mic size={16} color="#4A5568" />}
            </View>
            <ArrowRight size={20} color="#6366F1" />
          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}
