import { AccountType } from '@/data/client/db-schema'
import { useGetAccounts } from '@/data/client/queries'
import { useAccountModalActions } from '@/lib/storage/account-modal-store'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AccountCard } from './components/account-card'
import { AddAccountButton } from './components/add-account-button'
import { useAccountSettingsState } from './lib/account-settings-store'

interface Props {
  accountType: AccountType
}

export default function TabsAccountsScreen({ accountType }: Props) {
  const insets = useSafeAreaInsets()
  const { userId } = useUserSession()

  const { openAccountModalForCreate, openAccountModalForEdit } =
    useAccountModalActions()

  const { showArchived } = useAccountSettingsState()

  const { data: accounts } = useGetAccounts({
    userId,
    accountType,
    isArchived: showArchived ? undefined : false
  })

  return (
    <ScrollView
      className="my-4 flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        { paddingHorizontal: 16, paddingTop: 8 },
        { paddingBottom: insets.bottom + 20 }
      ]}
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
