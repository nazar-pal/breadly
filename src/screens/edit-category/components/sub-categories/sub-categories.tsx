import { Icon } from '@/components/ui/icon-by-name'
import { CategorySelectSQLite } from '@/data/client/db-schema'
import { reorderCategories } from '@/data/client/mutations'
import { getCategories, GetCategoriesResultItem } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useCategoryFormModalActions } from '@/lib/storage/category-form-modal-store'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { CategoryCard } from './category-card'

interface SubcategoriesInfoProps {
  category: CategorySelectSQLite
}

type SubcategoryRenderItemProps =
  DragListRenderItemInfo<GetCategoriesResultItem>

export function SubCategories({ category }: SubcategoriesInfoProps) {
  const { userId } = useUserSession()
  const { openCategoryFormModal } = useCategoryFormModalActions()

  // Fetch existing subcategories for this category
  const { data: existingSubcategories } = useDrizzleQuery(
    getCategories({
      userId,
      type: category.type,
      parentId: category.id
    })
  )

  // Handle reordering subcategories
  const handleSubcategoriesReordered = async (
    fromIndex: number,
    targetIndex: number
  ) => {
    const subcategoryId = existingSubcategories[fromIndex].id

    await reorderCategories({
      userId,
      parentId: category.id, // Parent is the current category
      categoryId: subcategoryId,
      targetIndex,
      isArchived: false, // Subcategories are not archived in this context
      type: category.type
    })
  }

  // Render subcategory item for DragList
  const renderSubcategoryItem = ({
    item,
    onDragStart,
    onDragEnd,
    isActive
  }: SubcategoryRenderItemProps) => {
    // Extract the category data, excluding transactions
    const { transactions, ...categoryData } = item

    return (
      <CategoryCard
        key={categoryData.id}
        category={categoryData}
        className={cn(
          'border-border/50 bg-muted/30 shadow-sm',
          isActive && 'border-primary/50'
        )}
        onPress={() => {
          openCategoryFormModal({
            parentId: category.id,
            categoryId: categoryData.id,
            type: category.type
          })
        }}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
      />
    )
  }

  return (
    <View className="rounded-2xl border border-border bg-card p-6">
      {/* Section Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="rounded-lg bg-muted/50 p-2">
            <Icon name="Layers2" size={20} className="text-muted-foreground" />
          </View>
          <View>
            <Text className="text-lg font-bold text-foreground">
              Subcategories
            </Text>
            <Text className="text-sm text-muted-foreground">
              Optional • {existingSubcategories.length} added
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() =>
            openCategoryFormModal({
              parentId: category.id,
              categoryId: null,
              type: category.type
            })
          }
          className="flex-row items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 active:scale-95"
        >
          <Icon
            name="Plus"
            size={16}
            className="text-primary"
            strokeWidth={2.5}
          />
          <Text className="text-sm font-semibold text-primary">Add New</Text>
        </Pressable>
      </View>

      {/* Subcategories List */}
      {existingSubcategories.length > 0 ? (
        <DragList
          data={existingSubcategories}
          keyExtractor={item => item.id}
          renderItem={renderSubcategoryItem}
          showsVerticalScrollIndicator={false}
          onReordered={handleSubcategoriesReordered}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          scrollEnabled={false} // Disable scrolling since we're in a parent ScrollView
        />
      ) : (
        <View className="items-center rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 p-8">
          <View className="mb-4 rounded-full bg-muted/50 p-4">
            <Icon
              name="FolderOpen"
              size={32}
              className="text-muted-foreground/70"
            />
          </View>
          <Text className="mb-2 text-center text-base font-medium text-foreground">
            No subcategories yet
          </Text>
          <Text className="text-center text-sm leading-relaxed text-muted-foreground">
            Create subcategories to better organize your transactions and get
            more detailed insights.
          </Text>
        </View>
      )}
    </View>
  )
}
