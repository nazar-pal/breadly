import {
  useAddTransactionActions,
  useAddTransactionState
} from '@/lib/storage/add-transaction-store'
import React from 'react'
import { Modal } from '../modal'
import { QuickCalculator } from '../quick-calculator'
import { useCategoryType } from './lib/use-category-type'

export function CalculatorModal() {
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
        <QuickCalculator
          type={activeCategoryType}
          categoryId={addTransactionSelectedCategory}
          onClose={closeAddTransactionModal}
        />
      )}
    </Modal>
  )
}
