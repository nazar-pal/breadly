import { CategoryType } from '@/data/client/db-schema'
import { reorderCategories } from '@/data/client/mutations/reorder-categories/reorder-categories'
import {
  getCategoriesForEdit,
  GetCategoriesForEditResultItem
} from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { ButtonAddCategory } from './button-add-category'
import { CategoryCard } from './category-card'

type RenderItemProps = DragListRenderItemInfo<GetCategoriesForEditResultItem>

export function Categories({
  type,
  archived
}: {
  type: CategoryType
  archived: boolean
}) {
  const { userId } = useUserSession()

  const isArchived = archived

  const { data: categories } = useDrizzleQuery(
    getCategoriesForEdit({
      userId,
      type,
      isArchived,
      parentId: null
    })
  )

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
      onPress={() => router.push(`/edit-categories/${item.id}`)}
      onLongPress={onDragStart}
      onPressOut={onDragEnd}
    />
  )

  return (
    <View className="mb-safe-offset-4">
      <DragList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        containerStyle={{ marginTop: 16 }}
        showsVerticalScrollIndicator={false}
        onReordered={handleReordered}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={
          !isArchived ? () => <ButtonAddCategory type={type} /> : undefined
        }
      />
    </View>
  )
}
