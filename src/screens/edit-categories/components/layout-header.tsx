import { CategoryType } from '@/data/client/db-schema'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export function LayoutHeader({
  activeCategoryType
}: {
  activeCategoryType: CategoryType
}) {
  const router = useRouter()

  const handlePress = (type: CategoryType) => {
    router.setParams({ type })
  }
  return (
    <View className="mt-1 flex-row gap-2">
      <Pressable
        onPress={() => handlePress('expense')}
        className={`mt-2 mb-1 flex-1 items-center rounded-md px-2 py-2 ${
          activeCategoryType === 'expense'
            ? 'border-primary bg-primary/10 border'
            : 'bg-transparent'
        }`}
      >
        <Text
          className={`mb-0.5 text-base font-semibold ${
            activeCategoryType === 'expense'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Expenses
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handlePress('income')}
        className={`mt-2 mb-1 flex-1 items-center rounded-md px-2 py-2 ${
          activeCategoryType === 'income'
            ? 'border-primary bg-primary/10 border'
            : 'bg-transparent'
        }`}
      >
        <Text
          className={`mb-0.5 text-base font-semibold ${
            activeCategoryType === 'income'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Income
        </Text>
      </Pressable>
    </View>
  )
}
