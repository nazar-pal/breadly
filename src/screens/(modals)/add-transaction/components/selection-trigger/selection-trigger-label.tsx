import { Text } from '@/components/ui/text'
import React from 'react'
import { SelectionSlot } from '../../utils'

export function SelectionTriggerLabel({ slot }: { slot: SelectionSlot }) {
  const isTransfer = slot.type === 'transfer'
  const hasAccount = slot.kind === 'account'

  const fromLabel = isTransfer
    ? 'From Account'
    : hasAccount
      ? 'Account'
      : 'Currency'
  const toLabel = isTransfer ? 'To Account' : 'Category'

  const label = slot.direction === 'from' ? fromLabel : toLabel

  return (
    <Text className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
      {label}
    </Text>
  )
}
