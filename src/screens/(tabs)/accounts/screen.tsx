import { AccountType } from '@/data/client/db-schema'
import { getAccounts } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useAccountModalActions } from '@/lib/storage/account-modal-store'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'
import { AccountCard } from './components/account-card'
import { AddAccountButton } from './components/add-account-button'
import { useAccountSettingsState } from './lib/account-settings-store'

interface Props {
  accountType: AccountType
}

export default function TabsAccountsScreen({ accountType }: Props) {
  const { userId } = useUserSession()

  const { openAccountModalForCreate, openAccountModalForEdit } =
    useAccountModalActions()

  const { showArchived } = useAccountSettingsState()

  const { data: accounts } = useDrizzleQuery(
    getAccounts({
      userId,
      accountType,
      isArchived: showArchived ? undefined : false
    })
  )

  return (
    <ScrollView
      className="bg-background my-4 flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="px-4 pt-2 pb-safe-offset-5"
    >
      {accounts.map(account => (
        <AccountCard
          key={account.id}
          account={account}
          onPress={() => router.push(`/accounts/${account.id}`)}
          onLongPress={() => openAccountModalForEdit(account)}
        />
      ))}

      <AddAccountButton
        onPress={() => openAccountModalForCreate(accountType)}
      />
    </ScrollView>
  )
}
