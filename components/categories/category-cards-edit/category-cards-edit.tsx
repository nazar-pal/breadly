import { useUserSession } from '@/lib/hooks'
import { reorderCategories } from '@/lib/powersync/data/mutations/reorder-categories/reorder-categories'
import { useGetCategoriesForEdit } from '@/lib/powersync/data/queries'
import { useEditCategoriesState } from '@/lib/storage/edit-categories-store'
import { cn } from '@/lib/utils'
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCategoryType } from '../lib/use-category-type'
import { ButtonAddCategory } from './button-add-category'
import { CategoryCard } from './category-card'

type RenderItemProps = DragListRenderItemInfo<
  ReturnType<typeof useGetCategoriesForEdit>['data'][number]
>

export function CategoryCardsEdit() {
  const { userId } = useUserSession()
  const insets = useSafeAreaInsets()
  const type = useCategoryType()
  const { showArchived: isArchived } = useEditCategoriesState()

  const { data: categories } = useGetCategoriesForEdit({
    userId,
    type,
    isArchived,
    parentId: null
  })

  const handleReordered = async (fromIndex: number, targetIndex: number) => {
    const categoryId = categories[fromIndex].id

    await reorderCategories({
      userId,
      parentId: null,
      categoryId,
      targetIndex,
      isArchived,
      type
    })
  }

  const renderItem = ({
    item,
    onDragStart,
    onDragEnd,
    isActive
  }: RenderItemProps) => (
    <CategoryCard
      key={item.id}
      className={cn(isActive && 'border-primary/50')}
      category={item}
      onPress={() => router.push(`/categories/edit/${item.id}`)}
      onLongPress={onDragStart}
      onPressOut={onDragEnd}
    />
  )

  return (
    <DragList
      data={categories}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      containerStyle={{ marginTop: 16, marginBottom: insets.bottom + 16 }}
      showsVerticalScrollIndicator={false}
      onReordered={handleReordered}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListFooterComponent={
        !isArchived ? () => <ButtonAddCategory /> : undefined
      }
    />
  )
}
