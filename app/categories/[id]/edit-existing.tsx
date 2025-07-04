import { CategoryForm } from '@/components/categories/category-form'
import { useUserSession } from '@/lib/hooks'
import { useGetCategory } from '@/lib/powersync/data/queries'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function EditExistingCategoryScreen() {
  const { id } = useLocalSearchParams()
  const { userId } = useUserSession()
  const insets = useSafeAreaInsets()

  const { data: category, isLoading } = useGetCategory({
    userId,
    categoryId: typeof id === 'string' ? id : ''
  })

  if (isLoading) return null

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <CategoryForm
        category={category?.[0]}
        categoryType={category?.[0]?.type}
      />
    </View>
  )
}
