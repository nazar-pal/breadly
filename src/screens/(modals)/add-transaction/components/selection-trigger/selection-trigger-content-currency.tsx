import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { getCurrency } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import React from 'react'

export function SelectionTriggerContentCurrency({
  currencyCode,
  render
}: {
  currencyCode: string | null
  render: 'name' | 'icon'
}) {
  const { data } = useDrizzleQuery(
    getCurrency({ currencyCode: currencyCode ?? '' })
  )
  const currency = data?.length > 0 ? data[0] : null

  const currencyName = currency?.name ?? 'unknown'

  if (render === 'name') {
    return (
      <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
        {currencyCode ? currencyName : 'Select account or currency'}
      </Text>
    )
  }

  if (render === 'icon') {
    return (
      <Icon
        name={currencyCode ? 'BadgeDollarSign' : 'DollarSign'}
        size={14}
        className="text-primary"
      />
    )
  }

  return null
}
