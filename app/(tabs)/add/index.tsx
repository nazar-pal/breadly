import ExpenseForm from '@/components/expenses/ExpenseForm'
import { useTheme } from '@/context/ThemeContext'
import { router } from 'expo-router'
import React from 'react'
import { Alert, View } from 'react-native'

export default function ManualScreen() {
  const { colors } = useTheme()

  function handleSubmit(data: any) {
    // TODO: persist data
    Alert.alert('Success', 'Expense saved!')
    router.push('/') // back to dashboard
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ExpenseForm onSubmit={handleSubmit} />
    </View>
  )
}
