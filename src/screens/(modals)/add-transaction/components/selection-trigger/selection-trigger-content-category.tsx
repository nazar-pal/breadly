import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { getCategory } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { SelectionSlot } from '../../utils/params-derived'

export function SelectionTriggerContentCategory({
  render,
  slot
}: {
  slot: Extract<SelectionSlot, { kind: 'category' }>
  render: 'name' | 'icon'
}) {
  const { userId } = useUserSession()

  const { data } = useDrizzleQuery(
    getCategory({ userId, categoryId: slot.categoryId ?? '' })
  )
  const category = data.length > 0 ? data[0] : null

  const categoryName = category?.parent?.name ?? category?.name ?? 'unknown'
  const categoryIcon = category?.parent?.icon ?? category?.icon ?? 'Unknown'

  if (render === 'name') {
    return (
      <Text
        className={cn(
          'text-sm font-semibold text-foreground',
          slot.type === 'income' && slot.direction === 'to' && 'text-income',
          slot.type === 'expense' && slot.direction === 'to' && 'text-expense'
        )}
        numberOfLines={1}
      >
        {slot.categoryId ? categoryName : 'Select category'}
      </Text>
    )
  }

  if (render === 'icon') {
    return (
      <Icon
        name={slot.categoryId ? categoryIcon : 'Tag'}
        size={14}
        className="text-primary"
      />
    )
  }

  return null
}
