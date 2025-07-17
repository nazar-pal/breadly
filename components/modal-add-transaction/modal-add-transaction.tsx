import { Modal } from '@/components/modal'
import {
  useAddTransactionActions,
  useAddTransactionState
} from '@/lib/storage/add-transaction-store'
import React from 'react'
import { useCategoryType } from '../categories/lib/use-category-type'
import { CalculatorWithForm } from './calculator-with-form'

export function ModalAddTransaction() {
  const { isAddTransactionModalOpen, addTransactionSelectedCategory } =
    useAddTransactionState()
  const { closeAddTransactionModal } = useAddTransactionActions()

  const activeCategoryType = useCategoryType()

  return (
    <Modal
      isVisible={isAddTransactionModalOpen}
      onClose={closeAddTransactionModal}
    >
      {addTransactionSelectedCategory && (
        <CalculatorWithForm
          type={activeCategoryType}
          categoryId={addTransactionSelectedCategory}
          onClose={closeAddTransactionModal}
        />
      )}
    </Modal>
  )
}
