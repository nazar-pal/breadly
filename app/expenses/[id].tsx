import Card from '@/components/ui-old/Card'
import { useTheme } from '@/context/ThemeContext'
import { mockExpenses } from '@/data/mockData'
import { useLocalSearchParams } from 'expo-router'
import { Calendar, Mic, Tag } from 'lucide-react-native'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()

  // Find the expense with the matching ID
  const expense = mockExpenses.find(e => e.id === id)

  // Placeholder for receipt image
  const receiptImageUrl =
    'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

  if (!expense) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <Text
          className="mt-10 text-center text-lg"
          style={{ color: colors.error }}
        >
          Expense not found
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="mb-6 items-center">
        <Text
          className="mb-2 text-base"
          style={{ color: colors.textSecondary }}
        >
          Amount
        </Text>
        <Text
          className="text-[48px] font-bold"
          style={{ color: colors.expense }}
        >
          ${expense.amount.toFixed(2)}
        </Text>
      </View>

      <Card className="mb-4">
        <View className="flex-row items-center py-3">
          <View
            className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]"
            style={{ backgroundColor: colors.iconBackground.info }}
          >
            <Calendar size={20} color={colors.info} />
          </View>
          <View>
            <Text
              className="mb-1 text-sm"
              style={{ color: colors.textSecondary }}
            >
              Date
            </Text>
            <Text
              className="text-base font-medium"
              style={{ color: colors.text }}
            >
              {expense.date}
            </Text>
          </View>
        </View>

        <View
          className="h-px w-full"
          style={{ backgroundColor: colors.border }}
        />

        <View className="flex-row items-center py-3">
          <View
            className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]"
            style={{ backgroundColor: colors.iconBackground.primary }}
          >
            <Tag size={20} color={colors.primary} />
          </View>
          <View>
            <Text
              className="mb-1 text-sm"
              style={{ color: colors.textSecondary }}
            >
              Category
            </Text>
            <Text
              className="text-base font-medium"
              style={{ color: colors.text }}
            >
              {expense.category}
            </Text>
          </View>
        </View>

        <View
          className="h-px w-full"
          style={{ backgroundColor: colors.border }}
        />

        <View className="flex-row py-3">
          <View className="flex-1">
            <Text
              className="mb-1 text-sm"
              style={{ color: colors.textSecondary }}
            >
              Description
            </Text>
            <Text
              className="text-base leading-6"
              style={{ color: colors.text }}
            >
              {expense.description ?? 'No description provided'}
            </Text>
          </View>
        </View>
      </Card>

      {expense.hasPhoto && (
        <Card className="mb-4">
          <Text
            className="mb-3 text-base font-semibold"
            style={{ color: colors.text }}
          >
            Receipt Photo
          </Text>
          <View
            className="h-[200px] overflow-hidden rounded-lg"
            style={{ backgroundColor: colors.surfaceSecondary }}
          >
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
          <Text
            className="mb-3 text-base font-semibold"
            style={{ color: colors.text }}
          >
            Voice Memo
          </Text>
          <View
            className="flex-row items-center rounded-lg p-3"
            style={{ backgroundColor: colors.iconBackground.warning }}
          >
            <Mic size={24} color={colors.warning} className="mr-2" />
            <Text className="text-base" style={{ color: colors.text }}>
              Voice Memo (00:12)
            </Text>
          </View>
        </Card>
      )}
    </ScrollView>
  )
}
