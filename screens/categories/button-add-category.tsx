import { Icon } from '@/components/icon'
import { useCategoryType } from '@/lib/hooks'
import { useCategoryFormModalActions } from '@/lib/storage/category-form-modal-store'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  className?: string
}

export function ButtonAddCategory({ className }: Props) {
  const type = useCategoryType()

  const { openCategoryFormModal } = useCategoryFormModalActions()

  const handleAddCategory = () =>
    openCategoryFormModal({ parentId: null, categoryId: null, type })

  return (
    <Pressable
      className={cn(
        'mt-4 flex flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/50 p-3',
        className
      )}
      onPress={handleAddCategory}
    >
      <Icon name="Plus" className="text-muted-foreground" />
      <Text className="text-sm font-medium text-foreground">Add Category</Text>
    </Pressable>
  )
}
