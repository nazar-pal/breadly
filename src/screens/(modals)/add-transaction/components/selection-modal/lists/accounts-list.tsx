import { useGetAccounts } from '@/data/client/queries'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { useTransactionParamsState } from '../../../store'
import type { Direction } from '../../../types'
import { SelectionList } from '../primitives/selection-list'
import type { SelectableRowProps } from '../types'
import { mapAccountToSelectableRow } from './row-mappers'

interface Props {
  direction: Direction
  onSelect: (accountId: string) => void
}

export function AccountsList({ direction, onSelect }: Props) {
  const { userId } = useUserSession()
  const params = useTransactionParamsState()

  const { data: accounts = [], isLoading } = useGetAccounts({
    userId,
    accountType: 'payment',
    isArchived: false
  })

  const selectedAccountId =
    direction === 'from'
      ? (params?.fromAccountId ?? params?.accountId)
      : params?.toAccountId

  const data: SelectableRowProps[] = accounts.map(account =>
    mapAccountToSelectableRow(account, selectedAccountId, onSelect)
  )

  return (
    <SelectionList
      data={data}
      emptyMessage="No accounts found"
      isLoading={isLoading}
    />
  )
}
