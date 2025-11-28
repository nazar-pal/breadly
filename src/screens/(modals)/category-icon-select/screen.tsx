import { type IconName } from '@/components/ui/icon-by-name'
import { updateCategory } from '@/data/client/mutations'
import { getCategory } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import {
  useCategoryFormModalActions,
  useCategoryFormModalState
} from '@/lib/storage/category-form-modal-store'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { ScrollView, Text } from 'react-native'
import { IconsGrid } from './components/icons-grid'

export default function IconSelectionModal() {
  const { categoryId } = useCategoryFormModalState()
  const { closeCategoryFormModal } = useCategoryFormModalActions()
  const { userId } = useUserSession()

  const categoryData = useDrizzleQuery(
    getCategory({ userId, categoryId: categoryId ?? '' })
  ).data?.[0]

  const handleIconSelect = async (iconName: IconName) => {
    if (!categoryData) return

    await updateCategory({
      id: categoryData.id,
      userId,
      data: { icon: iconName }
    })
    closeCategoryFormModal()
  }

  if (!categoryData) return null

  return (
    <ScrollView
      className="p-4"
      contentContainerClassName="pb-12"
      showsVerticalScrollIndicator={true}
      bounces={true}
      alwaysBounceVertical={false}
    >
      <Text className="text-foreground mb-3 text-xl font-semibold">
        {categoryData.name} category
      </Text>
      <IconsGrid
        categoryType={categoryData.type}
        selectedIcon={categoryData.icon}
        onIconSelect={handleIconSelect}
      />
    </ScrollView>
  )
}
