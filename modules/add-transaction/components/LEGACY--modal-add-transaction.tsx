import { Modal } from '@/components/modals/modal'
import { useCategoryType } from '@/lib/hooks'
import {
  useAddTransactionActions,
  useAddTransactionState
} from '@/modules/add-transaction/lib/LEGACY--add-transaction-store'
import React from 'react'
import { AddTransaction } from './add-transaction'

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
        <AddTransaction
          type={activeCategoryType}
          categoryId={addTransactionSelectedCategory}
          onClose={closeAddTransactionModal}
        />
      )}
    </Modal>
  )
}
