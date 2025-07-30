import { Plus } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, Text } from 'react-native'
import { useCategoryType } from '../lib/use-category-type'

interface Props {
  className?: string
}

export function ButtonAddCategory({ className }: Props) {
  const categoryType = useCategoryType()

  function handleAddCategory() {
    if (categoryType === 'income') {
      router.push('/categories/add-new/income')
    } else {
      router.push('/categories/add-new/expense')
    }
  }
  return (
    <Pressable
      className={cn(
        'mt-4 flex flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/50 p-3',
        className
      )}
      onPress={handleAddCategory}
    >
      <Plus className="text-muted-foreground" />
      <Text className="text-sm font-medium text-foreground">Add Category</Text>
    </Pressable>
  )
}
