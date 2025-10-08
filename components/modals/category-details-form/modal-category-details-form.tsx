import {
  useCategoryFormModalActions,
  useCategoryFormModalState
} from '@/lib/storage/category-form-modal-store'
import React from 'react'
import { CenteredModal } from '../centered-modal'
import { CategoryDetailsForm } from './category-details-form'

export function CategoryDetailsFormModal() {
  const { categoryId, parentId, isModalOpen } = useCategoryFormModalState()
  const { closeCategoryFormModal } = useCategoryFormModalActions()

  return (
    <CenteredModal
      visible={isModalOpen}
      showCloseButton={false}
      onRequestClose={closeCategoryFormModal}
    >
      <CategoryDetailsForm
        onClose={closeCategoryFormModal}
        parentId={parentId}
        categoryId={categoryId ?? undefined}
      />
    </CenteredModal>
  )
}
