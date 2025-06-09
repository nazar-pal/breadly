import ExpenseForm from '@/components/expenses/ExpenseForm'
import { router } from 'expo-router'
import React from 'react'
import { Alert, View } from 'react-native'

export default function ManualScreen() {
  function handleSubmit(data: any) {
    // TODO: persist data
    Alert.alert('Success', 'Expense saved!')
    router.push('/') // back to dashboard
  }

  return (
    <View className="flex-1 bg-old-background">
      <ExpenseForm onSubmit={handleSubmit} />
    </View>
  )
}
