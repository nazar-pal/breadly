import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export function EmptyTodayMessage() {
  return (
    <Text className="text-muted-foreground">
      Don&apos;t forget to input your transactions when you make them 📝
    </Text>
  )
}

export function NoTransactionsState() {
  return (
    <View className="bg-background flex-1 items-center justify-center px-4">
      <Text className="text-foreground mb-2 text-center">
        You haven&apos;t created any transactions yet.
      </Text>
      <Text className="text-muted-foreground text-center">
        Head over to the{' '}
        <Link
          href={{ pathname: '/', params: { type: 'expense' } }}
          className="text-primary underline"
        >
          Categories
        </Link>{' '}
        screen to add your first one!
      </Text>
    </View>
  )
}

export function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text className="text-foreground text-center">
        Loading transactions...
      </Text>
    </View>
  )
}
