import { ExpenseForm } from '@/components/ai/expense-form'
import { router } from 'expo-router'
import React from 'react'
import { Alert, View } from 'react-native'

interface ExpenseFormData {
  amount: string
  category: string
  date: string
  description?: string
}

export default function ManualScreen() {
  const handleSubmit = (data: ExpenseFormData) => {
    // TODO: persist data
    Alert.alert('Success', 'Expense saved!')
    router.push('/(protected)/(tabs)') // back to dashboard
  }

  return (
    <View className="flex-1 bg-background p-4">
      <ExpenseForm onSubmit={handleSubmit} />
    </View>
  )
}
