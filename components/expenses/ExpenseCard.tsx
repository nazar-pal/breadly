import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Calendar, Mic, Receipt } from '@/lib/icons'
import { useRouter } from 'expo-router'
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const handlePress = () => {
    router.push(`/expenses/${expense.id}`)
  }

  return (
    <Pressable onPress={handlePress} className="active:opacity-80">
      <Card className="mb-3">
        <CardContent className="min-h-[80px] flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <Text className="text-expense mb-1 text-lg font-semibold">
              {formatCurrency(expense.amount)}
            </Text>
            <Text
              className="text-foreground mb-2 flex-wrap text-sm"
              numberOfLines={2}
            >
              {expense.description}
            </Text>
            <View className="flex-row flex-wrap items-center">
              <View className="bg-muted mr-2 rounded px-2 py-1">
                <Text className="text-foreground text-xs font-medium">
                  {expense.category}
                </Text>
              </View>
              <View className="ml-2 flex-row items-center">
                <Calendar size={14} className="text-muted-foreground" />
                <Text className="text-muted-foreground ml-1 text-xs">
                  {expense.date}
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end justify-between">
            <View className="mb-3 flex-row">
              {expense.hasPhoto && (
                <Receipt size={16} className="text-muted-foreground mr-2" />
              )}
              {expense.hasVoice && (
                <Mic size={16} className="text-muted-foreground" />
              )}
            </View>
            <ArrowRight size={20} className="text-primary" />
          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}
