import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { useGetAccount } from '../../hooks/use-get-account'

export function SelectionTriggerContentAccount({
  accountId,
  render
}: {
  accountId: string | null
  render: 'name' | 'icon'
}) {
  const { userId } = useUserSession()

  const { data } = useGetAccount({ userId, accountId: accountId ?? '' })
  const account = data.length > 0 ? data[0] : null

  const accountName = account?.name ?? 'unknown'

  if (render === 'name') {
    return (
      <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
        {accountId ? accountName : 'Select account'}
      </Text>
    )
  }

  if (render === 'icon') {
    return <Icon name="Wallet" size={14} className="text-primary" />
  }

  return null
}
