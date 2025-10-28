import { Icon } from '@/components/ui/icon-by-name'
import { CategoryType } from '@/data/client/db-schema'
import { useCategoryFormModalActions } from '@/lib/storage/category-form-modal-store'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  className?: string
  type: CategoryType
}

export function ButtonAddCategory({ type, className }: Props) {
  const { openCategoryFormModal } = useCategoryFormModalActions()

  const handleAddCategory = () =>
    openCategoryFormModal({ parentId: null, categoryId: null, type })

  return (
    <Pressable
      className={cn(
        'flex-1 flex-row items-center justify-center gap-2',
        className
      )}
      onPress={handleAddCategory}
    >
      <Icon name="Plus" className="text-muted-foreground" />
      <Text className="text-sm font-medium text-foreground">Add Category</Text>
    </Pressable>
  )
}
