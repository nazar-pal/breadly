import Card from '@/components/ui-old/Card'
import { mockExpenses } from '@/data/mockData'
import { useLocalSearchParams } from 'expo-router'
import { Calendar, Mic, Tag } from 'lucide-react-native'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  // Find the expense with the matching ID
  const expense = mockExpenses.find(e => e.id === id)

  // Placeholder for receipt image
  const receiptImageUrl =
    'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

  if (!expense) {
    return (
      <View className="flex-1 bg-old-background">
        <Text className="mt-10 text-center text-lg text-old-error">
          Expense not found
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-old-background"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="mb-6 items-center">
        <Text className="mb-2 text-base text-old-text-secondary">Amount</Text>
        <Text className="text-[48px] font-bold text-old-expense">
          ${expense.amount.toFixed(2)}
        </Text>
      </View>

      <Card className="mb-4">
        <View className="flex-row items-center py-3">
          <View className="bg-old-icon-background-info mr-3 h-10 w-10 items-center justify-center rounded-[20px]">
            <Calendar size={20} color="#3B82F6" />
          </View>
          <View>
            <Text className="mb-1 text-sm text-old-text-secondary">Date</Text>
            <Text className="text-base font-medium text-old-text">
              {expense.date}
            </Text>
          </View>
        </View>

        <View className="h-px w-full bg-old-border" />

        <View className="flex-row items-center py-3">
          <View className="bg-old-icon-background-primary mr-3 h-10 w-10 items-center justify-center rounded-[20px]">
            <Tag size={20} color="#6366F1" />
          </View>
          <View>
            <Text className="mb-1 text-sm text-old-text-secondary">
              Category
            </Text>
            <Text className="text-base font-medium text-old-text">
              {expense.category}
            </Text>
          </View>
        </View>

        <View className="h-px w-full bg-old-border" />

        <View className="flex-row py-3">
          <View className="flex-1">
            <Text className="mb-1 text-sm text-old-text-secondary">
              Description
            </Text>
            <Text className="text-base leading-6 text-old-text">
              {expense.description ?? 'No description provided'}
            </Text>
          </View>
        </View>
      </Card>

      {expense.hasPhoto && (
        <Card className="mb-4">
          <Text className="mb-3 text-base font-semibold text-old-text">
            Receipt Photo
          </Text>
          <View className="h-[200px] overflow-hidden rounded-lg bg-old-surface-secondary">
            <Image
              source={{ uri: receiptImageUrl }}
              className="h-full w-full"
              resizeMode="contain"
            />
          </View>
        </Card>
      )}

      {expense.hasVoice && (
        <Card className="mb-4">
          <Text className="mb-3 text-base font-semibold text-old-text">
            Voice Memo
          </Text>
          <View className="bg-old-icon-background-warning flex-row items-center rounded-lg p-3">
            <Mic size={24} color="#F59E0B" className="mr-2" />
            <Text className="text-base text-old-text">Voice Memo (00:12)</Text>
          </View>
        </Card>
      )}
    </ScrollView>
  )
}
