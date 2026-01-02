import { getAccounts } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system-v2/session'
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

  const { data: accounts = [], isLoading } = useDrizzleQuery(
    getAccounts({
      userId,
      accountType: 'payment',
      isArchived: false
    })
  )

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
