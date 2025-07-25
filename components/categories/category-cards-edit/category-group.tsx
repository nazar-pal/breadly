import { CategorySelectSQLite } from '@/lib/powersync/schema/table_4_categories'
import { cn } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'
import { CategoryCard } from './category-card'

interface Props {
  categoryGroup: CategorySelectSQLite & {
    subcategories: CategorySelectSQLite[]
  }
  isArchived?: boolean
  onPress: (categoryId: string) => void
  onLongPress: (categoryId: string) => void
}

export function CategoryGroup({
  categoryGroup,
  isArchived = false,
  onPress,
  onLongPress
}: Props) {
  return (
    <View
      className={cn(
        'rounded-2xl border p-3',
        isArchived
          ? 'border-dashed border-border bg-muted/50'
          : 'border-border bg-card'
      )}
    >
      {/* Parent Category */}
      <CategoryCard
        category={categoryGroup}
        onPress={() => onPress(categoryGroup.id)}
        onLongPress={() => onLongPress(categoryGroup.id)}
      />

      {/* Subcategories */}
      {categoryGroup.subcategories.length > 0 && (
        <View className="ml-4 mt-3 gap-2">
          {categoryGroup.subcategories.map(subcategory => (
            <CategoryCard
              key={subcategory.id}
              category={subcategory}
              onPress={() => onPress(subcategory.id)}
              onLongPress={() => onLongPress(subcategory.id)}
              className="rounded-xl border border-border/50 bg-muted/30 p-2"
            />
          ))}
        </View>
      )}
    </View>
  )
}
