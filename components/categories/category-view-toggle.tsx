import { List, SquarePen } from '@/lib/icons'
import { useCategoryViewStore } from '@/lib/storage/category-view-store'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export function CategoryViewToggle() {
  const { viewType, toggleViewType } = useCategoryViewStore()

  return (
    <View className="flex-row items-center justify-end px-4 py-2">
      <Text className="mr-3 text-xs text-muted-foreground">View:</Text>

      <Pressable
        onPress={toggleViewType}
        className={`flex-row items-center gap-2 rounded-lg px-3 py-2 ${
          viewType === 'compact'
            ? 'border border-primary/20 bg-primary/10'
            : 'border border-border bg-muted/50'
        }`}
      >
        {viewType === 'compact' ? (
          <SquarePen size={16} className="text-primary" />
        ) : (
          <List size={16} className="text-foreground" />
        )}
        <Text
          className={`text-xs font-medium ${
            viewType === 'compact' ? 'text-primary' : 'text-foreground'
          }`}
        >
          {viewType === 'compact' ? 'Compact' : 'Extended'}
        </Text>
      </Pressable>
    </View>
  )
}
