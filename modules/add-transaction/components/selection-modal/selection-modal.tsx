import { Modal } from '@/components/modals'
import type { TransactionType } from '@/data/client/db-schema'
import React from 'react'
import type { Direction, TransactionParams } from '../../types'
import { AccountOrCurrency } from './content/account-or-currency'
import { ExpenseIncomeCategory } from './content/expense-income-category'
import { TransferAccount } from './content/transfer-account'

type ContentDescriptor =
  | {
      contentType: 'account'
      params: Extract<TransactionParams, { type: 'transfer' }>
      direction: Direction
    }
  | {
      contentType: 'account-currency'
      params: Extract<TransactionParams, { type: 'expense' | 'income' }>
      direction: 'from'
    }
  | {
      contentType: 'category'
      params: Extract<TransactionParams, { type: 'expense' | 'income' }>
      direction: 'to'
    }

function getContentType(
  direction: Direction,
  params: TransactionParams
): ContentDescriptor {
  if (params.type === 'transfer')
    return { contentType: 'account', params, direction }
  if (direction === 'from')
    return { contentType: 'account-currency', params, direction: 'from' }
  return { contentType: 'category', params, direction: 'to' }
}

function getModalTitle(direction: Direction, type: TransactionType): string {
  if (type === 'transfer')
    return direction === 'from' ? 'Select From Account' : 'Select To Account'

  if (direction === 'from') return 'Select Account or Currency'
  return 'Select Category'
}

interface Props {
  visible: boolean
  onClose: () => void
  direction: Direction
  params: TransactionParams
}

export function SelectionModal({
  visible,
  direction: initialDirection,
  params: initialParams,
  onClose
}: Props) {
  const descriptor = getContentType(initialDirection, initialParams)
  const title = getModalTitle(descriptor.direction, descriptor.params.type)

  const content: React.ReactNode = (() => {
    switch (descriptor.contentType) {
      case 'account':
        return (
          <TransferAccount
            direction={descriptor.direction}
            params={descriptor.params}
            closeModal={onClose}
          />
        )
      case 'account-currency':
        return (
          <AccountOrCurrency params={descriptor.params} closeModal={onClose} />
        )
      case 'category':
        return (
          <ExpenseIncomeCategory
            params={descriptor.params}
            closeModal={onClose}
          />
        )
      default:
        return null
    }
  })()
  return (
    <Modal
      isVisible={visible}
      onClose={onClose}
      showDragIndicator={false}
      safeBottomPadding={false}
      title={title}
      height="80%"
      className="bg-popover px-3 pt-6"
    >
      {content}
    </Modal>
  )
}
