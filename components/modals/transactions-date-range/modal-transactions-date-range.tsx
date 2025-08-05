import {
  useCategoriesDateRangeActions,
  useCategoriesDateRangeState
} from '@/lib/storage/categories-date-range-store'
import React, { useState } from 'react'
import { Modal } from '../modal'
import { CustomDatePicker } from './custom-date-picker'
import { Header } from './header'
import { ModeSelection } from './mode-selection'

export function ModalTransactionsDateRange({
  triggerError
}: {
  triggerError: () => void
}) {
  const [isPickingCustomRange, setIsPickingCustomRange] = useState(false)

  const { isDateRangeModalOpen } = useCategoriesDateRangeState()
  const { closeDateRangeModal } = useCategoriesDateRangeActions()

  /* ------------------------------------------------------------------------ */
  const handleCloseModal = () => {
    setIsPickingCustomRange(false)
    closeDateRangeModal()
  }

  return (
    <Modal isVisible={isDateRangeModalOpen} onClose={closeDateRangeModal}>
      <Header
        triggerError={triggerError}
        showCustomPicker={isPickingCustomRange}
      />

      {!isPickingCustomRange ? (
        <ModeSelection
          handleClose={handleCloseModal}
          setShowCustomPicker={setIsPickingCustomRange}
        />
      ) : (
        <CustomDatePicker
          onDone={handleCloseModal}
          onCancel={() => setIsPickingCustomRange(false)}
        />
      )}
    </Modal>
  )
}
