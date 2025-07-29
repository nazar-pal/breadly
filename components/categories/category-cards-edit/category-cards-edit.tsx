import { useUserSession } from '@/lib/hooks'
import { useGetCategoriesForEdit } from '@/lib/powersync/data/queries'
import { useEditCategoriesState } from '@/lib/storage/edit-categories-store'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCategoryType } from '../lib/use-category-type'
import { ButtonAddCategory } from './button-add-category'
import { CategoryCard } from './category-card'

interface Props {
  categoryType: 'income' | 'expense'
  onPress: (categoryId: string) => void
  onLongPress: (categoryId: string) => void
}

export function CategoryCardsEdit({ onPress, onLongPress }: Props) {
  const { userId } = useUserSession()
  const type = useCategoryType()
  const { showArchived: isArchived } = useEditCategoriesState()

  const { data: categories } = useGetCategoriesForEdit({
    userId,
    type,
    isArchived,
    parentId: null
  })

  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      className="mt-4"
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 flex-col gap-4">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            className="rounded-xl border border-border/50 bg-muted/30 p-2"
            category={category}
            onPress={() => onPress(category.id)}
            onLongPress={() => onLongPress(category.id)}
          />
        ))}
        {!isArchived && (
          <ButtonAddCategory className="rounded-2xl border border-dashed border-border bg-muted/50 p-3" />
        )}
      </View>
    </ScrollView>
  )
}
