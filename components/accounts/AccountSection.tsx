import { Text } from '@/components/ui/text'
import { AccountSelectSQLite } from '@/lib/powersync/schema/table_6_accounts'
import React from 'react'
import { View } from 'react-native'
import AccountCard from './AccountCard'
import AddAccountButton from './AddAccountButton'

interface AccountSectionProps {
  title: string
  accounts: AccountSelectSQLite[]
  accountType: 'saving' | 'payment' | 'debt'
  onEditAccount: (account: AccountSelectSQLite) => void
  onAddAccount: (type: 'saving' | 'payment' | 'debt') => void
}

const ADD_BUTTON_LABELS: Record<string, string> = {
  payment: 'Add Payment',
  saving: 'Add Savings',
  debt: 'Add Debt'
}

export default function AccountSection({
  title,
  accounts,
  accountType,
  onEditAccount,
  onAddAccount
}: AccountSectionProps) {
  return (
    <View className="mb-8">
      <Text className="mb-4 text-xl font-bold tracking-tight text-foreground">
        {title}
      </Text>
      <View className="flex-col">
        {accounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            onPress={() => onEditAccount(account)}
          />
        ))}
        <AddAccountButton
          onPress={() => onAddAccount(accountType)}
          label={ADD_BUTTON_LABELS[accountType] || 'Add Account'}
        />
      </View>
    </View>
  )
}
