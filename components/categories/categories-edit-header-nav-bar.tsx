import { Link } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { useCategoryType } from './lib/use-category-type'

export function EditCategoriesHeaderNavBar() {
  const activeCategoryType = useCategoryType()

  return (
    <View className="mt-1 flex-row gap-2">
      <Link replace href="/categories/edit/expense" asChild>
        <Pressable
          className={`mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2 ${
            activeCategoryType === 'expense'
              ? 'border border-primary bg-primary/10'
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
      </Link>

      <Link replace href="/categories/edit/income" asChild>
        <Pressable
          className={`mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2 ${
            activeCategoryType === 'income'
              ? 'border border-primary bg-primary/10'
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
      </Link>
    </View>
  )
}
