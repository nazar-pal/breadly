import { AccountType } from '@/data/client/db-schema'
import { useUserSession } from '@/modules/session-and-migration'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGetAccounts } from '../../data'
import { useAccountModalActions } from '../../store'
import { AccountCard } from './account-card'
import { AddAccountButton } from './add-account-button'

interface Props {
  accountType: AccountType
}

export function AccountsByTypeScreen({ accountType }: Props) {
  const insets = useSafeAreaInsets()
  const { userId } = useUserSession()

  const { openAccountModalForCreate, openAccountModalForEdit } =
    useAccountModalActions()

  const { data: accounts } = useGetAccounts({
    userId,
    accountType
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
