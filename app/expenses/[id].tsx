import { Card, CardContent } from '@/components/ui/card'
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
      <View className="bg-background flex-1">
        <Text className="text-destructive mt-10 text-center text-lg">
          Expense not found
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="mb-6 items-center">
        <Text className="text-foreground mb-2 text-base">Amount</Text>
        <Text className="text-info text-[48px] font-bold">
          ${expense.amount.toFixed(2)}
        </Text>
      </View>

      <Card className="mb-4">
        <CardContent>
          <View className="flex-row items-center py-3">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]">
              <Calendar size={20} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-foreground mb-1 text-sm">Date</Text>
              <Text className="text-foreground text-base font-medium">
                {expense.date}
              </Text>
            </View>
          </View>

          <View className="bg-border h-px w-full" />

          <View className="flex-row items-center py-3">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]">
              <Tag size={20} color="#6366F1" />
            </View>
            <View>
              <Text className="text-foreground mb-1 text-sm">Category</Text>
              <Text className="text-foreground text-base font-medium">
                {expense.category}
              </Text>
            </View>
          </View>

          <View className="bg-border h-px w-full" />

          <View className="flex-row py-3">
            <View className="flex-1">
              <Text className="text-foreground mb-1 text-sm">Description</Text>
              <Text className="text-foreground text-base leading-6">
                {expense.description ?? 'No description provided'}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {expense.hasPhoto && (
        <Card className="mb-4">
          <CardContent>
            <Text className="text-foreground mb-3 text-base font-semibold">
              Receipt Photo
            </Text>
            <View className="bg-card-secondary h-[200px] overflow-hidden rounded-lg">
              <Image
                source={{ uri: receiptImageUrl }}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
          </CardContent>
        </Card>
      )}

      {expense.hasVoice && (
        <Card className="mb-4">
          <CardContent>
            <Text className="text-foreground mb-3 text-base font-semibold">
              Voice Memo
            </Text>
            <View className="flex-row items-center rounded-lg p-3">
              <Mic size={24} color="#F59E0B" className="mr-2" />
              <Text className="text-foreground text-base">
                Voice Memo (00:12)
              </Text>
            </View>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  )
}
