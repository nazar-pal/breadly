import ExpenseForm from '@/components/expenses/ExpenseForm'
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
    router.push('/(tabs)') // back to dashboard
  }

  return (
    <View className="bg-background flex-1 p-4">
      <ExpenseForm onSubmit={handleSubmit} />
    </View>
  )
}
