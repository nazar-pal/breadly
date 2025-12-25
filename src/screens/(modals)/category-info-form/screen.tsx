import {
  useCategoryFormModalActions,
  useCategoryFormModalState
} from '@/lib/storage/category-form-modal-store'
import React from 'react'
import { ScrollView } from 'react-native'
import { CategoryDetailsForm } from './components/category-details-form'

export default function CategoryDetailsFormModal() {
  const { categoryId, parentId, type } = useCategoryFormModalState()
  const { closeCategoryFormModal } = useCategoryFormModalActions()

  return (
    <ScrollView
      className="p-4"
      contentContainerClassName="pb-12"
      showsVerticalScrollIndicator={true}
      bounces={true}
      alwaysBounceVertical={false}
    >
      <CategoryDetailsForm
        onClose={closeCategoryFormModal}
        parentId={parentId}
        categoryId={categoryId ?? undefined}
        type={type}
      />
    </ScrollView>
  )
}
