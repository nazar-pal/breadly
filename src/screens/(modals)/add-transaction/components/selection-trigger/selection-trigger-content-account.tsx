import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { getAccount } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'

export function SelectionTriggerContentAccount({
  accountId,
  render
}: {
  accountId: string | null
  render: 'name' | 'icon'
}) {
  const { userId } = useUserSession()

  const {
    data: [account]
  } = useDrizzleQuery(getAccount({ userId, accountId: accountId ?? '' }))

  const accountName = account?.name ?? 'unknown'

  if (render === 'name') {
    return (
      <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
        {accountId ? accountName : 'Select account'}
      </Text>
    )
  }

  if (render === 'icon') {
    return <Icon name="Wallet" size={14} className="text-primary" />
  }

  return null
}
