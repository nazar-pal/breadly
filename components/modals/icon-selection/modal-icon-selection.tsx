import { Icon, type IconName } from '@/components/icon'
import { Modal } from '@/components/modals/modal'
import { updateCategory } from '@/data/client/mutations'
import { useGetCategory } from '@/data/client/queries'
import {
  useCategoryFormModalActions,
  useCategoryFormModalState
} from '@/lib/storage/category-form-modal-store'
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconsGrid } from './icons-grid'

export function IconSelectionModal() {
  const insets = useSafeAreaInsets()

  const { categoryId, isIconModalOpen } = useCategoryFormModalState()
  const { closeCategoryFormModal } = useCategoryFormModalActions()
  const { userId } = useUserSession()

  const categoryData = useGetCategory({ userId, categoryId: categoryId ?? '' })
    .data?.[0]

  const handleIconSelect = async (iconName: IconName) => {
    if (!categoryData) return

    await updateCategory({
      id: categoryData.id,
      userId,
      data: { icon: iconName as string }
    })
    closeCategoryFormModal()
  }

  if (!categoryData) return null

  return (
    <Modal
      isVisible={isIconModalOpen}
      onClose={closeCategoryFormModal}
      height="100%"
      showDragIndicator={false}
      enableSwipeToClose={true}
      enableBackdropClose={true}
      className="bg-background"
    >
      <View className="flex-1">
        <View
          className="flex-row items-center border-b border-border/50 bg-background px-6 py-4"
          style={{ paddingTop: insets.top + 16 }}
        >
          <Pressable
            onPress={closeCategoryFormModal}
            className="mr-4 rounded-full p-2 active:scale-95"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name="ArrowLeft"
              size={24}
              className="text-foreground"
              strokeWidth={2}
            />
          </Pressable>
          <Text className="flex-1 text-xl font-semibold text-foreground">
            Choose an icon for your {categoryData.type} category
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 24,
            paddingBottom: insets.bottom + 24,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={true}
          bounces={true}
          alwaysBounceVertical={false}
        >
          <IconsGrid
            categoryType={categoryData.type}
            selectedIcon={categoryData.icon as IconName}
            onIconSelect={handleIconSelect}
          />
        </ScrollView>
      </View>
    </Modal>
  )
}
