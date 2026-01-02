import { Icon, type IconName } from '@/components/ui/lucide-icon-by-name'
import { updateCategory } from '@/data/client/mutations'
import { getCategory } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import {
  useCategoryFormModalActions,
  useCategoryFormModalState
} from '@/lib/storage/category-form-modal-store'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/system-v2/session'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { IconsGrid } from './components/icons-grid'

export default function IconSelectionModal() {
  const { categoryId } = useCategoryFormModalState()
  const { closeCategoryFormModal } = useCategoryFormModalActions()
  const { userId } = useUserSession()

  const {
    data: [categoryData]
  } = useDrizzleQuery(getCategory({ userId, categoryId: categoryId ?? '' }))

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

  const isIncome = categoryData.type === 'income'

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-12"
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Header with current selection */}
        <View className="mb-6 flex-row items-center gap-4">
          <View
            className={cn(
              'h-14 w-14 items-center justify-center rounded-2xl',
              isIncome ? 'bg-income/20' : 'bg-expense/20'
            )}
          >
            <Icon
              name={categoryData.icon}
              size={28}
              className={isIncome ? 'text-income' : 'text-expense'}
            />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-lg font-semibold">
              {categoryData.name}
            </Text>
            <Text className="text-muted-foreground text-sm">
              Current: {categoryData.icon}
            </Text>
          </View>
        </View>

        <IconsGrid
          categoryType={categoryData.type}
          selectedIcon={categoryData.icon}
          onIconSelect={handleIconSelect}
        />
      </ScrollView>
    </View>
  )
}
