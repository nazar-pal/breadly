import { useGetCurrencies } from '@/data/client/queries'
import React from 'react'
import { useTransactionParamsState } from '../../../store'
import { SelectionList } from '../primitives/selection-list'
import type { SelectableRowProps } from '../types'
import { mapCurrencyToSelectableRow } from './row-mappers'

interface Props {
  onSelect: (currencyCode: string) => void
}

export function CurrenciesList({ onSelect }: Props) {
  const params = useTransactionParamsState()

  const selectedCurrencyCode = params?.currencyCode

  const { data: currencies = [], isLoading } = useGetCurrencies()

  const data: SelectableRowProps[] = currencies.map(currency =>
    mapCurrencyToSelectableRow(currency, selectedCurrencyCode, onSelect)
  )

  return (
    <SelectionList
      data={data}
      emptyMessage="No currencies available"
      isLoading={isLoading}
    />
  )
}
