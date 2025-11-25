import React from 'react'
import { useTransactionParamsActions } from '../../../store'
import type { Direction, TransactionParams } from '../../../types'
import { AccountsList } from '../lists/accounts-list'

export function TransferAccount({
  direction,
  params,
  closeModal
}: {
  direction: Direction
  params: Extract<TransactionParams, { type: 'transfer' }>
  closeModal: () => void
}) {
  const { setTransferParams } = useTransactionParamsActions()

  function handleSelectAccount(accountId: string) {
    setTransferParams({
      ...params,
      ...(direction === 'from'
        ? {
            fromAccountId: accountId,
            toAccountId:
              accountId === params.toAccountId ? null : params.toAccountId
          }
        : {
            toAccountId: accountId,
            fromAccountId:
              accountId === params.fromAccountId ? null : params.fromAccountId
          })
    })
    closeModal()
  }
  return <AccountsList direction={direction} onSelect={handleSelectAccount} />
}
