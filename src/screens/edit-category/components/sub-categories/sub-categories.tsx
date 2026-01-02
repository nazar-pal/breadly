import { Icon } from '@/components/ui/lucide-icon-by-name'
import { CategorySelectSQLite } from '@/data/client/db-schema'
import { reorderCategories } from '@/data/client/mutations'
import {
  getCategoriesWithTransactions,
  GetCategoriesWithTransactionsResultItem
} from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useCategoryFormModalActions } from '@/lib/storage/category-form-modal-store'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/system-v2/session'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { CategoryCard } from './category-card'

interface SubcategoriesInfoProps {
  category: CategorySelectSQLite
}

type SubcategoryRenderItemProps =
  DragListRenderItemInfo<GetCategoriesWithTransactionsResultItem>

export function SubCategories({ category }: SubcategoriesInfoProps) {
  const { userId } = useUserSession()
  const { openCategoryFormModal } = useCategoryFormModalActions()

  // Fetch existing subcategories for this category
  const { data: existingSubcategories } = useDrizzleQuery(
    getCategoriesWithTransactions({
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
    <View className="border-border bg-card rounded-2xl border p-6">
      {/* Section Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="bg-muted/50 rounded-lg p-2">
            <Icon name="Layers2" size={20} className="text-muted-foreground" />
          </View>
          <View>
            <Text className="text-foreground text-lg font-bold">
              Subcategories
            </Text>
            <Text className="text-muted-foreground text-sm">
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
          className="border-primary/30 bg-primary/10 flex-row items-center gap-2 rounded-xl border px-4 py-3 active:scale-95"
        >
          <Icon
            name="Plus"
            size={16}
            className="text-primary"
            strokeWidth={2.5}
          />
          <Text className="text-primary text-sm font-semibold">Add New</Text>
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
        <View className="border-muted-foreground/30 bg-muted/20 items-center rounded-2xl border border-dashed p-8">
          <View className="bg-muted/50 mb-4 rounded-full p-4">
            <Icon
              name="FolderOpen"
              size={32}
              className="text-muted-foreground/70"
            />
          </View>
          <Text className="text-foreground mb-2 text-center text-base font-medium">
            No subcategories yet
          </Text>
          <Text className="text-muted-foreground text-center text-sm leading-relaxed">
            Create subcategories to better organize your transactions and get
            more detailed insights.
          </Text>
        </View>
      )}
    </View>
  )
}
