import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { getCurrencyInfo } from '@/lib/utils/'
import React from 'react'

export function SelectionTriggerContentCurrency({
  currencyCode,
  render
}: {
  currencyCode: string | null
  render: 'name' | 'icon'
}) {
  const currencyName = currencyCode
    ? getCurrencyInfo(currencyCode)?.currency
    : 'unknown'

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
