import React from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { useTheme } from '@/context/ThemeContext'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import { router } from 'expo-router'

export default function ManualScreen() {
  const { colors } = useTheme()

  function handleSubmit(data: any) {
    // TODO: persist data
    Alert.alert('Success', 'Expense saved!')
    router.push('/') // back to dashboard
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ExpenseForm onSubmit={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
