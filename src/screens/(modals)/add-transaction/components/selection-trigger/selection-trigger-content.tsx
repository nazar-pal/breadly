import React from 'react'
import { SelectionSlot } from '../../utils/params-derived'
import { SelectionTriggerContentAccount } from './selection-trigger-content-account'
import { SelectionTriggerContentCategory } from './selection-trigger-content-category'
import { SelectionTriggerContentCurrency } from './selection-trigger-content-currency'

export function SelectionTriggerContent({
  render,
  slot
}: {
  render: 'name' | 'icon'
  slot: SelectionSlot
}) {
  if (slot.kind === 'account')
    return (
      <SelectionTriggerContentAccount
        accountId={slot.accountId}
        render={render}
      />
    )

  if (slot.kind === 'currency')
    return (
      <SelectionTriggerContentCurrency
        currencyCode={slot.currencyCode}
        render={render}
      />
    )

  if (slot.kind === 'category')
    return <SelectionTriggerContentCategory render={render} slot={slot} />

  return null
}
