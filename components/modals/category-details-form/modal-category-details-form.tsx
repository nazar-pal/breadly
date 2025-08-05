import {
  useCategoryFormModalActions,
  useCategoryFormModalState
} from '@/lib/storage/category-form-modal-store'
import React from 'react'
import { Modal, Pressable, View } from 'react-native'
import { CategoryDetailsForm } from './category-details-form'

export function CategoryDetailsFormModal() {
  const { categoryId, parentId, isModalOpen } = useCategoryFormModalState()
  const { closeCategoryFormModal } = useCategoryFormModalActions()

  return (
    <Modal
      visible={isModalOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={closeCategoryFormModal}
    >
      <View className="flex-1 items-center justify-center">
        {/* Semi-transparent backdrop */}
        <Pressable
          className="absolute inset-0 bg-black/80"
          onPress={closeCategoryFormModal}
        />

        <CategoryDetailsForm
          onClose={closeCategoryFormModal}
          parentId={parentId}
          categoryId={categoryId ?? undefined}
        />
      </View>
    </Modal>
  )
}
