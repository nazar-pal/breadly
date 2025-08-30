import { Modal } from '@/components/modals/modal'
import { useCategoryType } from '@/lib/hooks'
import {
  useAddTransactionActions,
  useAddTransactionState
} from '@/lib/storage/add-transaction-store'
import React from 'react'
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
      height="auto"
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
